import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'VeteranFunnel',
      fileName: 'veteran-funnel',
      formats: ['iife'] // Immediately Invoked Function Expression for browser
    },
    rollupOptions: {
      external: [], // Bundle everything
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'veteran-funnel.css'
          return assetInfo.name
        },
        extend: true
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}) 