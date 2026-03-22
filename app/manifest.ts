import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${PROFILE.fullName} Portfolio`,
    short_name: "Issa Portfolio",
    description: "Portfolio IA & Data avec mode CV et mode Dev.",
    start_url: "/",
    display: "standalone",
    background_color: "#050810",
    theme_color: "#0C1F3C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
