// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Files to scan for utility classes
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  
  // Use system preferences for dark mode
  darkMode: 'media', // Changed from 'class' to 'media' for system preference
  
  // Theme customization
  theme: {
    extend: {
      // Custom font families
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],     // Base font
        display: ['Outfit', 'sans-serif'],   // Display font
      },
      // Border radius consistency
      borderRadius: {
        'lg': '0.5rem',
      }
    },
  },
  
  // Additional plugins
  plugins: [
    require('@tailwindcss/forms'),  // Enhanced form styles
  ],
}

// This config:
// - Uses TypeScript for better type checking
// - Scans specified files for utility classes
// - Configures system-based dark mode
// - Extends default theme with:
// - Custom font stacks
// - Consistent border radius
// - Includes form styling plugin