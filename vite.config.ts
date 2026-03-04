import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  }
})
