import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  root: 'apps/web', base: './', plugins: [react()],
  build: { outDir: '../../dist/web', emptyOutDir: true },
  server: { port: 5173, strictPort: true },
  test: { include: ['../../packages/**/*.test.ts'] },
});
