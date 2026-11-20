import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Allow local dev plus hosted preview sandboxes (e.g. *.e2b.app proxies).
    allowedHosts: ['localhost', '127.0.0.1', '.e2b.app'],
  },
  preview: {
    host: true,
    allowedHosts: ['localhost', '127.0.0.1', '.e2b.app'],
  },
})
