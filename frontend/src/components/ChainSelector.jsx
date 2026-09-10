import React from 'react'
import { SOURCE_CHAINS, TARGET_CHAIN } from '../config/chains'
import { ArrowRight, Sparkles } from 'lucide-react'

export function ChainSelector({ selectedChainId, onSelectChain }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-muted">
            1. Select Source Network
          </span>
          <span className="text-[11px] text-base-muted/80">
            (Where your dust tokens are located)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-base-blue">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Destination locked to Base 🔵</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SOURCE_CHAINS.map((chain) => {
          const isSelected = chain.id === selectedChainId
          return (
            <button
              key={chain.id}
              onClick={() => onSelectChain(chain.id)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-base-blue/10 border-base-blue shadow-base-glow-sm'
                  : 'bg-base-surface hover:bg-base-surface-hover border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              {/* Active Indicator Bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 w-1 h-full bg-base-blue" />
              )}

              <img 
                src={chain.logo} 
                alt={chain.name} 
                className="w-8 h-8 rounded-full border border-white/10" 
              />
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>
                    {chain.shortName}
                  </span>
                  {chain.popular && (
                    <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-base-muted">
                      L2
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-base-muted truncate">
                  ~${chain.avgGasFeeUSD} gas
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
