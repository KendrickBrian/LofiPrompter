import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  define: {
    // Hardcoded API key as requested
    'process.env.API_KEY': JSON.stringify("AIzaSyCBl6VsC8lzOWGnRnDznEcHor_ZR6BTLT8")
  }
})