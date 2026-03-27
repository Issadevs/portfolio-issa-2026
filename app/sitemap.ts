import type { MetadataRoute } from "next";
import { getOptionalSiteUrl } from "@/lib/env/server";

// Date du dernier déploiement significatif (mise à jour manuelle à chaque release)
const LAST_UPDATED = new Date("2026-03-27");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    getOptionalSiteUrl() ?? new URL("https://issatech.vercel.app");

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: LAST_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/cv", siteUrl).toString(),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
