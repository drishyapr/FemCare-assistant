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
          bg: '#f0f5f1',
          card: '#ffffff',
          border: '#e1eae3',
          accent: '#52795d',
          hover: '#eaf1ec',
          muted: '#6b7c70',
        },
        moss: {
          DEFAULT: '#52795d',
          hover: '#4a6e54',
          dark: '#3d5a45',
        },
        charcoal: {
          DEFAULT: '#232d25',
          muted: '#4a5c50',
          light: '#6b7c70',
        }
      }
    },
  },
  plugins: [],
}
