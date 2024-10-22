'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther, formatEther, createWalletClient, createPublicClient, custom, http, encodeFunctionData } from 'viem'
import { polygonAmoy } from 'viem/chains'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`
const TOKEN_ABI = [
  {
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http()
})

export default function TokenApproval() {
  const [spender, setSpender] = useState('')
  const [amount, setAmount] = useState('')
  const [allowance, setAllowance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { address } = useAccount()

  useEffect(() => {
    async function checkAllowance() {
      if (!address) {
        setAllowance(null)
        return
      } else{
        setSpender(address as `0x${string}`)
      }

      try {
        const result = await publicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: TOKEN_ABI,
          functionName: 'allowance',
          args: [address, spender as `0x${string}`],
        })
        setAllowance(result as bigint)
      } catch (error) {
        console.error('Error checking allowance:', error)
        setAllowance(null)
      }
    }

    checkAllowance()
  }, [address, spender, isSuccess])

  const handleApprove = async () => {
    if (!window.ethereum || !address) {
      console.error('MetaMask not detected or not connected')
      return
    }

    setIsLoading(true)
    setIsSuccess(false)

    try {
      const walletClient = createWalletClient({
        chain: polygonAmoy,
        transport: custom(window.ethereum)
      })

      const data = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, parseEther(amount)]
      })

      const hash = await walletClient.sendTransaction({
        account: address,
        to: TOKEN_ADDRESS,
        data,
      })

      console.log('Approval transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error sending approval transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Approve Token Spending
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="spender" className="block text-sm font-medium text-gray-700">Spender Address</label>
          <input
            id="spender"
            type="text"
            className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="0x..."
            value={spender}
            onChange={(e) => setSpender(e.target.value)}
          />
        </div>
        {allowance !== null && (
          <div className="text-sm text-purple-600 bg-purple-50 p-3 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Current Allowance: {formatEther(allowance)} MEM tokens
          </div>
        )}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">New Allowance Amount</label>
          <input
            id="amount"
            type="text"
            className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          onClick={handleApprove}
          disabled={isLoading || !spender || !amount || !address}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
        >
          {allowance && allowance > BigInt(0) ? 'Update Allowance' : 'Approve'}
        </button>
        {isLoading && <div className="text-purple-600 flex items-center"><svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Transaction in progress...</div>}
        {isSuccess && <div className="text-green-600 flex items-center"><svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Transaction Successful!</div>}
      </div>
    </div>
  )
}
