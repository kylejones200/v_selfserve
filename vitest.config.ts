import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'server/**/*.test.js'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
