import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],

  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Enable minification (esbuild is fastest)
    minify: 'esbuild',

    // Optimize CSS
    cssMinify: true,

    // Target modern browsers for smaller output
    target: 'es2015',

    // Rollup options for better chunking
    rollupOptions: {
      output: {
        // Split vendor chunks to avoid large bundles
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React core together
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            // Group router separately if used
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            // All other node_modules into a common vendor chunk
            return 'vendor'
          }
        },

        // Consistent naming for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Sourcemaps: false in production = faster builds
    sourcemap: false,

    // Empty dist before build
    emptyOutDir: true
  },

  // Speed up dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom']
  },

  // Resolve aliases (optional, but helps module resolution speed)
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
