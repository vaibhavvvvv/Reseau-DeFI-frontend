'use client'

import TokenInfo from '../components/TokenInfo'
import TokenTransfer from '../components/TokenTransfer'
import TokenApproval from '../components/TokenApproval'
import TokenTransactionHistory from '../components/TokenTransactionHistory'
import TokenMintBurn from '../components/TokenMintBurn'
import { useState } from 'react'

const tabs = [
  { id: 'info', label: 'Token Info', icon: '📊' },
  { id: 'transfer', label: 'Transfer', icon: '↗️' },
  { id: 'approve', label: 'Approve', icon: '✅' },
  { id: 'mintburn', label: 'Mint/Burn', icon: '🔥' },
  { id: 'history', label: 'History', icon: '📜' },
]

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState('info')

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
        <span className="mr-2">🪙</span> Token Management
      </h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-2">
          {activeTab === 'info' && <TokenInfo />}
          {activeTab === 'transfer' && <TokenTransfer />}
          {activeTab === 'approve' && <TokenApproval />}
          {activeTab === 'mintburn' && <TokenMintBurn />}
          {activeTab === 'history' && <TokenTransactionHistory />}
        </div>
      </div>
    </div>
  )
}
