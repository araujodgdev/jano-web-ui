// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gemini': {
        target: 'https://jano-api-1.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini/, '/api'), // Mantenha a rota da API
      },
      '/nao': {
        target: 'http://localhost:5000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nao/, ''), // Mantenha a rota da API
      },
    },
  },
});
