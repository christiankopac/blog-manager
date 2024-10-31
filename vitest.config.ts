/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: "happy-dom",
		server: {
			deps: {
				inline: ["@vue", "@vueuse", "vue-demi"],
			},
		},
		globals: true,
		root: "./src",
		setupFiles: "./vitest.setup.ts",
	},
});
