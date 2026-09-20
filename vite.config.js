import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure absolute root base for custom domain setup
  // The site is previewed through proxied hosts (and served from a custom
  // domain), so the dev/preview host allowlist must not block them.
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
})
