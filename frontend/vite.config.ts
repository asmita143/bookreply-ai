import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/emails": "http://localhost:8000",
      "/gmail/sync": "http://localhost:8000",
      "/ai/draft/": "http://localhost:8000",
    },
  },
})
