import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'
import { TARGET_CHAIN, SOURCE_CHAINS } from '../config/chains'
import { Shield, Sparkles, Wallet, LogOut, ArrowRight, ChevronDown } from 'lucide-react'

export function Header({ selectedSourceChain, onSelectSourceChain }) {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [showChainDropdown, setShowChainDropdown] = useState(false)

  const activeChain = SOURCE_CHAINS.find(c => c.id === selectedSourceChain) || SOURCE_CHAINS[0]

  // Resolved user address from Wagmi or Privy
  const userAddress = address || user?.wallet?.address

  const handleDisconnect = async () => {
    try {
      await logout()
    } catch (e) {
      console.warn(e)
    }
    disconnect()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-base-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-base-blue shadow-base-glow">
            {/* Base Circle mark */}
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-base-blue" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-base-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-base-green border-2 border-base-dark"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">DustZap</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-base-blue/15 text-base-blue border border-base-blue/30 rounded-full">
                Base Native
              </span>
            </div>
            <p className="text-xs text-base-muted font-medium hidden sm:block">
              Sweep cross-chain dust to Base 🔵
            </p>
          </div>
        </div>

        {/* Center: Route Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-base-surface px-3 py-1.5 rounded-full border border-white/[0.08]">
          {/* Source Chain Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowChainDropdown(!showChainDropdown)}
              className="flex items-center gap-2 text-xs font-semibold text-white px-2.5 py-1 rounded-full hover:bg-white/[0.05] transition-colors"
            >
              <img src={activeChain.logo} alt={activeChain.name} className="w-4 h-4 rounded-full" />
              <span>{activeChain.shortName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-base-muted" />
            </button>

            {showChainDropdown && (
              <div className="absolute top-full mt-2 left-0 w-44 bg-base-card border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-50">
                <div className="text-[10px] font-semibold text-base-muted px-2 py-1 uppercase tracking-wider">
                  Source Network
                </div>
                {SOURCE_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => {
                      onSelectSourceChain(chain.id)
                      setShowChainDropdown(false)
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      chain.id === selectedSourceChain 
                        ? 'bg-base-blue text-white' 
                        : 'text-white/80 hover:bg-white/[0.08]'
                    }`}
                  >
                    <img src={chain.logo} alt={chain.name} className="w-4 h-4 rounded-full" />
                    <span>{chain.shortName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-base-blue" />

          {/* Destination: Base */}
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-base-blue/20 px-3 py-1 rounded-full border border-base-blue/40">
            <div className="w-2.5 h-2.5 rounded-full bg-base-blue animate-pulse" />
            <span>Base 🔵</span>
          </div>
        </div>

        {/* Right: Builder Code Badge & Privy Wallet */}
        <div className="flex items-center gap-3">
          {/* Builder Code Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-base-muted">
            <Shield className="w-3.5 h-3.5 text-base-blue" />
            <span>Builder Code:</span>
            <span className="font-mono text-white text-[11px]">baseapp</span>
          </div>

          {/* Privy Connect Wallet Button */}
          {!ready ? (
            <div className="px-5 py-2.5 rounded-xl bg-base-surface text-base-muted text-sm font-semibold border border-white/[0.08]">
              Loading...
            </div>
          ) : !authenticated && !isConnected ? (
            <button
              onClick={login}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-blue hover:bg-base-blue-hover text-white text-sm font-semibold transition-all shadow-base-glow hover:shadow-base-glow-sm"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-base-surface border border-white/[0.08] p-1 rounded-xl">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-base-green" />
                <span className="font-mono text-xs font-medium text-white">
                  {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connected'}
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                title="Disconnect"
                className="p-2 text-base-muted hover:text-base-red hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
