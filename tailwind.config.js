/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        credentia: {
          50: '#f0f4f8',
          100: '#e1e9f1',
          200: '#c3d3e3',
          300: '#a5bdd5',
          400: '#87a7c7',
          500: 'rgba(28, 117, 188, 1)',
          600: 'rgba(28, 117, 188, 1)',
          700: '#1c5b8f',
          800: '#1a4a7a',
          900: '#183965',
        }
      }
    },
  },
  plugins: [],
};
