import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isPreview = env.PR_PREVIEW === 'true';
  const prNumber = env.PR_NUMBER || '';

  return {
    base: isPreview ? `/slash-out/preview/pr-${prNumber}/` : '/slash-out/',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ['phaser'],
          },
        },
      },
    },
    server: {
      port: 8080,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'shared': path.resolve(__dirname, '../../shared'),  // ← Add this
        }
    },
  };
});
