import { createPublicClient, http, formatUnits } from 'viem'
import { arbitrum, optimism, polygon, mainnet, base } from 'viem/chains'
import { SOURCE_CHAINS } from '../config/chains'

const BLOCKSCOUT_APIS = {
  42161: 'https://arbitrum.blockscout.com/api/v2',
  10: 'https://optimism.blockscout.com/api/v2',
  137: 'https://polygon.blockscout.com/api/v2',
  1: 'https://eth.blockscout.com/api/v2',
  8453: 'https://base.blockscout.com/api/v2'
}

const VIEM_CHAINS = {
  42161: arbitrum,
  10: optimism,
  137: polygon,
  1: mainnet,
  8453: base
}

// Minimum USD value threshold to filter out spam and sub-cent dust
export const MIN_DUST_THRESHOLD_USD = 0.01

/**
 * Scan all tokens for a wallet across a specific chain with >= $0.01 threshold
 */
export async function scanWalletTokens(address, chainId) {
  if (!address || !chainId) return []

  const chainMeta = SOURCE_CHAINS.find(c => c.id === chainId)
  const apiBase = BLOCKSCOUT_APIS[chainId]
  const avgGasFeeUSD = chainMeta?.avgGasFeeUSD || 0.015

  const results = []

  // 1. Fetch Native Currency Balance via Viem
  try {
    const chain = VIEM_CHAINS[chainId]
    if (chain) {
      const client = createPublicClient({ chain, transport: http() })
      const nativeBal = await client.getBalance({ address: address })
      
      if (nativeBal > 0n) {
        const formatted = formatUnits(nativeBal, 18)
        const balNum = parseFloat(formatted)
        
        // Fetch approximate native price
        let nativePriceUSD = 2450 // Default ETH fallback
        if (chainId === 137) nativePriceUSD = 0.42 // POL

        try {
          const coinId = chainId === 137 ? 'matic-network' : 'ethereum'
          const pRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
          if (pRes.ok) {
            const pData = await pRes.json()
            if (pData[coinId]?.usd) nativePriceUSD = pData[coinId].usd
          }
        } catch (e) {
          // ignore
        }

        const valueUSD = balNum * nativePriceUSD

        // Strictly only include if total value >= $0.01
        if (valueUSD >= MIN_DUST_THRESHOLD_USD) {
          results.push({
            address: '0x0000000000000000000000000000000000000000',
            symbol: chain.nativeCurrency.symbol,
            name: `${chain.nativeCurrency.name} (Native)`,
            decimals: 18,
            rawBalance: nativeBal.toString(),
            formattedBalance: balNum < 0.0001 ? balNum.toFixed(6) : balNum.toFixed(4),
            priceUSD: nativePriceUSD,
            valueUSD: valueUSD,
            estimatedGasUSD: avgGasFeeUSD,
            isProfitable: valueUSD > avgGasFeeUSD,
            isNative: true,
            logo: chainMeta?.logo || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
            selected: true
          })
        }
      }
    }
  } catch (err) {
    console.warn('Native balance query failed:', err)
  }

  // 2. Fetch All ERC-20 Token Balances via Blockscout Portfolio API
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/addresses/${address}/token-balances`, {
        headers: { 'Accept': 'application/json' }
      })

      if (res.ok) {
        const tokenList = await res.json()

        if (Array.isArray(tokenList)) {
          tokenList.forEach(item => {
            const token = item.token
            if (!token || item.value === '0' || !item.value) return

            // Filter out obvious spam/scam tokens
            if (token.reputation === 'scam' || token.reputation === 'suspicious') return

            const decimals = parseInt(token.decimals || '18', 10)
            const rawVal = BigInt(item.value)
            const formatted = formatUnits(rawVal, decimals)
            const balNum = parseFloat(formatted)

            if (balNum <= 0) return

            const priceUSD = parseFloat(token.exchange_rate || '0')
            const valueUSD = balNum * priceUSD

            // STRICT FILTER: Only tokens with value >= $0.01
            if (valueUSD >= MIN_DUST_THRESHOLD_USD) {
              results.push({
                address: token.address_hash || token.address,
                symbol: token.symbol || 'UNKNOWN',
                name: token.name || token.symbol || 'Unknown Token',
                decimals: decimals,
                rawBalance: item.value,
                formattedBalance: balNum < 0.0001 ? balNum.toFixed(6) : balNum < 1 ? balNum.toFixed(4) : balNum.toFixed(2),
                priceUSD: priceUSD,
                valueUSD: valueUSD,
                estimatedGasUSD: avgGasFeeUSD,
                isProfitable: valueUSD > avgGasFeeUSD,
                isNative: false,
                logo: token.icon_url || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                selected: true
              })
            }
          })
        }
      }
    } catch (err) {
      console.warn('Blockscout API fetch error for chain', chainId, err)
    }
  }

  // Sort: highest USD value first
  return results.sort((a, b) => b.valueUSD - a.valueUSD)
}

/**
 * Scan dust total summary across all supported source chains (>= $0.01 only)
 */
export async function scanAllChainsSummary(address) {
  if (!address) return {}

  const summary = {}
  const chainIds = [42161, 10, 137, 1]

  await Promise.all(
    chainIds.map(async (cId) => {
      try {
        const tokens = await scanWalletTokens(address, cId)
        const total = tokens.reduce((acc, t) => acc + (t.valueUSD || 0), 0)
        summary[cId] = total
      } catch (e) {
        summary[cId] = 0
      }
    })
  )

  return summary
}
