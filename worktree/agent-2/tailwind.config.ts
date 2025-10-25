import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#FF10F0',
          blue: '#00F0FF',
          green: '#39FF14',
          purple: '#B026FF',
          yellow: '#FFFF00',
        },
        cyber: {
          dark: '#0a0a0a',
          darker: '#050505',
          gray: '#1a1a1a',
          'gray-light': '#2a2a2a',
        },
        primary: {
          50: '#FF10F020',
          100: '#FF10F030',
          200: '#FF10F040',
          300: '#FF10F060',
          400: '#FF10F080',
          500: '#FF10F0',
          600: '#E00DD8',
          700: '#C00AC0',
          800: '#A008A8',
          900: '#800690',
        },
      },
      boxShadow: {
        'neon-pink': '0 0 5px #FF10F0, 0 0 20px #FF10F0, 0 0 40px #FF10F0',
        'neon-blue': '0 0 5px #00F0FF, 0 0 20px #00F0FF, 0 0 40px #00F0FF',
        'neon-green': '0 0 5px #39FF14, 0 0 20px #39FF14, 0 0 40px #39FF14',
        'neon-purple': '0 0 5px #B026FF, 0 0 20px #B026FF, 0 0 40px #B026FF',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow': {
          'from': {
            textShadow: '0 0 10px #FF10F0, 0 0 20px #FF10F0, 0 0 30px #FF10F0',
          },
          'to': {
            textShadow: '0 0 20px #FF10F0, 0 0 30px #FF10F0, 0 0 40px #FF10F0',
          },
        },
      },
    },
  },
} satisfies Config
