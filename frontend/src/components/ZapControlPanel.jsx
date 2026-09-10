import React, { useState } from 'react'
import { BASE_TARGET_TOKENS } from '../config/tokens'
import { Zap, ArrowRight, ShieldCheck, Settings, CheckCircle2, ChevronRight, Fuel } from 'lucide-react'

export function ZapControlPanel({
  selectedTokens = [],
  selectedUSD = 0,
  netOutputUSD = 0,
  estimatedOutputAmount = '0',
  targetToken = 'ETH',
  onSelectTargetToken,
  slippagePct = 1.0,
  onChangeSlippage,
  onStartZap,
  isConnected = false,
  isProcessing = false
}) {
  const [showSettings, setShowSettings] = useState(false)

  const selectedCount = selectedTokens.length
  const isReady = isConnected && selectedCount > 0 && netOutputUSD > 0

  return (
    <div className="w-full bg-base-card border border-white/[0.08] rounded-3xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute -bottom-12 -right-12 w-52 h-52 bg-base-blue/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-base-blue/20 text-base-blue font-bold text-xs flex items-center justify-center border border-base-blue/30">
            3
          </span>
          <span className="text-sm font-bold text-white">
            Zap to Base
          </span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 text-xs text-base-muted hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05]"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Slippage ({slippagePct}%)</span>
        </button>
      </div>

      {/* Slippage Settings Drawer */}
      {showSettings && (
        <div className="mb-5 p-3.5 rounded-2xl bg-base-surface border border-white/[0.06] text-xs">
          <div className="text-base-muted mb-2 font-medium">Slippage Tolerance:</div>
          <div className="flex gap-2">
            {[0.5, 1.0, 2.0].map((val) => (
              <button
                key={val}
                onClick={() => onChangeSlippage(val)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors ${
                  slippagePct === val
                    ? 'bg-base-blue text-white shadow-base-glow-sm'
                    : 'bg-white/[0.05] text-base-muted hover:text-white'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Target Token Selector on Base */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-base-muted uppercase tracking-wider mb-2.5">
          Receive Asset on Base:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {BASE_TARGET_TOKENS.map((token) => {
            const isSelected = token.symbol === targetToken
            return (
              <button
                key={token.symbol}
                onClick={() => onSelectTargetToken(token.symbol)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-base-blue/15 border-base-blue shadow-base-glow-sm text-white'
                    : 'bg-base-surface hover:bg-base-surface-hover border-white/[0.06] text-white/80'
                }`}
              >
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-7 h-7 rounded-full border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold truncate flex items-center justify-between">
                    <span>{token.symbol}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-base-blue" />}
                  </div>
                  <div className="text-[10px] text-base-muted truncate">
                    {token.isNative ? 'Native ETH' : 'Native USDC'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conversion Breakdown Card */}
      <div className="p-4 rounded-2xl bg-base-surface border border-white/[0.06] mb-6 space-y-3 text-xs">
        <div className="flex items-center justify-between text-base-muted">
          <span>Input Dust ({selectedCount} tokens):</span>
          <span className="font-mono text-white font-bold">${selectedUSD.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between text-base-muted">
          <span>Bridge Speed (Relay):</span>
          <span className="text-white font-semibold flex items-center gap-1">
            <span className="text-base-green font-bold">~2-3 seconds</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-base-muted">
          <span>Target Network:</span>
          <span className="text-white font-bold flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-base-blue" />
            <span>Base (Chain ID 8453)</span>
          </span>
        </div>

        <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between font-bold">
          <span className="text-white text-sm">Estimated on Base:</span>
          <div className="text-right">
            <div className="text-lg font-mono text-base-blue font-extrabold">
              {estimatedOutputAmount} {targetToken}
            </div>
            <div className="text-[11px] font-mono text-base-green font-semibold">
              ≈ ${netOutputUSD.toFixed(2)} USD
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={onStartZap}
        disabled={!isReady || isProcessing}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-2xl relative overflow-hidden ${
          !isConnected
            ? 'bg-base-blue text-white hover:bg-base-blue-hover shadow-base-glow'
            : selectedCount === 0
            ? 'bg-white/[0.05] text-base-muted cursor-not-allowed border border-white/[0.08]'
            : isProcessing
            ? 'bg-base-blue/80 text-white cursor-wait'
            : 'bg-base-blue hover:bg-base-blue-hover text-white shadow-base-glow hover:shadow-base-glow-sm transform active:scale-[0.99]'
        }`}
      >
        <Zap className={`w-5 h-5 ${isProcessing ? 'animate-bounce' : ''}`} />
        <span>
          {!isConnected
            ? 'Connect Wallet to Zap'
            : selectedCount === 0
            ? 'Select Tokens to Zap'
            : isProcessing
            ? 'Zapping to Base...'
            : `Zap ${selectedCount} Token${selectedCount !== 1 ? 's' : ''} to Base ⚡`}
        </span>
      </button>

      {/* Security Note */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-base-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-base-green" />
        <span>100% Non-custodial & Decentralized</span>
      </div>
    </div>
  )
}
