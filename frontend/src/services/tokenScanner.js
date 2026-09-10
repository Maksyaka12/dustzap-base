import { createPublicClient, http, formatUnits } from 'viem'
import { arbitrum, optimism, bsc, polygon, linea, zetachain, opBNB, mainnet, base } from 'viem/chains'
import { SOURCE_CHAINS } from '../config/chains'

const BLOCKSCOUT_APIS = {
  42161: 'https://arbitrum.blockscout.com/api/v2',
  10: 'https://optimism.blockscout.com/api/v2',
  137: 'https://polygon.blockscout.com/api/v2',
  1: 'https://eth.blockscout.com/api/v2',
  7000: 'https://zetachain.blockscout.com/api/v2',
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
  },
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  }
]

// Common token contracts across chains to cross-check via Multicall
const COMMON_VERIFIED_TOKENS = {
  137: [
    { address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', symbol: 'AAVE', decimals: 18, name: 'Aave (PoS)' },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
    { address: '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89', symbol: 'FRAX', decimals: 18, name: 'Legacy Frax Dollar' },
    { address: '0xE111178A87A3BFf0c8d18DECBa5798827539Ae99', symbol: 'EURA', decimals: 18, name: 'EURA Token' },
    { address: '0xa3Fa9E80c7793882a57F9844FBE45544277b03d0', symbol: 'MAI', decimals: 18, name: 'MAI (miMATIC)' },
    { address: '0x2297aEbD383787A116F4d9B11eF9377CD496F919', symbol: 'BTC.b', decimals: 8, name: 'Bitcoin.b' },
    { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', decimals: 18, name: 'Wrapped Ether' },
    { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', symbol: 'WBTC', decimals: 8, name: 'Wrapped BTC' },
    { address: '0xb5C064F955D8e7F38fE0460C556a72987494eE17', symbol: 'QUICK', decimals: 18, name: 'Quickswap' },
    { address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', symbol: 'LINK', decimals: 18, name: 'Chainlink' }
  ],
  56: [
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, name: 'Tether USD' },
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, name: 'USD Coin' },
    { address: '0x0E09FaBB73BD3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE', decimals: 18, name: 'PancakeSwap Token' },
    { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB', decimals: 18, name: 'Wrapped BNB' },
    { address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', symbol: 'ETH', decimals: 18, name: 'Ethereum Token' },
    { address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', symbol: 'BTCB', decimals: 18, name: 'BTCB Token' },
    { address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', symbol: 'DAI', decimals: 18, name: 'Dai Token' }
  ],
  59144: [
    { address: '0xe5D7C2a44Ffddf6b295A15c148167daaAf5Cf34f', symbol: 'WETH', decimals: 18, name: 'Wrapped Ether' },
    { address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
    { address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
    { address: '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5', symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' },
    { address: '0x5FBDF89403270a1846F5ae7D113A989F850d1566', symbol: 'FOXY', decimals: 18, name: 'Foxy' }
  ],
  204: [
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WBNB', decimals: 18, name: 'Wrapped BNB' },
    { address: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3', symbol: 'USDT', decimals: 18, name: 'Tether USD' },
    { address: '0x5511A50059c381c853BEeacC74495c05B5B842a1', symbol: 'FDUSD', decimals: 18, name: 'First Digital USD' }
  ]
}

export const MIN_DUST_THRESHOLD_USD = 0.009 // Strictly >= $0.01

/**
 * Fetch GeckoTerminal token prices in batches of 30
 */
async function fetchGeckoTerminalPrices(chainId, addresses = []) {
  if (!addresses || addresses.length === 0) return {}
  const network = GECKOTERMINAL_NETWORKS[chainId]
  if (!network) return {}

  const prices = {}
  const unique = Array.from(new Set(addresses.map(a => a.toLowerCase())))

  for (let i = 0; i < Math.min(unique.length, 90); i += 30) {
    const chunk = unique.slice(i, i + 30).join(',')
    try {
      const res = await fetch(`https://api.geckoterminal.com/api/v2/simple/networks/${network}/token_price/${chunk}`, {
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        const pMap = data?.data?.attributes?.token_prices || {}
        Object.assign(prices, pMap)
      }
    } catch (err) {
      console.warn('GeckoTerminal price fetch chunk failed:', err)
    }
  }

  return prices
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
  const tokenMap = new Map()

  // 1. Fetch Native Balance
  try {
    const chain = VIEM_CHAINS[chainId]
    if (chain) {
      const client = createPublicClient({ chain, transport: http() })
      const nativeBal = await client.getBalance({ address })
      
      if (nativeBal > 0n) {
        const formatted = formatUnits(nativeBal, 18)
        const balNum = parseFloat(formatted)
        
        let nativePriceUSD = 2450 // Default ETH
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
        } catch (e) {}

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
    console.warn('Native balance query error:', err)
  }

  // 2. Fetch from Blockscout v2 API (if supported for this chain)
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/addresses/${address}/token-balances`, {
        headers: { 'Accept': 'application/json' }
      })

      if (res.ok) {
        const tokenList = await res.json()

        if (Array.isArray(tokenList)) {
          const rawNonZero = tokenList.filter(i => i.token && i.value && i.value !== '0' && i.token.reputation !== 'scam')
          const addrsToPrice = rawNonZero.map(i => i.token.address_hash || i.token.address).filter(Boolean)
          
          const livePrices = await fetchGeckoTerminalPrices(chainId, addrsToPrice)

          rawNonZero.forEach(item => {
            const token = item.token
            const addr = (token.address_hash || token.address || '').toLowerCase()
            const decimals = parseInt(token.decimals || '18', 10)
            const rawVal = BigInt(item.value)
            const formatted = formatUnits(rawVal, decimals)
            const balNum = parseFloat(formatted)

            if (balNum <= 0) return

            const priceUSD = parseFloat(livePrices[addr] || token.exchange_rate || '0')
            const valueUSD = balNum * priceUSD

            if (valueUSD >= MIN_DUST_THRESHOLD_USD) {
              const tokenObj = {
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
              }
              tokenMap.set(addr, tokenObj)
            }
          })
        }
      }
    } catch (err) {
      console.warn('Blockscout API error:', err)
    }
  }

  // 3. Multicall Check for Common DeFi & Verified Tokens
  const commonTokens = COMMON_VERIFIED_TOKENS[chainId] || []
  if (commonTokens.length > 0) {
    const chain = VIEM_CHAINS[chainId]
    if (chain) {
      try {
        const client = createPublicClient({ chain, transport: http() })
        const unqueried = commonTokens.filter(t => !tokenMap.has(t.address.toLowerCase()))
        
        if (unqueried.length > 0) {
          const contracts = unqueried.map(t => ({
            address: t.address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address]
          }))

          const balances = await client.multicall({ contracts, allowFailure: true })
          const addrsWithBal = []

          unqueried.forEach((token, idx) => {
            const callRes = balances[idx]
            if (callRes && callRes.status === 'success' && callRes.result > 0n) {
              addrsWithBal.push({ token, raw: callRes.result })
            }
          })

          if (addrsWithBal.length > 0) {
            const prices = await fetchGeckoTerminalPrices(chainId, addrsWithBal.map(a => a.token.address))

            addrsWithBal.forEach(({ token, raw }) => {
              const addr = token.address.toLowerCase()
              const formatted = formatUnits(raw, token.decimals)
              const balNum = parseFloat(formatted)
              const priceUSD = parseFloat(prices[addr] || '0')
              const valueUSD = balNum * priceUSD

              if (valueUSD >= MIN_DUST_THRESHOLD_USD) {
                tokenMap.set(addr, {
                  address: token.address,
                  symbol: token.symbol,
                  name: token.name,
                  decimals: token.decimals,
                  rawBalance: raw.toString(),
                  formattedBalance: balNum < 0.0001 ? balNum.toFixed(6) : balNum < 1 ? balNum.toFixed(4) : balNum.toFixed(2),
                  priceUSD: priceUSD,
                  valueUSD: valueUSD,
                  estimatedGasUSD: avgGasFeeUSD,
                  isProfitable: valueUSD > avgGasFeeUSD,
                  isNative: false,
                  logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                  selected: true
                })
              }
            })
          }
        }
      } catch (e) {
        console.warn('Multicall cross-check error:', e)
      }
    }
  }

  // Combine native + ERC20s
  tokenMap.forEach(token => results.push(token))

  return results.sort((a, b) => b.valueUSD - a.valueUSD)
}

/**
 * Scan dust total summary across all 8 supported source chains (>= $0.01 only)
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
