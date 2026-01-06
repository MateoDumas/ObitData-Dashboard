import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  // GitHub Pages configuration
  base: '/ObitData-Dashboard/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
})
