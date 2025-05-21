import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3002,
    proxy: {
      '/api': {
        target: 'https://api.zakya.com',
        changeOrigin: true,
        secure: true,
      },
      '/auth': {
        target: 'https://api.zakya.com',
        changeOrigin: true,
        secure: true,
      },
      '/zoho-accounts': {
        target: 'https://accounts.zoho.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/zoho-accounts/, '')
      },
      '/zoho-api': {
        target: 'https://api.zakya.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/zoho-api/, '')
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
