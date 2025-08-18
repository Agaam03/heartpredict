import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2025-08-18T09:07:20.696Z");

  return [
    {
      url: "https://www.heartpredict.online/opengraph-image.png",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/new-password",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/new-verification",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/register",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/reset",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/error",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: "https://www.heartpredict.online/login",
      lastModified,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
