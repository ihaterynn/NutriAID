import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/NutriAID/' : '/',
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
  };
});