import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "ECB-Carlo",
        short_name: "ECB-Carlo",
        description: "Professional sheet metal ordering system for joinery",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/", // bien pour toutes les pages
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // temporaire
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          // API
          {
            urlPattern: /^https:\/\/ecb-carlo\.app\/api\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 min
              },
            },
          },
          // Login et Register → jamais en cache
          {
            urlPattern: /^https:\/\/ecb-carlo\.app\/login$/,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/ecb-carlo\.app\/register$/,
            handler: "NetworkOnly",
          },
          // Pages HTML → NetworkFirst (SPA)
          {
            urlPattern: /^https:\/\/ecb-carlo\.app\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 jour
              },
            },
          },
          // Assets JS/CSS/Images
          {
            urlPattern: /\.(?:js|css|png|svg|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
              },
            },
          },
        ],
      },
    }),
    // visualizer({ open: true }), // génère un rapport interactif
  ],

  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
