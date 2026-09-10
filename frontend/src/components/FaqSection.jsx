import React, { useState } from 'react'
import { ChevronDown, HelpCircle, Shield, Zap, Sparkles } from 'lucide-react'

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    {
      q: 'How does DustZap save up to 80% on gas fees?',
      a: 'Normally, swapping 5 tokens and bridging them requires 5 separate token approvals, 5 DEX swap transactions, and 5 bridge operations (15 transactions total). DustZap uses Permit2 batch signing and atomic routing to consolidate all approvals and swaps into a single operation, saving significant gas and time.'
    },
    {
      q: 'How fast is the bridge to Base Network?',
      a: 'DustZap bridges funds via Relay Protocol, an ultra-fast cross-chain execution network. Funds typically arrive and settle on Base within 1 to 3 seconds.'
    },
    {
      q: 'What happens to spam or zero-liquidity tokens?',
      a: 'DustZap automatically filters out unverified tokens, honeypots, and tokens with zero liquidity pools on Uniswap/Camelot to prevent transaction failures.'
    },
    {
      q: 'Is DustZap non-custodial and secure?',
      a: 'Yes, DustZap is 100% non-custodial. Your funds never pass through a centralized intermediary. All operations are executed directly between your wallet and verified decentralized protocols.'
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-white/[0.08]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-blue/10 border border-base-blue/20 text-xs font-bold text-base-blue mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          How DustZap Works
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className="rounded-2xl bg-base-card border border-white/[0.06] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-base-blue transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-base-muted transition-transform ${isOpen ? 'rotate-180 text-base-blue' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-base-muted leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
