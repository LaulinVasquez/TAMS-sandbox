/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07152f',
        brand: '#cb461d',
        muted: '#8c96af',
        surface: '#f8f9fa',
      },
      boxShadow: { card: '0 1px 2px rgba(12, 30, 50, 0.02)' },
    },
  },
  plugins: [],
}
