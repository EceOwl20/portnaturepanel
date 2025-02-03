import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
        "/api": {
            target: "http://localhost:3000",
            secure: false
        }
    }
},
  plugins: [react(),visualizer({ open: true }),],
})
