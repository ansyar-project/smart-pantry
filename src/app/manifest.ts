import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smart Pantry & Recipe Orchestrator",
    short_name: "Smart Pantry",
    description:
      "Track pantry inventory, prevent food waste, and get personalized recipe recommendations",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
    categories: ["food", "lifestyle", "utilities"],
    shortcuts: [
      {
        name: "Scan Item",
        short_name: "Scan",
        description: "Scan barcode to add item",
        url: "/scan",
        icons: [{ src: "/icons/scan-icon.png", sizes: "96x96" }],
      },
      {
        name: "View Recipes",
        short_name: "Recipes",
        description: "Browse available recipes",
        url: "/recipes",
        icons: [{ src: "/icons/recipe-icon.png", sizes: "96x96" }],
      },
      {
        name: "Shopping List",
        short_name: "Shopping",
        description: "View shopping list",
        url: "/shopping",
        icons: [{ src: "/icons/shopping-icon.png", sizes: "96x96" }],
      },
    ],
  };
}
