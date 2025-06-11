import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smart Pantry - Intelligent Food Management & Recipe Discovery",
    short_name: "Smart Pantry",
    description:
      "Reduce food waste by 40% with smart inventory tracking, expiry alerts, and personalized recipe recommendations. Transform your kitchen into an organized, sustainable cooking space.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["food", "lifestyle", "utilities", "productivity"],
    screenshots: [
      {
        src: "/screenshots/dashboard-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Smart Pantry Dashboard - Wide View",
      },
      {
        src: "/screenshots/dashboard-narrow.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Smart Pantry Dashboard - Mobile View",
      },
    ],
    shortcuts: [
      {
        name: "Scan Item",
        short_name: "Scan",
        description: "Quickly scan barcode to add items to your pantry",
        url: "/scan",
        icons: [{ src: "/icons/scan-icon.png", sizes: "96x96" }],
      },
      {
        name: "View Recipes",
        short_name: "Recipes",
        description: "Browse personalized recipe recommendations",
        url: "/recipes",
        icons: [{ src: "/icons/recipe-icon.png", sizes: "96x96" }],
      },
      {
        name: "Shopping List",
        short_name: "Shopping",
        description: "View and manage your smart shopping list",
        url: "/shopping",
        icons: [{ src: "/icons/shopping-icon.png", sizes: "96x96" }],
      },
      {
        name: "Inventory",
        short_name: "Inventory",
        description: "Check your complete food inventory",
        url: "/inventory",
        icons: [{ src: "/icons/inventory-icon.png", sizes: "96x96" }],
      },
    ],
  };
}
