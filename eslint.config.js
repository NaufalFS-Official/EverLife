import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // TypeScript compiler handles this via noUnusedLocals
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'scripts/**'],
  }
);
