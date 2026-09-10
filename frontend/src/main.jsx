import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { base, arbitrum, optimism, polygon, bsc, linea, zetachain, opBNB, mainnet } from 'viem/chains'
import { privyWagmiConfig, PRIVY_APP_ID } from './config/privyWagmi'
import { App } from './App'
import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0A0B0D', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#0052FF', fontSize: '24px', marginBottom: '12px' }}>DustZap ⚡</h1>
          <p style={{ color: '#8A919E', marginBottom: '16px' }}>An error occurred during app startup:</p>
          <pre style={{ background: '#161820', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '600px', overflowX: 'auto', fontSize: '12px' }}>
            {this.state.error?.toString() || 'Unknown error'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#0052FF', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          loginMethods: ['wallet', 'email', 'farcaster', 'google'],
          defaultChain: base,
          supportedChains: [base, arbitrum, optimism, bsc, polygon, linea, zetachain, opBNB, mainnet],
          appearance: {
            theme: 'dark',
            accentColor: '#0052FF',
            logo: 'https://raw.githubusercontent.com/base-org/brand-kit/main/logo/in-product/Base_Network_Logo.svg',
            showWalletLoginFirst: true,
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets'
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PrivyWagmiProvider config={privyWagmiConfig}>
            <App />
          </PrivyWagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
