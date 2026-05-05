import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react(),
        electron({
            main: {
                entry: "electron/main.ts",
            },
            preload: {
                input: path.join(__dirname, "electron/preload.ts"),
            },
            renderer: process.env.NODE_ENV === "test" ? undefined : {},
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                // Ana pencere
                main: path.resolve(__dirname, "index.html"),
                // Yeni pencereler (Buraya istediğin kadar ekleyebilirsin)
                addAnimalWindow: path.resolve(__dirname, 'src/add-animal.html'),
                animalDetailWindow: path.resolve(__dirname, 'src/animal-detail.html'),
                updateAnimalWindow: path.resolve(__dirname, 'src/update-animal.html'),
            },
        },
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
});