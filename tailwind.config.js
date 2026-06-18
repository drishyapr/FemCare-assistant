/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#db2777',
          500: '#be185d',
          600: '#9d174d',
          700: '#831843',
        },
        sage: {
          50: '#f4f7f6',
          100: '#e8ecea',
          200: '#d1dbd6',
          300: '#a3b7ad',
          400: '#759384',
          500: '#567364',
          600: '#41574b',
          700: '#34453c',
        }
      }
    },
  },
  plugins: [],
}
