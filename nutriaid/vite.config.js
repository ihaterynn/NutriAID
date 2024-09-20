import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
        manifest: {
          name: "NutriAID",
          short_name: "NutriAID",
          description: "An app that helps users make informed dietary choices by analyzing food labels",
          icons: [
            {
              src: "icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: "icons/favicon-16x16.png",
              sizes: "16x16",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "icons/favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
              purpose: "any"
            }
          ],
          theme_color: "#181818",
          background_color: "#e8eac2",
          display: "fullscreen",
          orientation: "portrait"
        }
      })
    ],
    build: {
      assetsDir: 'assets',
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});