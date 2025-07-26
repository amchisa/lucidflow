import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/api/, ""), // Backend does not expect /api url header
        changeOrigin: true, // Bypasses CORS restrictions in development
      },
    },
  },
});
