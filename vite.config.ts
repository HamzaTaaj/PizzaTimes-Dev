import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.ai'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/shopify-admin': {
        target: 'https://pizzaanytime.myshopify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/shopify-admin/, '/admin/api/2024-10/graphql.json'),
        headers: {
          'X-Shopify-Access-Token': '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',
        },
      },
      '/api/shopify-metaobjects': {
        target: 'https://pizzaanytime.myshopify.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/shopify-metaobjects/, '/admin/api/2024-01/metaobjects.json'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Set headers for REST API
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('X-Shopify-Access-Token', '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');
            proxyReq.setHeader('Accept', 'application/json');
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
})
