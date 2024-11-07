// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // Build configuration
  build: {
    sourcemap: true,  // Enable source maps for debugging
    
    // Rollup specific options
    rollupOptions: {
      // Exclude test files from build
      external: [/\/__tests__\//, /\.test\./, /\.spec\./],
      
      // Configure code splitting
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // Group Vue and Pinia into one chunk
            if (id.includes("vue") || id.includes("pinia")) {
              return "vendor-vue";
            }
            // Separate chunk for Quill editor
            if (id.includes("@vueup/vue-quill")) {
              return "vendor-vue-quill";
            }
            // All other vendors
            return "vendor-misc";
          }
        },
      },
    },
    
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 800,
  },
  
  // Vue plugin
  plugins: [vue()],
});

// This config:
// - Uses Vite for build tooling
// - Enables source maps
// - Excludes test files
// - Implements smart code splitting:
//   - Core Vue/Pinia bundle
//   - Separate Quill editor bundle
//   - Other vendor code bundle
// - Adjusts chunk size warnings
// - Configures Vue plugin