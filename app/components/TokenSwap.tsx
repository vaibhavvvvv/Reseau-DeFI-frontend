'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther, createWalletClient, custom, formatEther } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { publicClient } from '../providers'

const TOKEN_SWAP_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_SWAP_ADDRESS as `0x${string}`
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`
const TOKEN_SWAP_ABI = [
  {
    inputs: [],
    name: 'swapEthForTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAmount', type: 'uint256' }],
    name: 'swapTokensForEth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAmount', type: 'uint256' }],
    name: 'depositTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositEth',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAmount', type: 'uint256' }],
    name: 'withdrawTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'ethAmount', type: 'uint256' }],
    name: 'withdrawEth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rate',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const TOKEN_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export default function TokenSwap() {
  const [ethAmount, setEthAmount] = useState('')
  const [tokenAmount, setTokenAmount] = useState('')
  const [contractEthBalance, setContractEthBalance] = useState('0')
  const [contractTokenBalance, setContractTokenBalance] = useState('0')
  const [userTokenBalance, setUserTokenBalance] = useState('0')
  const [swapRate, setSwapRate] = useState('0')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [buttonClicked, setButtonClicked] = useState(false)
  const { address } = useAccount()

  useEffect(() => {
    if (address) {
      fetchContractData()
    }
  }, [address])

  const fetchContractData = async () => {
    try {
      const contractEthBalance = await publicClient.getBalance({
        address: TOKEN_SWAP_ADDRESS,
      })
      const contractTokenBalance = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [TOKEN_SWAP_ADDRESS],
      })
      const userTokenBalance = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      })
      const swapRate = await publicClient.readContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'rate',
      })

      setContractEthBalance(formatEther(contractEthBalance))
      setContractTokenBalance(formatEther(contractTokenBalance))
      setUserTokenBalance(formatEther(userTokenBalance))
      setSwapRate(swapRate.toString())
    } catch (error) {
      console.error('Error fetching contract data:', error)
    }
  }

  const handleSwapEthForTokens = async () => {
    setButtonClicked(true)

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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'swapEthForTokens',
        args: [],
        value: parseEther(ethAmount),
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setButtonClicked(false)
    }
  }

  const handleSwapTokensForEth = async () => {
    setButtonClicked(true)

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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'swapTokensForEth',
        args: [parseEther(tokenAmount)],
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setButtonClicked(false)
    }
  }

  const handleDepositEth = async () => {
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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'depositEth',
        args: [],
        value: parseEther(ethAmount),
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawEth = async () => {
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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'withdrawEth',
        args: [parseEther(ethAmount)],
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepositTokens = async () => {
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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'depositTokens',
        args: [parseEther(tokenAmount)],
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawTokens = async () => {
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

      const { request } = await publicClient.simulateContract({
        address: TOKEN_SWAP_ADDRESS,
        abi: TOKEN_SWAP_ABI,
        functionName: 'withdrawTokens',
        args: [parseEther(tokenAmount)],
        account: address,
      })

      const hash = await walletClient.writeContract({
        ...request,
        account: address ?? null,
      })
      console.log('Transaction hash:', hash)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#EBE1D8] border border-black shadow-[-10px_10px_0_0_#000000] m-4 rounded-lg overflow-hidden p-6">
      <h2 className="text-3xl font-bold text-[#373737] flex items-center border-b border-[#373737] pb-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Token Swap
      </h2>

      <div className="space-y-6">
        <div className=" bg-[#F3EDE8] p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#373737] mb-4">Contract Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Contract ETH Balance:</span> {contractEthBalance} MATIC</p>
            <p><span className="font-medium">Contract Token Balance:</span> {contractTokenBalance} Tokens</p>
            <p><span className="font-medium">Your Token Balance:</span> {userTokenBalance} Tokens</p>
            <p><span className="font-medium">Swap Rate:</span> 1 ETH = {swapRate} Tokens</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" bg-[#F3EDE8] p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#373737] mb-4">ETH Transactions</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-700 mb-1">ETH Amount</label>
                <input
                  id="ethAmount"
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.0"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                />
              </div>
              <button
                onClick={handleSwapEthForTokens}
                disabled={isLoading || !ethAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                {isLoading ? 'Swapping...' : 'Swap ETH for Tokens'}
              </button>
              <button
                onClick={handleDepositEth}
                disabled={isLoading || !ethAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                Deposit ETH
              </button>
              <button
                onClick={handleWithdrawEth}
                disabled={isLoading || !ethAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                Withdraw ETH
              </button>
            </div>
          </div>

          <div className=" bg-[#F3EDE8] p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#373737] mb-4">Token Transactions</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-1">Token Amount</label>
                <input
                  id="tokenAmount"
                  type="text"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
              </div>
              <button
                onClick={handleSwapTokensForEth}
                disabled={isLoading || !tokenAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                {isLoading ? 'Swapping...' : 'Swap Tokens for ETH'}
              </button>
              <button
                onClick={handleDepositTokens}
                disabled={isLoading || !tokenAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                Deposit Tokens
              </button>
              <button
                onClick={handleWithdrawTokens}
                disabled={isLoading || !tokenAmount}
                className={`w-full justify-center border border-black px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                  buttonClicked ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-md' : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] shadow-[-4px_4px_0_0_#000000] active:shadow-[0_0_0px_0_#000000] rounded-md'
                }`}
              >
                Withdraw Tokens
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <div className="mt-4 text-blue-600">Transaction in progress...</div>}
      {isSuccess && <div className="mt-4 text-green-600">Transaction Successful!</div>}
    </div>
  )
}
