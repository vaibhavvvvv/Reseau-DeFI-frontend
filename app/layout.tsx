import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Sidebar from './components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reseau De-Finance',
  description: 'A comprehensive DeFi ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-[#85787a]  lg:ml-64">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
