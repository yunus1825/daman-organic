import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Daman Organic",
        short_name: "Daman",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone", // 👈 important
        start_url: "/", // 👈 important
        icons: [
          {
            src: "/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      includeAssets: [
        "icon-192x192.png", // 180x180 is the default iOS icon
      ],
    }),
  ],
});
