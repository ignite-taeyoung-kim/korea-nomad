import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury theme colors: gold, black, white, deep purple
        luxury: {
          gold: {
            50: '#fdfbf7',
            100: '#faf6ed',
            200: '#f4ead3',
            300: '#ead9a9',
            400: '#ddc373',
            500: '#d4af37', // Main gold
            600: '#b8972f',
            700: '#8f7424',
            800: '#725d1d',
            900: '#5c4b18',
          },
          purple: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9', // Deep purple
            800: '#5b21b6',
            900: '#4c1d95',
          },
          black: {
            DEFAULT: '#0a0a0a',
            light: '#1a1a1a',
            lighter: '#2a2a2a',
          },
          white: {
            DEFAULT: '#ffffff',
            cream: '#faf9f6',
            pearl: '#f8f7f4',
          },
        },
        primary: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ead3',
          300: '#ead9a9',
          400: '#ddc373',
          500: '#d4af37',
          600: '#b8972f',
          700: '#8f7424',
          800: '#725d1d',
          900: '#5c4b18',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        luxury: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        luxury: '0 4px 20px rgba(212, 175, 55, 0.15)',
        'luxury-lg': '0 8px 40px rgba(212, 175, 55, 0.2)',
        'luxury-xl': '0 12px 60px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #b8972f 100%)',
        'luxury-radial': 'radial-gradient(circle at top right, #6d28d9 0%, #0a0a0a 50%)',
      },
    },
  },
} satisfies Config
