import { http, createConfig } from 'wagmi'
import { base, baseSepolia, arbitrum, optimism, polygon, mainnet } from 'wagmi/chains'
import { baseAccount, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, arbitrum, optimism, polygon, mainnet, baseSepolia],
  connectors: [
    baseAccount({
      appName: 'DustZap',
    }),
    injected(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

// Official Base Builder Code attribution data suffix
export const BUILDER_CODE_SUFFIX = '0x07626173656170700080218021802180218021802180218021'
