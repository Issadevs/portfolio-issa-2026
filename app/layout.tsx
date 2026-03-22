import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import {
  getOptionalSiteUrl,
  isAnalyticsEnabled,
  isSpeedInsightsEnabled,
} from "@/lib/env/server";
import { PROFILE } from "@/lib/profile";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getOptionalSiteUrl();
const analyticsEnabled = isAnalyticsEnabled();
const speedInsightsEnabled = isSpeedInsightsEnabled();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: `${PROFILE.fullName} | ${PROFILE.role.fr} | EFREI Paris`,
  description:
    `Portfolio de ${PROFILE.fullName}, ${PROFILE.role.fr.toLowerCase()}, ${DEFAULT_SETTINGS.headline_fr.toLowerCase()}. EFREI Paris Master 1. Kafka, Elasticsearch, ML, Next.js.`,
  keywords: ["IA", "Data", "Machine Learning", "Alternance", "EFREI", PROFILE.fullName, "SFR", "Kafka"],
  authors: [{ name: PROFILE.fullName, url: PROFILE.githubUrl }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${PROFILE.fullName} | ${PROFILE.role.fr}`,
    description: "Je build des pipelines data et des systèmes ML.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${PROFILE.fullName} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.fullName} | ${PROFILE.role.fr}`,
    description: "Je build des pipelines data et des systèmes ML.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        {children}
        {analyticsEnabled ? <Analytics /> : null}
        {speedInsightsEnabled ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
