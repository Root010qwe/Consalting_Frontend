import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/images/": {
        target: "http://91.135.156.74:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, "/images/"),
      },
    }, 
  },
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'), // используйте '@' как алиас для 'src'
    },
  },
  
})