/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base Official Brand Kit Palette
        base: {
          blue: '#0052FF',        // Base Core Blue
          'blue-hover': '#0045D8',
          'blue-active': '#003BB8',
          'blue-light': '#EBF0FF',
          'blue-glow': 'rgba(0, 82, 255, 0.35)',
          dark: '#0A0B0D',        // Deep Canvas Background
          surface: '#111318',     // Container / Card Background
          'surface-hover': '#181B22',
          card: '#161820',
          'card-hover': '#1F222D',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(0, 82, 255, 0.5)',
          muted: '#8A919E',       // Secondary Text
          text: '#FFFFFF',        // High Contrast Text
          green: '#00C076',       // Positive PnL / Success
          yellow: '#F5A623',      // Warning / Slippage
          red: '#FF4D4D',         // Error / Scam
        }
      },
      fontFamily: {
        sans: ['Inter', 'Coinbase Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'base-glow': '0 0 25px -5px rgba(0, 82, 255, 0.45)',
        'base-glow-sm': '0 0 15px -3px rgba(0, 82, 255, 0.35)',
        'base-glow-green': '0 0 25px -5px rgba(0, 192, 118, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
