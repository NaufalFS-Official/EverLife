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
          navy: '#0A2540',
          blue: '#1A73E8',
          bg: '#F5F7FB',
        },
        stat: {
          health: '#2ECC71',
          happiness: '#F1C40F',
          relationship: '#E91E63',
          career: '#2980B9',
          wealth: '#E67E22',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
