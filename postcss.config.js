export default {
  plugins: {
    tailwindcss: {},    // Enables Tailwind CSS processing
    autoprefixer: {},   // Adds vendor prefixes automatically
  },
}

// This config:
// - Uses ES modules syntax for export
// - Configures two PostCSS plugins:
// - Tailwind CSS for utility-first styling
// - Autoprefixer for browser compatibility
// - Uses default options for both plugins
// - Processes CSS during build time

// Purpose:
// - Enables modern CSS tooling
// - Optimizes CSS for production
// - Ensures cross-browser compatibility