import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./", // Allows running build output without a web server
  plugins: [react(), tailwindcss()],
});
