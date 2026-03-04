import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/AI_Risk_Assessment/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
