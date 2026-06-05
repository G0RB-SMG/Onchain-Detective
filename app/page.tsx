'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setIsLoading(true)

    // Simulate loading time (we'll replace with real API calls later)
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/report/${address.trim()}`)
    }, 2200)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F0E8]">
      {/* Minimal Header - Only version number */}
      <header className="border-b border-[#222222] py-4">
        <div className="max-w-2xl mx-auto px-6 flex justify-end">
          <div className="text-xs text-[#555]">v0.2.0</div>
        </div>
      </header>

      {/* Main Content - Extremely Minimal */}
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6">
        <div className="w-full max-w-md">
          {/* Title - Centered directly above search bar */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">On Chain Detective</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleInvestigate} className="w-full">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#3F2A1E]" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x... or Solana / BTC address"
                  className="w-full bg-[#111111] border border-[#222222] rounded-lg pl-11 pr-4 py-3 text-[#F5F0E8] placeholder:text-[#666] focus:outline-none focus:border-[#3F2A1E]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#3F2A1E] hover:bg-[#4A2C0B] disabled:opacity-60 text-[#F5F0E8] rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                Investigate
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Fully Opaque Noir Loading Screen with Progressive Steps */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#000000] flex items-center justify-center z-50">
          <div className="max-w-md w-full px-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#3F2A1E] rounded-full animate-pulse" />
                <p className="text-sm tracking-[2px] text-[#3F2A1E] font-medium">COMPILING CASE FILE</p>
              </div>
              <p className="text-[#F5F0E8] text-sm">Analyzing on-chain activity...</p>
            </div>

            {/* Progressive Loading Steps */}
            <div className="space-y-3 text-sm font-mono">
              {[
                "Fetching multi-chain balances",
                "Mapping connected wallets",
                "Detecting CEX onboarding & offboarding",
                "Analyzing transaction patterns",
                "Calculating P&L and risk metrics",
                "Generating confidence-rated inferences",
                "Building final report dossier"
              ].map((step, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 text-[#888] transition-all duration-300"
                  style={{ 
                    transitionDelay: `${index * 180}ms` 
                  }}
                >
                  <div className="w-1 h-1 bg-[#3F2A1E] rounded-full flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}