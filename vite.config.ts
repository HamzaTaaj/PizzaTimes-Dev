import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
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
      '/api/support-email': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/contact-submit': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
