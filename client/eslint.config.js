import eslintPluginPrettier from 'eslint-plugin-prettier';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

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
    ignores: ['dist', 'node_modules', 'log.js', 'vite/config.prod.mjs', 'scripts/git-hooks'],
  },
  {
    env: {
      node: true,
    },
  },
];
