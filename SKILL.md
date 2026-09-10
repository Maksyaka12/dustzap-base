---
name: DustZap Bridge & Sweeper Skill
description: Skill enabling AI agents and users to interact with DustZap, the multi-token dust sweeper and bridge to Base (Chain ID 8453).
---

# DustZap AI Agent Skill Definition

DustZap is the multi-token dust consolidator and cross-chain bridge built on Base. It enables scanning wallet dust balances across Arbitrum, Optimism, Polygon, and Ethereum Mainnet, and consolidating all selected assets into ETH or USDC on Base in a single batch transaction.

---

## 1. System Integration Details
* **Target Network**: Base Mainnet (Chain ID: `8453`)
* **Supported Source Networks**:
  - Arbitrum One (`42161`)
  - Optimism (`10`)
  - Polygon (`137`)
  - Ethereum Mainnet (`1`)
* **Relay Bridge Protocol**: `https://api.relay.link`
* **Base Builder Code Attribution**: `0x07626173656170700080218021802180218021802180218021`

---

## 2. Core Workflows
1. **Scanning**: `scanWalletTokens(address, chainId)` fetches balances and live prices from DeFiLlama / CoinGecko.
2. **Profitability Check**: Evaluates `valueUSD > gasCostUSD` to ensure user does not pay more in gas than token value.
3. **Batch Swap & Bridge**: Aggregates token routes and calls Relay Bridge to deliver funds directly to the user's Base address.
