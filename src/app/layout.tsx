import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "Smart Pantry",
    template: "%s | Smart Pantry",
  },
  description:
    "Track pantry inventory, prevent food waste, and get personalized recipe recommendations based on available ingredients.",
  keywords: [
    "pantry",
    "inventory",
    "recipes",
    "food waste",
    "meal planning",
    "barcode scanner",
  ],
  authors: [{ name: "Smart Pantry Team" }],
  creator: "Smart Pantry",
  publisher: "Smart Pantry",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Smart Pantry & Recipe Orchestrator",
    description:
      "Track pantry inventory, prevent food waste, and get personalized recipe recommendations",
    siteName: "Smart Pantry",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Pantry - Intelligent Food Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Pantry & Recipe Orchestrator",
    description:
      "Track pantry inventory, prevent food waste, and get personalized recipe recommendations",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
