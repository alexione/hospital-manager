import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Permite accesul din afara containerului
    port: 5173,
    watch: {
      usePolling: true // Necesar uneori pe Windows pentru refresh automat
    }
  }
})