/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#2D4A47',
          DEFAULT: '#2D4A47',
        },
        secondary: {
          teal: '#4A6B68',
        },
        accent: {
          green: '#5A7B78',
        },
        light: {
          gray: '#F8F9FA',
        },
        text: {
          dark: '#2C3E50',
          light: '#6C7B7F',
        },
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'heading': ['clamp(48px, 8vw, 72px)', {
          lineHeight: '1.1',
          fontWeight: '700',
        }],
      },
      screens: {
        'xs': '320px',
        'sm': '768px',
        'md': '1024px',
        'lg': '1440px',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
}
