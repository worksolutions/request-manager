import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "RequestManager",
            fileName: "index",
        },
        rollupOptions: {
            external: [],
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});
