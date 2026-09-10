import React from 'react'
import { Coins, Zap, Fuel, ArrowUpRight, TrendingUp } from 'lucide-react'

export function DustHeroStats({
  totalDiscoveredUSD = 0,
  selectedUSD = 0,
  netOutputUSD = 0,
  estimatedOutputAmount = '0',
  targetToken = 'ETH',
  gasSavingsUSD = 0,
  selectedCount = 0,
  totalCount = 0
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Dust Found */}
      <div className="p-5 rounded-3xl bg-base-card border border-white/[0.08] relative overflow-hidden group hover:border-white/[0.15] transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-base-muted uppercase tracking-wider">
            Total Dust Found
          </span>
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-base-muted group-hover:text-white transition-colors">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
          ${totalDiscoveredUSD.toFixed(2)}
        </div>
        <div className="text-xs text-base-muted mt-1">
          Across {totalCount} discovered token{totalCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 2. Selected to Zap */}
      <div className="p-5 rounded-3xl bg-base-card border border-white/[0.08] relative overflow-hidden group hover:border-base-blue/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-base-muted uppercase tracking-wider">
            Selected Value
          </span>
          <div className="w-8 h-8 rounded-xl bg-base-blue/15 text-base-blue flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-mono text-base-blue tracking-tight">
          ${selectedUSD.toFixed(2)}
        </div>
        <div className="text-xs text-base-muted mt-1">
          {selectedCount} token{selectedCount !== 1 ? 's' : ''} queued for zap
        </div>
      </div>

      {/* 3. Estimated on Base */}
      <div className="p-5 rounded-3xl bg-base-card border border-base-blue/30 relative overflow-hidden shadow-base-glow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-base-blue/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
            Estimated on Base
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-base-green/20 text-base-green border border-base-green/30">
            Net
          </span>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1.5">
          <span>{estimatedOutputAmount}</span>
          <span className="text-sm font-sans font-semibold text-base-blue">{targetToken}</span>
        </div>
        <div className="text-xs text-base-green font-medium mt-1 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>~${netOutputUSD.toFixed(2)} USD ready on Base</span>
        </div>
      </div>

      {/* 4. Gas Saved */}
      <div className="p-5 rounded-3xl bg-base-card border border-white/[0.08] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-base-muted uppercase tracking-wider">
            Gas Saved (Batch)
          </span>
          <div className="w-8 h-8 rounded-xl bg-base-green/10 text-base-green flex items-center justify-center">
            <Fuel className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-mono text-base-green tracking-tight">
          +${gasSavingsUSD.toFixed(2)}
        </div>
        <div className="text-xs text-base-muted mt-1">
          Compared to individual txs
        </div>
      </div>
    </div>
  )
}
