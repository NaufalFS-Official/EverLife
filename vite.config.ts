import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/EverLife/' : './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'placeholder-icon-*.svg'],
      manifest: {
        name: 'EverLife: Simulasi Kehidupan Masa Sekolah',
        short_name: 'EverLife',
        description: 'Simulasi kehidupan realistis dari lahir hingga tamat SMA di Indonesia.',
        theme_color: '#0A2540',
        background_color: '#F5F7FB',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'placeholder-icon-heart.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'placeholder-icon-book.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'everlife-static-cache-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari offline cache
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
});
