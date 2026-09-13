import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployed as a GitHub Pages *user* site (fenruko.github.io), served at
  // the domain root, so no `base` path override is needed here. If this
  // ever moves to a project-page repo instead (username.github.io/reponame),
  // set base: '/reponame/' below.
})
