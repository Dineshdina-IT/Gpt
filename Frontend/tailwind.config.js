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
        // High fidelity modern dark palette
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo base
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        chatbg: {
          light: '#ffffff',
          dark: '#0e0e11', // Very deep zinc/black
          sidebarLight: '#f9f9fb',
          sidebarDark: '#17171c', // Sleek dark sidebar
          bubbleUserLight: '#f0f0f5',
          bubbleUserDark: '#2b2b35',
          bubbleBotLight: '#ffffff',
          bubbleBotDark: '#17171c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'gradient-x': 'gradientX 8s ease infinite',
      },
      keyframes: {
        blink: {
          'from, to': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'currentColor' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        gradientX: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-brand': '0 0 15px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
