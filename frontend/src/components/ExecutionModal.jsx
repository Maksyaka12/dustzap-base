import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { CheckCircle2, Loader2, ExternalLink, Zap, ArrowRight, Sparkles } from 'lucide-react'

export function ExecutionModal({
  isOpen,
  onClose,
  currentStep, // 1: Permit2/Approve, 2: Batch Swap, 3: Relay Bridge, 4: Confirmed
  txHash,
  sourceChainName = 'Arbitrum',
  targetToken = 'ETH',
  outputAmount = '0',
  netUSD = '0',
  tokensCount = 0,
  error = null
}) {
  if (!isOpen) return null

  useEffect(() => {
    if (currentStep === 4) {
      // Trigger festive Base confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0052FF', '#FFFFFF', '#00C076']
      })
    }
  }, [currentStep])

  const steps = [
    {
      id: 1,
      name: 'Batch Permit & Approvals',
      desc: 'Sign single batch permission via Permit2 (no per-token gas fees)'
    },
    {
      id: 2,
      name: `Consolidate ${tokensCount} Tokens`,
      desc: `Swap all selected assets into ${targetToken} on ${sourceChainName}`
    },
    {
      id: 3,
      name: 'Relay Protocol Cross-Chain Bridge',
      desc: 'Fast 2-second cross-chain bridge execution directly to Base'
    },
    {
      id: 4,
      name: 'Confirmed on Base 🔵',
      desc: `Funds successfully credited to your wallet on Base Network`
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-base-card border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-base-blue via-base-green to-base-blue animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-base-blue flex items-center justify-center text-white shadow-base-glow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">DustZap Execution</h3>
              <p className="text-xs text-base-muted">{sourceChainName} ➔ Base Network</p>
            </div>
          </div>

          {currentStep === 4 && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {/* Error State */}
        {error ? (
          <div className="p-4 rounded-2xl bg-base-red/10 border border-base-red/30 mb-6 text-sm text-base-red">
            <div className="font-bold mb-1">Execution Failed</div>
            <div className="text-xs opacity-90">{error}</div>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 rounded-xl bg-base-red text-white text-xs font-bold hover:bg-opacity-90"
            >
              Dismiss
            </button>
          </div>
        ) : (
          /* Steps Progress Tracker */
          <div className="space-y-4 mb-6">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-base-blue/10 border-base-blue shadow-base-glow-sm'
                      : isCompleted
                      ? 'bg-base-green/5 border-base-green/20'
                      : 'bg-base-surface/50 border-white/[0.04] opacity-50'
                  }`}
                >
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-base-green fill-base-green/20" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-base-blue animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-base-muted font-mono font-bold">
                        {step.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-base-green' : 'text-base-muted'}`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-base-muted mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Success Details on Step 4 */}
        {currentStep === 4 && (
          <div className="p-4 rounded-2xl bg-base-surface border border-white/[0.08] mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-base-muted">Output Received on Base:</span>
              <span className="font-mono font-bold text-base-green text-sm">
                +{outputAmount} {targetToken} (~${netUSD})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
              <span className="text-base-muted">BaseScan Explorer:</span>
              <a
                href={`https://basescan.org/tx/${txHash || '0x'}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-base-blue hover:underline flex items-center gap-1 text-[11px] font-bold"
              >
                <span>View on BaseScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Done Action Button */}
        {currentStep === 4 && (
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-base-blue hover:bg-base-blue-hover text-white font-extrabold text-sm transition-all shadow-base-glow"
          >
            Done & Return to Portfolio
          </button>
        )}
      </div>
    </div>
  )
}
