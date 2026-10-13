import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  root: 'apps/web', base: './', plugins: [react(), tailwindcss()],
  build: { outDir: '../../dist/web', emptyOutDir: true },
  server: { port: 5173, strictPort: true },
  test: { include: ['../../packages/**/*.test.ts'] },
});
