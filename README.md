# DustZap ⚡ | Multi-Token Dust Sweeper & Bridge to Base 🔵

<div align="center">
  <img src="https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg" width="64" height="64" alt="Base Logo" />
  <p><strong>Consolidate cross-chain micro-balances and bridge directly to Base in 1 click</strong></p>
</div>

---

## 🚀 Overview

**DustZap** solves liquidity fragmentation in EVM wallets. Users holding scattered small balances ($0.05, $0.50, $2, $10) across Arbitrum, Optimism, Polygon, and Ethereum can discover all tokens in one interface, filter out scam/unprofitable assets, batch-swap them, and bridge the total balance as **ETH** or **USDC** directly to **Base** via Relay Protocol in ~2 seconds.

---

## ✨ Features

- **Multi-Network Dust Scanner**: Auto-detects ERC20 + Native tokens across Arbitrum, OP, Polygon, and Ethereum.
- **Base Brand Kit UI**: Designed according to official Base design guidelines (Base Blue `#0052FF`, Dark canvas, glowing accents).
- **Anti-Spam & Gas Profitability Check**: Auto-flags honeypots and assets where gas cost exceeds token value.
- **1-Click Batch Execution**: Batch Permit2 + DEX aggregator routing to eliminate separate approvals.
- **Instant Relay Bridge**: Funds arrive on Base within 1–3 seconds.
- **Base Builder Codes**: Includes official Base transaction attribution for Base.dev.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js / Vite + React 18, Tailwind CSS, Lucide React, Canvas-Confetti
- **Web3**: Wagmi v2, Viem v2, TanStack Query, Base Account SDK
- **Cross-Chain Bridge**: Relay Protocol API (`https://api.relay.link`)
- **Smart Contracts**: Foundry / Solidity `DustZapRouter.sol`

---

## 📦 Quickstart

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 📜 License
MIT
