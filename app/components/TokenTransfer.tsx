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
  const [ buttonClicked, setButtonClicked] = useState(false)

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
      setButtonClicked(true)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error sending transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#EBE1D8] shadow-[-10px_10px_0_0_#000000] m-4 rounded-lg overflow-hidden">
    <div className="p-4">
      <h2 className="text-2xl font-bold text-[#373737] flex items-center border-b border-[#373737]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transfer Tokens
        </h2>
      </div>
      <div className="p-6 space-y-4  ">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-[#373737]">Recipient Address</label>
          <input
            id="to"
            type="text"
            className="mt-1 block w-full border text-[#373737] border-[#373737] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B99FC] focus:border-[#3B99FC]"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ backgroundColor: 'var(--ck-body-background)' }}
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[#373737]">Amount</label>
          <input
            id="amount"
            type="text"
            className="mt-1 block w-full border text-[#373737] border-[#373737] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3B99FC] focus:border-[#3B99FC]"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ backgroundColor: 'var(--ck-body-background)' }}
          />
        </div>
        <button
          onClick={handleTransfer}
          disabled={isLoading || !to || !amount}
          className={`w-1/3 justify-center px-4 py-3 m-2 text-sm font-bold transition-colors duration-200 flex items-center ${
            buttonClicked === true
              ? 'bg-[#ffffff] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-lg'
              : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] hover:shadow-[0_0_2px_0_#000000] shadow-[-4px_4px_0_0_#000000] active:bg-[#ffffff] active:shadow-[0_0_0px_0_#000000] rounded-lg'
          }`}      >
          {isLoading ? 'Transferring...' : 'Transfer'}
        </button>
        {isLoading && <div className="text-[#3B99FC] flex items-center"><svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Transaction in progress...</div>}
        {isSuccess && <div className="text-[#3B99FC] flex items-center"><svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Transaction Successful!</div>}
      </div>
    </div>
  )
}
