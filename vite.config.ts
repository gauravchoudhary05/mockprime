import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from 'lovable-tagger'

export default defineConfig(({ command, mode }) => ({
  // Essential for Capacitor - relative paths for mobile builds
  base: './',
  
  server: {
    host: '::',
    port: 8080,
  },
  
  // Crucial for Capacitor - outputs to dist folder
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'development',
  },
  
  plugins: [
    react(), 
    mode === 'development' && componentTagger()
  ].filter(Boolean as any),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Optimize for production builds
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/globals.scss";`
      }
    }
  },
  
  // Preview config for production builds
  preview: {
    port: 4173,
    host: '::',
  }
}))

