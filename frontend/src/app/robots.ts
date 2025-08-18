import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/error"], // contoh tambahan
    },
    sitemap: "https://www.heartpredict.online/sitemap.xml",
    host: "https://www.heartpredict.online",
  };
}
