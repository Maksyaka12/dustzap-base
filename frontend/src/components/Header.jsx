import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { TARGET_CHAIN, SOURCE_CHAINS } from '../config/chains'
import { Shield, Sparkles, Wallet, LogOut, ArrowRight, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react'

export function Header({ selectedSourceChain, onSelectSourceChain }) {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showChainDropdown, setShowChainDropdown] = useState(false)

  const activeChain = SOURCE_CHAINS.find(c => c.id === selectedSourceChain) || SOURCE_CHAINS[0]

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

        {/* Right: Builder Code Badge & Wallet */}
        <div className="flex items-center gap-3">
          {/* Builder Code Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-base-muted">
            <Shield className="w-3.5 h-3.5 text-base-blue" />
            <span>Builder Code:</span>
            <span className="font-mono text-white text-[11px]">baseapp</span>
          </div>

          {/* Connect Wallet Button */}
          {!isConnected ? (
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={isConnecting || isReconnecting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-blue hover:bg-base-blue-hover text-white text-sm font-semibold transition-all shadow-base-glow hover:shadow-base-glow-sm"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting || isReconnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-base-surface border border-white/[0.08] p-1 rounded-xl">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-base-green" />
                <span className="font-mono text-xs font-medium text-white">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                title="Disconnect"
                className="p-2 text-base-muted hover:text-base-red hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-base-card border border-white/[0.1] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowWalletModal(false)}
              className="absolute top-5 right-5 text-base-muted hover:text-white p-1 rounded-lg text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-base-blue flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Connect to DustZap</h3>
                <p className="text-xs text-base-muted">Choose your preferred wallet</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector })
                    setShowWalletModal(false)
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-base-surface hover:bg-base-surface-hover border border-white/[0.06] hover:border-base-blue/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-base-blue group-hover:text-white group-hover:bg-base-blue transition-colors">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{connector.name}</div>
                      <div className="text-[11px] text-base-muted">
                        {connector.name.includes('Base') || connector.name.includes('Coinbase') 
                          ? 'Passkey & Smart Wallet (Recommended)' 
                          : 'Browser Extension & Mobile'}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-base-muted -rotate-90 group-hover:text-white transition-transform" />
                </button>
              ))}
            </div>

            <p className="text-[11px] text-center text-base-muted">
              By connecting, you agree to DustZap terms and Base attribution.
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
