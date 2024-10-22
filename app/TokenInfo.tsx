'use client'

import { useState, useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatEther, Address } from 'viem'

const TOKEN_ADDRESS = '0x9b5436Fb49acA1f760fD7742Ca3D5240f01823D6' as const

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
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>Token Info</h2>
      <p>Name: {tokenInfo.name || 'Loading...'}</p>
      <p>Symbol: {tokenInfo.symbol || 'Loading...'}</p>
      <p>Balance: {tokenInfo.balance ? formatEther(tokenInfo.balance) : 'N/A'}</p>
    </div>
  )
}
