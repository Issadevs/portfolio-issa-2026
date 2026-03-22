import type { MetadataRoute } from "next";
import { getOptionalSiteUrl } from "@/lib/env/server";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getOptionalSiteUrl() ?? new URL("http://localhost:3000");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${siteUrl.origin}/sitemap.xml`,
    host: siteUrl.origin,
  };
}
