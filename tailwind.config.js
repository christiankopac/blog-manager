// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Changed from 'class' to 'media' for system preference
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem', // Ensuring consistent rounded corners
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}