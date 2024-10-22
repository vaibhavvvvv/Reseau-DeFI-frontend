'use client'

import { useState } from 'react'
import { parseEther, createWalletClient, custom, encodeFunctionData } from 'viem'
import { polygonAmoy } from 'viem/chains'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`
const TOKEN_ABI = [
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

export default function TokenTransfer() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleTransfer = async () => {
    if (!window.ethereum) {
      console.error('MetaMask not detected')
      return
    }

    setIsLoading(true)
    setIsSuccess(false)

    try {
      const walletClient = createWalletClient({
        chain: polygonAmoy,
        transport: custom(window.ethereum)
      })

      const [account] = await walletClient.getAddresses()

      const data = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, parseEther(amount)]
      })

      const hash = await walletClient.sendTransaction({
        account,
        to: TOKEN_ADDRESS,
        data,
      })

      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error sending transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transfer Tokens
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">Recipient Address</label>
          <input
            id="to"
            type="text"
            className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            id="amount"
            type="text"
            className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          onClick={handleTransfer}
          disabled={isLoading || !to || !amount}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
        >
          {isLoading ? 'Transferring...' : 'Transfer'}
        </button>
        {isLoading && <div className="text-green-600 flex items-center"><svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Transaction in progress...</div>}
        {isSuccess && <div className="text-green-600 flex items-center"><svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Transaction Successful!</div>}
      </div>
    </div>
  )
}
