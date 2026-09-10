import { http } from 'wagmi'
import { base, arbitrum, optimism, polygon, mainnet, baseSepolia } from 'wagmi/chains'
import { createConfig } from '@privy-io/wagmi'

export const privyWagmiConfig = createConfig({
  chains: [base, arbitrum, optimism, polygon, mainnet, baseSepolia],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

export const PRIVY_APP_ID = 'cmtvf7o31019a0elh4rxp0lnj'
export const BUILDER_CODE_SUFFIX = '0x07626173656170700080218021802180218021802180218021'
