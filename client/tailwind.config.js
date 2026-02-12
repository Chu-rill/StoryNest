/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#6C5CE7',
          600: '#5B4BC4',
          700: '#4C3DA1',
          800: '#3D2F7E',
          900: '#2E235B',
        },
        secondary: {
          DEFAULT: '#00CEFF',
          50: '#E6FBFF',
          100: '#CCF7FF',
          200: '#99EFFF',
          300: '#66E7FF',
          400: '#33DFFF',
          500: '#00CEFF',
          600: '#00A5CC',
          700: '#007C99',
          800: '#005266',
          900: '#002933',
        },
        accent: {
          DEFAULT: '#FF6B9D',
          50: '#FFE8F0',
          100: '#FFD1E1',
          200: '#FFA3C3',
          300: '#FF75A5',
          400: '#FF6B9D',
          500: '#FF4787',
          600: '#FF1A63',
          700: '#EC004F',
          800: '#B9003D',
          900: '#86002B',
        },
        background: {
          DEFAULT: '#0F0F1A',
          light: '#1A1A2E',
        },
        surface: {
          DEFAULT: '#1A1A2E',
          light: '#252541',
          lighter: '#2F2F4A',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            a: {
              color: '#6C5CE7',
              '&:hover': {
                color: '#5B4BC4',
              },
            },
          },
        },
      },
      animation: {
        'in': 'in 200ms ease-in',
        'out': 'out 150ms ease-out',
        'fade-in': 'fade-in 150ms ease-in',
        'fade-out': 'fade-out 150ms ease-out',
        'zoom-in-95': 'zoom-in-95 150ms ease-in',
        'zoom-out-95': 'zoom-out-95 150ms ease-out',
      },
      keyframes: {
        'in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        'zoom-in-95': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'zoom-out-95': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0.95)', opacity: 0 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant('animate-in', '&[data-state="open"]');
      addVariant('animate-out', '&[data-state="closed"]');
    },
  ],
};