import React, { useState, useMemo } from 'react'
import { Search, CheckSquare, Square, RefreshCw, AlertTriangle, Sparkles, Filter, Info, Fuel } from 'lucide-react'

export function TokenScannerTable({
  tokens = [],
  isLoading = false,
  onToggleToken,
  onSelectAll,
  onSelectProfitableOnly,
  onDeselectAll,
  onRefresh
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'all', 'profitable', 'selected'

  // Filtered Tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const matchesSearch = 
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.address.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (filterMode === 'profitable') return token.isProfitable
      if (filterMode === 'selected') return token.selected
      return true
    })
  }, [tokens, searchQuery, filterMode])

  const selectedCount = tokens.filter(t => t.selected).length
  const profitableCount = tokens.filter(t => t.isProfitable).length

  return (
    <div className="w-full bg-base-card border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl">
      
      {/* Table Header & Controls Bar */}
      <div className="p-5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Title & Counts */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-base-blue/15 text-base-blue flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Discovered Dust Tokens</h3>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-white/[0.06] text-white">
                {tokens.length}
              </span>
            </div>
            <p className="text-xs text-base-muted">
              Select assets you want to consolidate and bridge to Base
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
            <input
              type="text"
              placeholder="Search token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-base-surface border border-white/[0.08] rounded-xl text-white placeholder-base-muted focus:outline-none focus:border-base-blue w-36 sm:w-48 transition-colors"
            />
          </div>

          {/* Quick Select Buttons */}
          <button
            onClick={onSelectProfitableOnly}
            className="px-3 py-1.5 rounded-xl bg-base-green/10 hover:bg-base-green/20 border border-base-green/30 text-base-green text-xs font-semibold transition-colors"
          >
            🔥 Select Profitable ({profitableCount})
          </button>

          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-medium transition-colors"
          >
            Select All
          </button>

          <button
            onClick={onDeselectAll}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-base-muted hover:text-white text-xs font-medium transition-colors"
          >
            Clear
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Rescan Wallet"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-base-muted hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-base-blue' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-base-surface/40 text-[11px] font-semibold uppercase tracking-wider text-base-muted">
              <th className="py-3 px-4 w-12 text-center">Zap</th>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4">USD Value</th>
              <th className="py-3 px-4">Est. Gas</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/[0.04] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-base-blue border-t-transparent animate-spin" />
                    <p className="text-sm text-base-muted">Scanning wallet for dust tokens & checking prices...</p>
                  </div>
                </td>
              </tr>
            ) : filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-base-muted/60" />
                    <p className="text-sm font-medium text-white">No dust tokens found</p>
                    <p className="text-xs text-base-muted max-w-sm">
                      {tokens.length === 0 
                        ? 'Connect your wallet or switch to a network where you hold tokens.' 
                        : 'No tokens match your search query.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTokens.map((token) => {
                return (
                  <tr
                    key={token.address}
                    onClick={() => onToggleToken(token.address)}
                    className={`cursor-pointer transition-colors ${
                      token.selected
                        ? 'bg-base-blue/[0.06] hover:bg-base-blue/[0.1]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleToken(token.address)}
                        className="text-base-blue hover:text-base-blue-hover transition-colors p-1"
                      >
                        {token.selected ? (
                          <CheckSquare className="w-4 h-4 text-base-blue fill-base-blue/20" />
                        ) : (
                          <Square className="w-4 h-4 text-white/30" />
                        )}
                      </button>
                    </td>

                    {/* Token Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          onError={(e) => {
                            e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
                          }}
                          className="w-8 h-8 rounded-full border border-white/10 bg-base-surface"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{token.symbol}</span>
                            {token.isNative && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-base-blue/20 text-base-blue border border-base-blue/30">
                                Native
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-base-muted truncate max-w-[120px] sm:max-w-none">
                            {token.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-sm text-white">
                        {token.formattedBalance}
                      </div>
                      <div className="text-[11px] text-base-muted font-mono">
                        ${token.priceUSD < 0.01 ? token.priceUSD.toFixed(6) : token.priceUSD.toFixed(2)}/unit
                      </div>
                    </td>

                    {/* USD Value */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white text-base">
                        ${token.valueUSD.toFixed(2)}
                      </div>
                    </td>

                    {/* Gas Cost */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-xs text-base-muted font-mono">
                        <Fuel className="w-3 h-3 text-base-muted" />
                        <span>~${token.estimatedGasUSD.toFixed(3)}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-right">
                      {token.isProfitable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-base-green/15 text-base-green border border-base-green/30">
                          🔥 Profitable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-base-yellow/10 text-base-yellow border border-base-yellow/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Value</span>
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-base-surface/60 border-t border-white/[0.06] flex items-center justify-between text-xs text-base-muted">
        <div>
          Showing {filteredTokens.length} of {tokens.length} tokens
        </div>
        <div className="flex items-center gap-1 text-white/80 font-mono">
          <span>Selected: {selectedCount} token{selectedCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
