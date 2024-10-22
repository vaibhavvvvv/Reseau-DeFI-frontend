import ConnectButton from './components/ConnectButton'
import TokenInfo from './components/TokenInfo'
import TokenTransfer from './components/TokenTransfer'
import TokenApproval from './components/TokenApproval'
import TokenMintBurn from './components/TokenMintBurn'
import TokenTransactionHistory from './components/TokenTransactionHistory'

export default function Home() {
  return (
    <div className="space-y-6 sm:px-1 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-violet-500 to-violet-900 rounded-lg shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Token Dashboard
        </h1>
        <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage your tokens with ease</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <TokenInfo />
        <TokenTransfer />
        <TokenApproval />
        <TokenMintBurn />
        <div className="md:col-span-2">
          <TokenTransactionHistory />
        </div>
      </div>
    </div>
  )
}
