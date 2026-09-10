import React from 'react'
import { Shield, Sparkles, ExternalLink, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-white/[0.08] bg-base-dark py-10 text-xs text-base-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-base-blue flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="font-bold text-white">DustZap ⚡</span>
          <span className="text-base-muted">|</span>
          <span>The Multi-Token Dust Sweeper & Bridge to Base</span>
        </div>

        {/* Center: Base Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-base-blue" />
          <span className="text-white font-medium">Built on Base 🔵</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://docs.base.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Base Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>BaseScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://relay.link"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Relay Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
