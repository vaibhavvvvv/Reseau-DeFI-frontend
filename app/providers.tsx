'use client'

import { WagmiConfig, createConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { polygonAmoy } from 'viem/chains'
import { createPublicClient, http } from 'viem'

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
})

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'DeFi Nexus',
    chains: [polygonAmoy],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  })
)

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme='retro'>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}