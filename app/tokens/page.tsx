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
    <div className=" mx-auto bg-[#85787a]">
      <h1 className="text-3xl md:text-4xl  font-bold flex items-center relative  text-white p-4 ">
        <span className="mr-2">🪙</span> Token Management
      </h1>
      
      <div className="bg-[#85787a]   overflow-hidden">
        <div className="flex flex-wrap lg:px-4 border-b">
          {tabs.map((tab) => (
           <button
           key={tab.id}
           className={`px-4 py-3 m-2 text-sm font-bold transition-colors duration-200 flex items-center ${
             activeTab === tab.id
               ? 'bg-[#F3EDE8] text-[#373737] shadow-[0_0_2px_0_#000000] rounded-lg'
               : 'text-[#373737] bg-[#ffffff] hover:bg-[#F3EDE8] hover:shadow-[0_0_2px_0_#000000] shadow-[-4px_4px_0_0_#000000] active:bg-[#ffffff] active:shadow-[0_0_0px_0_#000000] rounded-lg'
           }`}
           onClick={() => setActiveTab(tab.id)}
         >
           <span className="mr-2">{tab.icon}</span>
           <span className=" sm:inline">{tab.label}</span>
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
