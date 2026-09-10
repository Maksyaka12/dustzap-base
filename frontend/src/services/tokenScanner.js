import { createPublicClient, http, formatUnits } from 'viem'
import { arbitrum, optimism, polygon, mainnet, base } from 'viem/chains'
import { TOKEN_LISTS } from '../config/tokens'
import { SOURCE_CHAINS } from '../config/chains'

const VIEM_CHAINS = {
  42161: arbitrum,
  10: optimism,
  137: polygon,
  1: mainnet,
  8453: base
}

const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  }
]

// Fallback pricing cache
const PRICE_CACHE = {
  'ethereum': 2650.0,
  'usd-coin': 1.0,
  'tether': 1.0,
  'dai': 1.0,
  'arbitrum': 0.58,
  'optimism': 1.62,
  'matic-network': 0.42,
  'wrapped-bitcoin': 64000.0,
  'camelot-token': 1150.0,
  'gmx': 28.5,
  'stargate-finance': 0.32,
  'pendle': 4.15,
  'magic': 0.48,
  'velodrome-finance': 0.08,
  'synthetix': 1.55,
  'quickswap': 0.05
}

/**
 * Fetch live USD prices from DeFiLlama with CoinGecko fallback
 */
export async function fetchTokenPrices(coingeckoIds = []) {
  try {
    const ids = Array.from(new Set([...coingeckoIds, 'ethereum', 'usd-coin', 'tether'])).join(',')
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, {
      headers: { 'Accept': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json()
      const prices = {}
      for (const [id, val] of Object.entries(data)) {
        if (val && val.usd !== undefined) {
          prices[id] = val.usd
        }
      }
      return { ...PRICE_CACHE, ...prices }
    }
  } catch (err) {
    console.warn('Live price fetch failed, using fallback cache:', err)
  }
  return PRICE_CACHE
}

/**
 * Scan all tokens for a given wallet and chainId
 */
export async function scanWalletTokens(address, chainId) {
  if (!address || !chainId) return []

  const chain = VIEM_CHAINS[chainId]
  if (!chain) return []

  const chainMeta = SOURCE_CHAINS.find(c => c.id === chainId)
  const client = createPublicClient({
    chain,
    transport: http()
  })

  const tokenDefs = TOKEN_LISTS[chainId] || []
  const priceIds = tokenDefs.map(t => t.priceId).filter(Boolean)
  const prices = await fetchTokenPrices(priceIds)
  const ethPriceUSD = prices['ethereum'] || 2650

  const results = []

  // 1. Fetch Native Currency Balance (ETH/POL)
  try {
    const nativeBal = await client.getBalance({ address })
    if (nativeBal > 0n) {
      const formatted = formatUnits(nativeBal, 18)
      const balNum = parseFloat(formatted)
      const nativePriceId = chainId === 137 ? 'matic-network' : 'ethereum'
      const priceUSD = prices[nativePriceId] || (chainId === 137 ? 0.42 : ethPriceUSD)
      const valueUSD = balNum * priceUSD

      // Gas estimate for native bridging
      const estimatedGasUSD = chainMeta?.avgGasFeeUSD || 0.015

      // Only include if value has at least some dust
      if (valueUSD > 0.001) {
        results.push({
          address: '0x0000000000000000000000000000000000000000',
          symbol: chain.nativeCurrency.symbol,
          name: `${chain.nativeCurrency.name} (Native)`,
          decimals: 18,
          rawBalance: nativeBal.toString(),
          formattedBalance: balNum.toFixed(6),
          priceUSD,
          valueUSD,
          estimatedGasUSD,
          isProfitable: valueUSD > estimatedGasUSD * 1.1,
          isNative: true,
          logo: chainMeta?.logo || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
          selected: valueUSD > estimatedGasUSD * 1.1
        })
      }
    }
  } catch (err) {
    console.warn('Native balance query error:', err)
  }

  // 2. Fetch ERC20 Token Balances via Multicall
  const contracts = tokenDefs.map(token => ({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address]
  }))

  try {
    const balances = await client.multicall({ contracts, allowFailure: true })

    tokenDefs.forEach((token, idx) => {
      const callRes = balances[idx]
      if (callRes && callRes.status === 'success' && callRes.result > 0n) {
        const raw = callRes.result
        const formatted = formatUnits(raw, token.decimals)
        const balNum = parseFloat(formatted)
        const priceUSD = prices[token.priceId] || 0
        const valueUSD = balNum * priceUSD

        const estimatedGasUSD = chainMeta?.avgGasFeeUSD || 0.015

        // Include any non-zero balance
        if (balNum > 0.000001) {
          results.push({
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            rawBalance: raw.toString(),
            formattedBalance: balNum < 0.001 ? balNum.toFixed(6) : balNum.toFixed(4),
            priceUSD,
            valueUSD,
            estimatedGasUSD,
            isProfitable: valueUSD > estimatedGasUSD * 1.2,
            isNative: false,
            logo: token.logo,
            selected: valueUSD > estimatedGasUSD * 1.2
          })
        }
      }
    })
  } catch (err) {
    console.warn('Multicall ERC20 scanning error:', err)
  }

  // Sort: Profitable first, then by USD value descending
  return results.sort((a, b) => b.valueUSD - a.valueUSD)
}
