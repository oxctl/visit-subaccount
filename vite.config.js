import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.CI !== "true" && mkcert(),
  ],
  build: {
    // This means we don't have to change the config in cloudflare.
    outDir: "build",
  },
  server: {
    port: 3000,
    https: true,
    proxy: {
      "/api": "https://oxeval.instructure.com",
    },
  },
});
