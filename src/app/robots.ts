import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth/signin", "/auth/error", "/auth/verify-request"],
        disallow: [
          "/dashboard/*",
          "/inventory/*",
          "/recipes/*",
          "/shopping/*",
          "/scan/*",
          "/api/*",
          "/auth/callback/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/auth/signin"],
        disallow: [
          "/dashboard/*",
          "/inventory/*",
          "/recipes/*",
          "/shopping/*",
          "/scan/*",
          "/api/*",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
