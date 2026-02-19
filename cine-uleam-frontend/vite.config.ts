import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    // Separar vendor libs de código de la app
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor':       ['vue', 'vue-router'],
          'supabase-vendor':  ['@supabase/supabase-js'],
          'qr-vendor':        ['qrcode', '@zxing/browser'],
        }
      }
    },
    // Máximo recomendado por chunk antes de advertencia
    chunkSizeWarningLimit: 600,
  },
})
