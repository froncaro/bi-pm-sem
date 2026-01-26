import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bi-pm-sem/',
  build: {
    outDir: 'dist'
  }
})
