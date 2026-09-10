import { createPublicClient, http, formatUnits } from 'viem'
import { arbitrum, optimism, bsc, polygon, linea, zetachain, opBNB, mainnet, base } from 'viem/chains'
import { SOURCE_CHAINS } from '../config/chains'

const BLOCKSCOUT_APIS = {
  42161: 'https://arbitrum.blockscout.com/api/v2',
  10: 'https://optimism.blockscout.com/api/v2',
  137: 'https://polygon.blockscout.com/api/v2',
  1: 'https://eth.blockscout.com/api/v2',
  7000: 'https://zetachain.blockscout.com/api/v2',
  59144: 'https://linea.blockscout.com/api/v2',
  8453: 'https://base.blockscout.com/api/v2'
}

const GECKOTERMINAL_NETWORKS = {
  42161: 'arbitrum',
  10: 'optimism',
  56: 'bsc',
  137: 'polygon_pos',
  59144: 'linea',
  7000: 'zetachain',
  204: 'opbnb',
  1: 'eth',
  8453: 'base'
}

const VIEM_CHAINS = {
  42161: arbitrum,
  10: optimism,
  56: bsc,
  137: polygon,
  59144: linea,
  7000: zetachain,
  204: opBNB,
  1: mainnet,
  8453: base
}

export const MIN_DUST_THRESHOLD_USD = 0.01

/**
 * Fetch GeckoTerminal token prices for a list of contract addresses
 */
async function fetchGeckoTerminalPrices(chainId, addresses = []) {
  if (!addresses || addresses.length === 0) return {}
  const network = GECKOTERMINAL_NETWORKS[chainId]
  if (!network) return {}

  try {
    const chunk = addresses.slice(0, 30).join(',')
    const res = await fetch(`https://api.geckoterminal.com/api/v2/simple/networks/${network}/token_price/${chunk}`, {
      headers: { 'Accept': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json()
      return data?.data?.attributes?.token_prices || {}
    }
  } catch (err) {
    console.warn('GeckoTerminal price fetch failed for chain', chainId, err)
  }
  return {}
}

/**
 * Scan all tokens for a wallet across a specific chain
 */
export async function scanWalletTokens(address, chainId) {
  if (!address || !chainId) return []

  const chainMeta = SOURCE_CHAINS.find(c => c.id === chainId)
  const apiBase = BLOCKSCOUT_APIS[chainId]
  const avgGasFeeUSD = chainMeta?.avgGasFeeUSD || 0.015

  const results = []

  // 1. Fetch Native Currency Balance
  try {
    const chain = VIEM_CHAINS[chainId]
    if (chain) {
      const client = createPublicClient({ chain, transport: http() })
      const nativeBal = await client.getBalance({ address })
      
      if (nativeBal > 0n) {
        const formatted = formatUnits(nativeBal, 18)
        const balNum = parseFloat(formatted)
        
        let nativePriceUSD = 2450 // Default ETH fallback
        if (chainId === 137) nativePriceUSD = 0.42 // POL
        else if (chainId === 56 || chainId === 204) nativePriceUSD = 650 // BNB
        else if (chainId === 7000) nativePriceUSD = 0.65 // ZETA

        try {
          let coinId = 'ethereum'
          if (chainId === 137) coinId = 'matic-network'
          else if (chainId === 56 || chainId === 204) coinId = 'binancecoin'
          else if (chainId === 7000) coinId = 'zetachain'

          const pRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
          if (pRes.ok) {
            const pData = await pRes.json()
            if (pData[coinId]?.usd) nativePriceUSD = pData[coinId].usd
          }
        } catch (e) {
          // ignore
        }

        const valueUSD = balNum * nativePriceUSD

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
    console.warn('Native balance query failed for chain', chainId, err)
  }

  // 2. Fetch ERC-20 Token Balances via Blockscout Portfolio API (if supported)
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/addresses/${address}/token-balances`, {
        headers: { 'Accept': 'application/json' }
      })

      if (res.ok) {
        const tokenList = await res.json()

        if (Array.isArray(tokenList)) {
          // Collect addresses needing price lookup
          const unpricedAddrs = []
          tokenList.forEach(item => {
            if (item.token && !item.token.exchange_rate) {
              const addr = item.token.address_hash || item.token.address
              if (addr) unpricedAddrs.push(addr)
            }
          })

          const extraPrices = await fetchGeckoTerminalPrices(chainId, unpricedAddrs)

          tokenList.forEach(item => {
            const token = item.token
            if (!token || item.value === '0' || !item.value) return
            if (token.reputation === 'scam' || token.reputation === 'suspicious') return

            const addr = (token.address_hash || token.address || '').toLowerCase()
            const decimals = parseInt(token.decimals || '18', 10)
            const rawVal = BigInt(item.value)
            const formatted = formatUnits(rawVal, decimals)
            const balNum = parseFloat(formatted)

            if (balNum <= 0) return

            const priceUSD = parseFloat(extraPrices[addr] || token.exchange_rate || '0')
            const valueUSD = balNum * priceUSD

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

  return results.sort((a, b) => b.valueUSD - a.valueUSD)
}

/**
 * Scan dust total summary across all 8 supported source chains
 */
export async function scanAllChainsSummary(address) {
  if (!address) return {}

  const summary = {}
  const chainIds = [42161, 10, 56, 137, 59144, 7000, 204, 1]

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
