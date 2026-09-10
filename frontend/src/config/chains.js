// Supported Networks Configuration for DustZap
export const TARGET_CHAIN = {
  id: 8453,
  name: 'Base',
  shortName: 'Base',
  logo: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg',
  color: '#0052FF',
  rpcUrl: 'https://mainnet.base.org',
  explorerUrl: 'https://basescan.org',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  isTarget: true
}

export const SOURCE_CHAINS = [
  {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
    color: '#28A0F0',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    avgGasFeeUSD: 0.015,
    popular: true
  },
  {
    id: 10,
    name: 'Optimism (OP Mainnet)',
    shortName: 'Optimism',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
    color: '#FF0420',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    avgGasFeeUSD: 0.018,
    popular: true
  },
  {
    id: 137,
    name: 'Polygon PoS',
    shortName: 'Polygon',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
    color: '#8247E5',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    avgGasFeeUSD: 0.012,
    popular: true
  },
  {
    id: 1,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
    color: '#627EEA',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    avgGasFeeUSD: 1.20,
    popular: false
  }
]

export const ALL_CHAINS = [TARGET_CHAIN, ...SOURCE_CHAINS]
