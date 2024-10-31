import { createApp } from "vue";
import { createPinia } from "pinia";
import { QuillEditor } from '@vueup/vue-quill'
import "./style.css";
import App from "./App.vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App);
app.use(createPinia());
app.component('QuillEditor', QuillEditor)
app.mount("#app");
