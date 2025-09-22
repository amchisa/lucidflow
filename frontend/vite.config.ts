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
        target: "http://localhost:8080", // Backend server URL
        changeOrigin: true, // Bypass CORS restrictions in development
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix when forwarding to backend
      },
    },
  },
});
