import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages liefert die App unter https://<user>.github.io/snapspot/ aus
  base: '/snapspot/',
  plugins: [
    react(),
    tailwindcss(),
    // Kriterium #2 (Offline) + #3 (Installierbarkeit):
    // generiert Service Worker (Workbox-Precaching) und Web App Manifest
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SnapSpot – Foto-Tagebuch',
        short_name: 'SnapSpot',
        description: 'Fotos aufnehmen, Standort speichern – auch offline.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        lang: 'de',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Neuer SW übernimmt sofort alle offenen Tabs – ohne das wird die App
        // erst nach einem Reload installierbar/aktuell
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            // Kartentiles offline verfügbar halten (für bereits besuchte Ausschnitte)
            urlPattern: /^https:\/\/[abcd]\.basemaps\.cartocdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
