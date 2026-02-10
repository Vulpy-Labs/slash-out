import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**', '**/commit-msg', '**/*.cjs'],
    languageOptions: {
      globals: {
        __dirname: true,
        process: true,
        console: true,
        require: true,
        module: true,
      },
    },
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: [
      'dist',
      'log.js',
      'node_modules',
      'scripts/git-hooks',
      'vite/config.dev.mjs',
      'vite/config.prod.mjs',
    ],
  },
];
