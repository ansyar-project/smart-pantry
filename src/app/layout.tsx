import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { ScanFAB } from "@/components/navigation/ScanFAB";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Pantry - Intelligent Food Management & Recipe Discovery",
    template: "%s | Smart Pantry - Reduce Food Waste & Find Recipes",
  },
  description:
    "Smart Pantry helps you track food inventory, reduce food waste by 40%, and discover personalized recipes based on available ingredients. Barcode scanning, expiry alerts, and meal planning made simple.",
  keywords: [
    "smart pantry",
    "food inventory management",
    "reduce food waste",
    "recipe recommendations",
    "meal planning app",
    "barcode scanner",
    "grocery tracker",
    "kitchen organization",
    "ingredient-based recipes",
    "food expiry alerts",
    "pantry organizer",
    "sustainable cooking",
    "household food management",
    "digital pantry",
    "recipe discovery",
  ],
  authors: [{ name: "Smart Pantry Team", url: "https://smart-pantry.app" }],
  creator: "Smart Pantry",
  publisher: "Smart Pantry",
  category: "Food & Drink",
  classification: "Food Management Application",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Smart Pantry - Intelligent Food Management & Recipe Discovery",
    description:
      "Reduce food waste by 40% with smart inventory tracking, expiry alerts, and personalized recipe recommendations. Transform your kitchen into an organized, sustainable cooking space.",
    siteName: "Smart Pantry",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Pantry - Intelligent Food Management Dashboard showing inventory tracking and recipe recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SmartPantryApp",
    creator: "@SmartPantryApp",
    title: "Smart Pantry - Intelligent Food Management & Recipe Discovery",
    description:
      "Reduce food waste by 40% with smart inventory tracking, expiry alerts, and personalized recipe recommendations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#3b82f6",
    "msapplication-TileColor": "#3b82f6",
    "application-name": "Smart Pantry",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Smart Pantry",
    description: "Intelligent food management and recipe discovery application",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    applicationCategory: "Food & Drink",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Smart Pantry Team",
    },
    featureList: [
      "Food inventory tracking",
      "Barcode scanning",
      "Recipe recommendations",
      "Food waste reduction",
      "Expiry alerts",
      "Meal planning",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-background">
            <MainNavigation />
            <main className="pb-20 md:pb-6">{children}</main>
            <ScanFAB />
            <BottomNavigation />
          </div>
        </Providers>
      </body>
    </html>
  );
}
