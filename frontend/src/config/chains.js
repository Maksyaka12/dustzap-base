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
    name: 'Optimism (OP)',
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
    id: 56,
    name: 'BNB Smart Chain',
    shortName: 'BNB Chain',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
    color: '#F3BA2F',
    rpcUrl: 'https://binance.llamarpc.com',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    avgGasFeeUSD: 0.025,
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
    id: 59144,
    name: 'Linea',
    shortName: 'Linea',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_linea.jpg',
    color: '#61DFFF',
    rpcUrl: 'https://rpc.linea.build',
    explorerUrl: 'https://lineascan.build',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    avgGasFeeUSD: 0.02,
    popular: true
  },
  {
    id: 7000,
    name: 'ZetaChain',
    shortName: 'ZetaChain',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_zetachain.jpg',
    color: '#005741',
    rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
    explorerUrl: 'https://explorer.zetachain.com',
    nativeCurrency: { name: 'ZETA', symbol: 'ZETA', decimals: 18 },
    avgGasFeeUSD: 0.01,
    popular: true
  },
  {
    id: 204,
    name: 'opBNB',
    shortName: 'opBNB',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_opbnb.jpg',
    color: '#F0B90B',
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    explorerUrl: 'https://opbnbscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    avgGasFeeUSD: 0.005,
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
