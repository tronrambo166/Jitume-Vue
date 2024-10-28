/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        white: '#FFFFFF',
        slate: {
          100: '#F1F5F9',
        },
        // green: '#198754',
        black: '#000000',

        // Dark theme colors
        'dark-bg': '#000000',  // Dark background color
        'dark-text': '#FFFFFF', // Dark text color
        'dark-slate': '#1E293B', // Dark slate color
        'dark-green': '#16A34A', // Dark green color
      },
      spacing: {
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'screen': '100vh',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.870rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn': {
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          fontWeight: '600',
          display: 'inline-block',
          textAlign: 'center',
        },
        '.btn-primary': {
          backgroundColor: '#198754',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#16A34A',
          },
        },
        '.btn-secondary': {
          backgroundColor: '#1E293B',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#4B5563',
          },
        },
        '.btn-light': {
          backgroundColor: '#F1F5F9',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#E2E8F0',
          },
        },
        '.btn-dark': {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1E293B',
          },
        },
      })
    }
  ],
}