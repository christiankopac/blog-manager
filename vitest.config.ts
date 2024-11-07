/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vue plugin for component testing
  plugins: [vue()],
  
  test: {
    // Use happy-dom for DOM simulation
    environment: "happy-dom",
    
    // Server configuration
    server: {
      deps: {
        // Inline dependencies for testing
        inline: ["@vue", "@vueuse", "vue-demi"],
      },
    },
    
    // Enable global test functions
    globals: true,
    
    // Set test root directory
    root: "./src",
    
    // Test setup file
    setupFiles: "./vitest.setup.ts",
  },
});

// This config:
// - Sets up Vitest for Vue testing
// - Uses happy-dom for browser simulation
// - Configures inline dependencies
// - Enables global test functions
// - Specifies test root and setup
// - Integrates Vue plugin for components