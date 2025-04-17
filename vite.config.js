import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/front_5th_chapter1-3/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        basic: path.resolve(__dirname, 'index.basic.html'),
        advanced: path.resolve(__dirname, 'index.advanced.html'),
      },
    },
  },
});
