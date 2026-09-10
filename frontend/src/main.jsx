import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base, arbitrum, optimism, polygon, mainnet } from 'viem/chains'
import { privyWagmiConfig, PRIVY_APP_ID } from './config/privyWagmi'
import { App } from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#0052FF',
          logo: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg',
          showWalletLoginFirst: true,
          walletList: ['coinbase_wallet', 'metamask', 'rainbow', 'rabby_wallet', 'phantom', 'wallet_connect']
        },
        defaultChain: base,
        supportedChains: [base, arbitrum, optimism, polygon, mainnet],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <PrivyWagmiProvider config={privyWagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PrivyWagmiProvider>
    </PrivyProvider>
  </React.StrictMode>
)
