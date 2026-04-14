import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',

  plugins: [react()],

  define: {
    global: 'window'
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  },

  server: {
    port: 5173,
    strictPort: false
  },

  build: {
    outDir: 'build',
    target: 'esnext',
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})