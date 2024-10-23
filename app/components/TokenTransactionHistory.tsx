'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, formatEther } from 'viem'
import { polygonAmoy } from 'viem/chains'

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`
const TOKEN_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http()
})

interface Transaction {
  transactionHash: string
  from: string
  to: string
  value: bigint
  blockNumber: bigint
  timestamp?: number
}

export default function TokenTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  useEffect(() => {
    async function fetchTransactions() {
      if (!address) {
        setError('No address found. Please connect your wallet.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      console.log('Fetching logs for address:', address)
      
      try {
        console.log('Fetching logs for address:', address)
        const logs = await publicClient.getLogs({
          address: TOKEN_ADDRESS,
          event: TOKEN_ABI[0],
          fromBlock: 'earliest',
          toBlock: 'latest',
          args: {
            from: address,
          },
        })

        console.log('Logs fetched:', logs.length)

        const logsTo = await publicClient.getLogs({
          address: TOKEN_ADDRESS,
          event: TOKEN_ABI[0],
          fromBlock: 'earliest',
          toBlock: 'latest',
          args: {
            to: address,
          },
        })

        const allLogs = [...logs, ...logsTo]
        console.log('All logs fetched:', allLogs)

        if (allLogs.length === 0) {
          setError('No transactions found for this address.')
          setIsLoading(false)
          return
        }

        const txsWithoutTimestamp = allLogs.map((log) => ({
          transactionHash: log.transactionHash,
          from: log.args.from,
          to: log.args.to,
          value: log.args.value,
          blockNumber: log.blockNumber,
        }))

        console.log('Transactions mapped:', txsWithoutTimestamp.length)

        //  (most recent first)
        const sortedTxs = txsWithoutTimestamp.sort((a, b) => Number(b.blockNumber - a.blockNumber))

        // Fetch timestamps for the 10 most recent transactions
        const recentTxs = sortedTxs.slice(0, 10)
        const txsWithTimestamp = await Promise.all(recentTxs.map(async (tx) => {
          const block = await publicClient.getBlock({ blockNumber: tx.blockNumber })
          return { ...tx, timestamp: Number(block.timestamp) }
        }))

        console.log('Transactions with timestamps:', txsWithTimestamp.length)

        setTransactions(txsWithTimestamp as Transaction[])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setError('Error fetching transactions. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [address])

  function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-[#EBE1D8] shadow-[-10px_10px_0_0_#000000] m-4 rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-[#373737] flex items-center border-b border-[#373737]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Token Transaction History
        </h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading transactions...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-gray-500 divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.transactionHash}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.from === address ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {tx.from === address ? 'Sent' : 'Received'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.from === address ? formatAddress(tx.to) : formatAddress(tx.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatEther(tx.value)} MEM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.timestamp 
                        ? new Date(tx.timestamp * 1000).toLocaleString()
                        : 'Loading...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
