import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({
  plugins: [react(),
  VitePWA({
    devOptions: {
      enabled: true,
      type: "module",
    },
    strategies: "injectManifest",
    srcDir: "src",
    filename: "sw.ts",
    registerType: "autoUpdate",
    injectManifest: {
      swDest: "dist/sw.js",
    },
    manifest: {
      name: "SAM App",
      short_name: "SAM",
      theme_color: "#0056A4",
      background_color: "#FFFFFF",
      start_url: "/",
      display: "standalone",
      orientation: "any",
      icons: [
        {
          "src": "assets/images/pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "assets/images/pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "assets/images/pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "assets/images/maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
    },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
