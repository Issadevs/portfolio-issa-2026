import type { MetadataRoute } from "next";
import { getOptionalSiteUrl } from "@/lib/env/server";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getOptionalSiteUrl() ?? new URL("http://localhost:3000");
  const now = new Date();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/cv", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
