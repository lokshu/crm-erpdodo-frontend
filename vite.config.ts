import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src') // Define '@' as the src directory
    }
  },
  server: {
    port: 5172, // Set the port to 5172
  }
})
