import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  build: {
    outDir: '../lucidflow-backend/src/main/resources/static',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
