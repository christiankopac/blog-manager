import { createApp } from "vue";              // Core Vue function
import { createPinia } from "pinia";          // State management
import { QuillEditor } from '@vueup/vue-quill' // Rich text editor
import "./style.css";                         // Global styles
import App from "./App.vue";                  // Root component
import '@vueup/vue-quill/dist/vue-quill.snow.css' // Quill editor styles

// Create Vue application instance
const app = createApp(App);

// Configure application:
app.use(createPinia());                    // Add Pinia state management
app.component('QuillEditor', QuillEditor)   // Register Quill globally
app.mount("#app");                         // Mount to DOM


// This entry file:
// Imports required dependencies
// Sets up Vue application
// Configures Pinia for state management
// Registers Quill editor globally
// Mounts app to DOM element with id "app"

// Key features:
// Uses Vue 3 composition API
// Integrates Pinia for state management
// Includes Quill rich text editor
// Global CSS imports
// Clean and minimal setup