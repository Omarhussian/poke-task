import type { Config } from 'tailwindcss'

/**
 * Tailwind is used primarily for the app LAYOUT (grid, spacing, responsive
 * breakpoints, container). Individual component visuals live in CSS Modules.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Explicit, mobile-first breakpoints used across the responsive grids.
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f4f5fb',
        },
        // Official-ish Pokémon type palette (used by the TypeBadge component).
        type: {
          normal: '#a8a77a',
          fire: '#ee8130',
          water: '#6390f0',
          electric: '#f7d02c',
          grass: '#7ac74c',
          ice: '#96d9d6',
          fighting: '#c22e28',
          poison: '#a33ea1',
          ground: '#e2bf65',
          flying: '#a98ff3',
          psychic: '#f95587',
          bug: '#a6b91a',
          rock: '#b6a136',
          ghost: '#735797',
          dragon: '#6f35fc',
          dark: '#705746',
          steel: '#b7b7ce',
          fairy: '#d685ad',
        },
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(17, 24, 39, 0.25)',
        'card-hover': '0 18px 40px -16px rgba(17, 24, 39, 0.35)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease both',
      },
    },
  },
  plugins: [],
} satisfies Config
