import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Enable runtime checks in dev
        dev: process.env.NODE_ENV !== 'production',
        // Hydratable for SSR (future)
        hydratable: true,
      },
      hot: {
        // Preserve local state on HMR
        preserveLocal: true,
        // Don't reload on CSS changes
        noReload: false,
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@intelligence': path.resolve(__dirname, './src/intelligence'),
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
    strictPort: false,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  preview: {
    port: 4173,
    host: true,
    strictPort: false,
    open: true,
  },

  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core lattice brain (always needed)
          'lattice-core': [
            './src/core/manifold.js',
            './src/core/validator.js',
            './src/core/emergence.js',
            './src/core/convergence.js',
            './src/core/ground-state.js',
            './src/core/lattice.js',
          ],
          // CLI interface
          'cli': [
            './src/cli/parser.js',
            './src/cli/syntax.js',
            './src/cli/autocomplete.js',
            './src/cli/validator-ui.js',
            './src/cli/executor.js',
          ],
          // Rendering engine
          'rendering': [
            './src/rendering/svg-generator.js',
            './src/rendering/frame-interpolator.js',
            './src/rendering/gif-composer.js',
            './src/rendering/optimization.js',
            './src/rendering/export.js',
          ],
          // Utilities
          'utils': [
            './src/utils/geometry.js',
            './src/utils/color-math.js',
            './src/utils/wcag.js',
            './src/utils/interpolation.js',
            './src/utils/physics.js',
          ],
          // Vendor dependencies
          'vendor-svelte': ['svelte'],
          'vendor-utils': ['chroma-js', 'lodash-es', 'nanoid', 'bezier-easing', 'gl-matrix'],
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
  },

  optimizeDeps: {
    include: [
      'svelte',
      'chroma-js',
      'lodash-es',
      'nanoid',
      'bezier-easing',
      'gl-matrix',
    ],
    exclude: ['@sveltejs/vite-plugin-svelte'],
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'scripts/',
        '*.config.js',
      ],
    },
  },

  define: {
    // Environment variables available in code
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0-alpha.1'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'dev'),
  },

  // Performance optimizations
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
  },
});
