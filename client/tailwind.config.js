/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
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