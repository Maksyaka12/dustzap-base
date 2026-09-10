import React, { useState, useMemo } from 'react'
import { Search, CheckSquare, Square, RefreshCw, AlertTriangle, Sparkles, Filter, Info, Fuel, ArrowUpDown } from 'lucide-react'

export function TokenScannerTable({
  tokens = [],
  isLoading = false,
  onToggleToken,
  onSelectAll,
  onSelectProfitableOnly,
  onDeselectAll,
  onRefresh,
  chainName = 'Arbitrum'
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'all', 'profitable', 'selected'

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
  const totalUSD = tokens.reduce((acc, t) => acc + (t.valueUSD || 0), 0)

  return (
    <div className="w-full bg-base-card border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl">
      
      {/* Header Controls Bar */}
      <div className="p-5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Step 2 Title & Details */}
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-base-blue/20 text-base-blue font-bold text-xs flex items-center justify-center border border-base-blue/30">
            2
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Assets on {chainName}
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-white/[0.06] text-white">
                {tokens.length} found
              </span>
            </div>
            <p className="text-xs text-base-muted">
              Select tokens to consolidate into one balance on Base
            </p>
          </div>
        </div>

        {/* Right: Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-base-surface border border-white/[0.08] rounded-xl text-white placeholder-base-muted focus:outline-none focus:border-base-blue w-32 sm:w-44 transition-colors"
            />
          </div>

          {/* Quick Select Buttons */}
          <button
            onClick={onSelectProfitableOnly}
            className="px-3 py-1.5 rounded-xl bg-base-green/10 hover:bg-base-green/20 border border-base-green/30 text-base-green text-xs font-bold transition-colors"
          >
            🔥 Profitable ({profitableCount})
          </button>

          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-semibold transition-colors"
          >
            Select All
          </button>

          <button
            onClick={onDeselectAll}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-base-muted hover:text-white text-xs font-medium transition-colors"
          >
            Clear
          </button>

          {/* Rescan Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Rescan Wallet Balances"
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-base-muted hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-base-blue' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tokens Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-base-surface/50 text-[11px] font-bold uppercase tracking-wider text-base-muted">
              <th className="py-3 px-4 w-12 text-center">Sweep</th>
              <th className="py-3 px-4">Token</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4">USD Value</th>
              <th className="py-3 px-4">Est. Gas</th>
              <th className="py-3 px-4 text-right">Recommendation</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/[0.04] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-base-blue border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-white">Scanning wallet balances on {chainName}...</p>
                    <p className="text-xs text-base-muted">Fetching verified token balances and real-time prices</p>
                  </div>
                </td>
              </tr>
            ) : filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-base-muted/60" />
                    <p className="text-sm font-bold text-white">No tokens found</p>
                    <p className="text-xs text-base-muted max-w-sm">
                      {tokens.length === 0 
                        ? 'Connect your wallet or switch to a network where you hold tokens.' 
                        : 'No tokens match your search criteria.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTokens.map((token) => {
                const pctOfTotal = totalUSD > 0 ? ((token.valueUSD / totalUSD) * 100).toFixed(1) : '0'

                return (
                  <tr
                    key={token.address}
                    onClick={() => onToggleToken(token.address)}
                    className={`cursor-pointer transition-colors ${
                      token.selected
                        ? 'bg-base-blue/[0.07] hover:bg-base-blue/[0.12]'
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
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-base-blue/20 text-base-blue border border-base-blue/30">
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
                      <div className="font-mono text-sm font-semibold text-white">
                        {token.formattedBalance}
                      </div>
                      <div className="text-[11px] text-base-muted font-mono">
                        ${token.priceUSD < 0.01 ? token.priceUSD.toFixed(6) : token.priceUSD.toFixed(2)} / unit
                      </div>
                    </td>

                    {/* USD Value */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-extrabold text-white text-base">
                        ${token.valueUSD.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-base-muted font-mono">
                        {pctOfTotal}% of chain
                      </div>
                    </td>

                    {/* Gas Cost */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-xs text-base-muted font-mono">
                        <Fuel className="w-3 h-3 text-base-muted" />
                        <span>~${token.estimatedGasUSD.toFixed(3)}</span>
                      </div>
                    </td>

                    {/* Status Recommendation */}
                    <td className="py-3.5 px-4 text-right">
                      {token.isProfitable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-base-green/15 text-base-green border border-base-green/30">
                          🔥 Sweep Recommended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-base-yellow/10 text-base-yellow border border-base-yellow/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Value (Gas heavy)</span>
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

      {/* Footer Status */}
      <div className="p-4 bg-base-surface/60 border-t border-white/[0.06] flex items-center justify-between text-xs text-base-muted">
        <div>
          Showing {filteredTokens.length} of {tokens.length} assets
        </div>
        <div className="flex items-center gap-2 font-mono text-white">
          <span>Queued to Zap:</span>
          <span className="font-bold text-base-blue">{selectedCount} tokens</span>
        </div>
      </div>
    </div>
  )
}
