import { http } from 'wagmi'
import { base, arbitrum, optimism, polygon, mainnet, bsc, zetachain, opBNB, linea, baseSepolia } from 'wagmi/chains'
import { createConfig } from '@privy-io/wagmi'

export const privyWagmiConfig = createConfig({
  chains: [base, arbitrum, optimism, bsc, polygon, linea, zetachain, opBNB, mainnet, baseSepolia],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [bsc.id]: http('https://binance.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [linea.id]: http('https://rpc.linea.build'),
    [zetachain.id]: http('https://zetachain-evm.blockpi.network/v1/rpc/public'),
    [opBNB.id]: http('https://opbnb-mainnet-rpc.bnbchain.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})

export const PRIVY_APP_ID = 'cmtvf7o31019a0elh4rxp0lnj'
export const BUILDER_CODE_SUFFIX = '0x07626173656170700080218021802180218021802180218021'
