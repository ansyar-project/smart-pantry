import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    "/": ["./src/components/**/*", "./src/lib/**/*"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add alias for better module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "./src",
      "@/lib": "./src/lib",
      "@/components": "./src/components",
      "@/app": "./src/app",
    };
    return config;
  },
};

export default nextConfig;
