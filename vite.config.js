import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT || 3000,
    allowedHosts: ['localhost', process.env.HOST],
    
  },
  plugins: [react()],
})
