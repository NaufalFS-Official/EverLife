import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    execArgv: ['--expose-gc'],
    include: [
      'tests/unit/**/*.{test,spec}.ts',
      'tests/integration/**/*.{test,spec}.ts',
      'tests/playtest/**/*.{test,spec}.ts',
      'tests/balance/**/*.{test,spec}.ts',
      'security/attacks/**/*.{test,spec}.ts',
    ],
  },
});
