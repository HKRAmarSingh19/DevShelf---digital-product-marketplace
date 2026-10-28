import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./apps/api/tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
