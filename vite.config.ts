import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cast process to any to avoid TypeScript errors during build if @types/node isn't perfect
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // JSON.stringify is crucial here to safely inject the string value
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})