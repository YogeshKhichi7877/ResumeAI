import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime'),
    }
  },
   optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime' , 'react-router-dom',
    'axios',
    'react-hot-toast',
    'lucide-react'],  // 👈 force Vite to always bundle these together
    exclude: [],
    force: true, // 👈 ensure Vite doesn't skip optimization on subsequent runs
  },
  server: {
    port: 5173,
    hmr: { clientPort: 5173 },
    proxy: { '/api': 'https://resumelens-api-pac6.onrender.com' }
  }
});