'use client'

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatEther, Address } from 'viem'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`

const TOKEN_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  }
] as const

export default function TokenInfo() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', balance: BigInt(0) })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokenInfo() {
      if (!publicClient) {
        console.log('Public client not available')
        return
      }

      try {
        const [name, symbol, balance] = await Promise.all([
          publicClient.readContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'name',
          }) as Promise<string>,
          publicClient.readContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'symbol',
          }) as Promise<string>,
          address ? publicClient.readContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address as Address],
          }) as Promise<bigint> : Promise.resolve(BigInt(0))
        ])

        console.log('Name:', name)
        console.log('Symbol:', symbol)
        console.log('Balance:', balance)

        setTokenInfo({ name, symbol, balance })
        setError(null)
      } catch (error) {
        console.error('Error fetching token info:', error)
        setError('Failed to fetch token info. Please check the console for details.')
      }
    }

    fetchTokenInfo()
  }, [publicClient, address])

  if (error) {
    return <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Token Info
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="text-lg font-medium text-blue-700">{tokenInfo.name || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Symbol</p>
            <p className="text-lg font-medium text-blue-700">{tokenInfo.symbol || 'Loading...'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-lg font-medium text-green-600">{tokenInfo.balance ? `${formatEther(tokenInfo.balance)} tokens` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
