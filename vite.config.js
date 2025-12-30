import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@cli': path.resolve(__dirname, './src/cli'),
      '@rendering': path.resolve(__dirname, './src/rendering'),
      '@state': path.resolve(__dirname, './src/state'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },

  server: {
    port: 5173,
    host: true,
  },

  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },

  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify('production'),
  },
});
