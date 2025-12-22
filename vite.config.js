import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        // Remove /api prefix when forwarding to backend
        // Frontend: /api/categories -> Backend: http://localhost:3002/categories
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Only log API requests
            if (req.url && req.url.startsWith('/api')) {
              console.log('Sending Request to the Target:', req.method, req.url);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Only log API responses
            if (req.url && req.url.startsWith('/api')) {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            }
          });
        },
      }
    }
  }
})

