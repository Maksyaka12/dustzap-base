import React from 'react'
import { SOURCE_CHAINS, TARGET_CHAIN } from '../config/chains'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

export function ChainSelector({ selectedChainId, onSelectChain, chainBalances = {} }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-base-blue/20 text-base-blue font-bold text-xs flex items-center justify-center border border-base-blue/30">
            1
          </span>
          <span className="text-sm font-bold text-white">
            Choose Network to Sweep
          </span>
          <span className="text-xs text-base-muted hidden sm:inline">
            — Select where your dust tokens are located
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-base-blue">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Destination: Base 🔵</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        {SOURCE_CHAINS.map((chain) => {
          const isSelected = chain.id === selectedChainId
          const chainSum = chainBalances[chain.id]

          return (
            <button
              key={chain.id}
              onClick={() => onSelectChain(chain.id)}
              className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-base-blue/15 border-base-blue shadow-base-glow-sm'
                  : 'bg-base-surface hover:bg-base-surface-hover border-white/[0.08] hover:border-white/[0.18]'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-base-blue text-white flex items-center justify-center text-[10px] shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2.5">
                <img 
                  src={chain.logo} 
                  alt={chain.name} 
                  className="w-8 h-8 rounded-full border border-white/10 group-hover:scale-105 transition-transform" 
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs sm:text-sm font-extrabold truncate ${isSelected ? 'text-white' : 'text-white/90'}`}>
                    {chain.shortName}
                  </div>
                  <div className="text-[10px] text-base-muted truncate">
                    Gas ~${chain.avgGasFeeUSD}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-base-muted text-[11px]">Found:</span>
                <span className="font-mono font-bold text-white text-xs">
                  {chainSum !== undefined ? (chainSum > 0 ? `$${chainSum.toFixed(2)}` : '$0.00') : '...'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
