import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f9f5',
          100: '#e8f1dc',
          200: '#d1e3b9',
          300: '#a8c97f',
          400: '#7fb347',
          500: '#5a8f35',
          600: '#4a7529',
          700: '#3d5f23',
          800: '#2f4a1c',
          900: '#243a16',
        },
        earth: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4bc9e',
          400: '#b89874',
          500: '#9f7e5c',
          600: '#8b6b4a',
          700: '#6f5539',
          800: '#5c4530',
          900: '#4a3626',
        },
        nature: {
          50: '#f8faf6',
          100: '#e9f2e3',
          200: '#c8ddb6',
          300: '#98bd7a',
          400: '#6b9d4f',
          500: '#528038',
          600: '#41662c',
          700: '#355127',
          800: '#2a4020',
          900: '#21331a',
        },
        cyber: {
          darker: '#0a0e1a',
          dark: '#0f1420',
          base: '#1a1f35',
          pink: '#ff2e97',
          blue: '#00d9ff',
          green: '#00ff88',
          purple: '#bd00ff',
        },
      },
    },
  },
} satisfies Config
