/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'Noto Sans SC', 'Georgia', 'serif'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1A1A2E',
          dark: '#2D2D3A',
        },
        accent: {
          DEFAULT: '#D4A574',
          light: '#E8C9A8',
          dark: '#B8864A',
        },
        surface: {
          light: '#FAFAF8',
          DEFAULT: '#FFFFFF',
          dark: '#1A1A1E',
          'dark-alt': '#2D2D3A',
        },
        text: {
          primary: '#1A1A2E',
          secondary: '#4A4A5A',
          light: '#E8E6E3',
          muted: '#B8B6B3',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
