// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	build: {
		sourcemap: true,
		rollupOptions: {
			external: [/\/__tests__\//, /\.test\./, /\.spec\./],
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						if (id.includes("vue") || id.includes("pinia")) {
							return "vendor-vue";
						}
						if (id.includes("@vueup/vue-quill")) {
							return "vendor-vue-quill";
						}
						return "vendor-misc";
					}
				},
			},
		},
		chunkSizeWarningLimit: 800,
	},
	plugins: [vue()],
});
