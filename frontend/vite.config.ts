import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/emails": "http://localhost:8001",
      "/gmail/sync": "http://localhost:8001",
      "/ai/draft/": "http://localhost:8000",
      "/bookings": "http://localhost:8001",
    },
  },
})
