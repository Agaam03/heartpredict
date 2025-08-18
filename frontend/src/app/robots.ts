// robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Block API routes
          "/private/", // Block private pages
          "/error", // Block error pages
          "/new-password", // Block password reset pages
          "/new-verification", // Block verification pages
          "/reset", // Block reset pages
          "/_next/", // Block Next.js internal files
          "*.json", // Block JSON files
        ],
      },
      // Optional: Block AI crawlers
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User", 
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://www.heartpredict.online/sitemap.xml",
    host: "https://www.heartpredict.online",
  };
}

