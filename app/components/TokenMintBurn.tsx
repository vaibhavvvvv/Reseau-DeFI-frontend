'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { parseEther, createWalletClient, custom } from 'viem'
import { polygonAmoy } from 'viem/chains'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`
const TOKEN_ABI = [
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    type: 'function',
  },
  {
    inputs: [
      { name: '_value', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    type: 'function',
  },
] as const

export default function TokenMintBurn() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [operation, setOperation] = useState<'mint' | 'burn'>('mint')
  const { address } = useAccount()

  const handleOperation = async () => {
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

      const functionName = operation === 'mint' ? 'mint' : 'burn'
      const args = operation === 'mint' ? [recipient, parseEther(amount)] : [parseEther(amount)]

      const hash = await walletClient.writeContract({
        account: address ?? null,
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: functionName,
        args,
      })

      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGradientClass = () => 
    operation === 'mint' 
      ? 'from-blue-500 to-blue-700' 
      : 'from-red-500 to-red-700'

  const getButtonClass = (buttonOperation: 'mint' | 'burn') =>
    `px-4 py-2 rounded-md font-medium transition-colors ${
      operation === buttonOperation
        ? operation === 'mint' 
          ? 'bg-blue-500 text-white' 
          : 'bg-red-500 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`

  const getActionButtonClass = () =>
    `w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition duration-200 ${
      operation === 'mint'
        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    }`

  return (
    <div className="bg-[#EBE1D8] shadow-[-10px_10px_0_0_#000000] m-4 rounded-lg overflow-hidden">
    <div className="p-4">
      <h2 className="text-2xl font-bold text-[#373737] flex items-center border-b border-[#373737]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Token Operations
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-start space-x-4 mb-2">
          <button
            className={getButtonClass('mint')}
            onClick={() => setOperation('mint')}
          >
            Mint
          </button>
          <button
            className={getButtonClass('burn')}
            onClick={() => setOperation('burn')}
          >
            Burn
          </button>
        </div>

        {operation === 'mint' && (
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient Address</label>
            <input
              id="recipient"
              type="text"
              className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="relative mt-1">
            <input
              id="amount"
              type="text"
              className={`block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm py-2 px-3 pr-12 focus:outline-none ${
                operation === 'mint' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'
              }`}
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              Tokens
            </span>
          </div>
        </div>

        <button
          onClick={handleOperation}
          disabled={isLoading || !amount || (operation === 'mint' && !recipient)}
          className={getActionButtonClass()}
        >
          {isLoading ? `${operation === 'mint' ? 'Minting' : 'Burning'}...` : operation === 'mint' ? 'Mint Tokens' : 'Burn Tokens'}
        </button>

        {isLoading && (
          <div className={`text-${operation === 'mint' ? 'blue' : 'red'}-600 flex items-center`}>
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Transaction in progress...
          </div>
        )}
        {isSuccess && (
          <div className="text-green-600 flex items-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transaction Successful!
          </div>
        )}
      </div>
    </div>
  )
}
