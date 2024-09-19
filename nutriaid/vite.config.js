import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
        manifest: './public/manifest.json'
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