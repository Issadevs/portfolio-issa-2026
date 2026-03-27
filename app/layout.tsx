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
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getOptionalSiteUrl();
const analyticsEnabled = isAnalyticsEnabled();
const speedInsightsEnabled = isSpeedInsightsEnabled();

const description =
  `Portfolio de ${PROFILE.fullName}, Ingénieur IA & Data, Master 1 EFREI Paris. ` +
  `Alternance 2026. Spécialisé Kafka, Elasticsearch, Python, Machine Learning, CNN, TensorFlow. ` +
  `Disponible Paris / Remote.`;

const ogDescription =
  `Ingénieur IA & Data · Master 1 EFREI Paris · Alternance 2026. ` +
  `Projets : pipeline ML SFR production, diagnostic tumeurs cérébrales par IRM, app mobile React Native. ` +
  `Spécialiste Kafka, Elasticsearch, Python.`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: `${PROFILE.fullName} | ${PROFILE.role.fr} | EFREI Paris`,
  description,
  keywords: [
    "Issa KANE", "Ingénieur IA", "Data Engineer", "Machine Learning", "Deep Learning",
    "CNN", "TensorFlow", "Python", "Kafka", "Elasticsearch", "Alternance 2026",
    "EFREI Paris", "MLOps", "Big Data", "Next.js", "SFR", "Paris", "Remote",
    "Portfolio ingénieur", "Master IA Data",
  ],
  authors: [{ name: PROFILE.fullName, url: PROFILE.githubUrl }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    title: `${PROFILE.fullName} | ${PROFILE.role.fr}`,
    description: ogDescription,
    type: "website",
    url: siteUrl,
    locale: "fr_FR",
    alternateLocale: "en_US",
    siteName: `${PROFILE.fullName} — Portfolio`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${PROFILE.fullName} — Ingénieur IA & Data`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.fullName} | ${PROFILE.role.fr}`,
    description: ogDescription,
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl?.origin ?? ""}/#person`,
      name: PROFILE.fullName,
      givenName: PROFILE.firstName,
      familyName: PROFILE.lastName,
      email: PROFILE.email,
      telephone: PROFILE.phoneIntl,
      url: siteUrl?.origin,
      sameAs: [PROFILE.githubUrl, PROFILE.linkedInUrl],
      jobTitle: PROFILE.role.fr,
      description:
        "Ingénieur IA & Data, Master 1 EFREI Paris. Spécialiste pipelines Kafka/Elasticsearch et Machine Learning.",
      knowsAbout: [
        "Machine Learning", "Deep Learning", "Data Engineering",
        "Apache Kafka", "Elasticsearch", "Python", "TensorFlow",
        "CNN", "NLP", "React Native", "Next.js",
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "EFREI Paris",
        url: "https://www.efrei.fr",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl?.origin ?? ""}/#website`,
      url: siteUrl?.origin,
      name: `${PROFILE.fullName} — Portfolio`,
      description,
      author: { "@id": `${siteUrl?.origin ?? ""}/#person` },
      inLanguage: ["fr-FR", "en-US"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        <script // nosemgrep: dangerous-inner-html-dynamic
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {analyticsEnabled ? <Analytics /> : null}
        {speedInsightsEnabled ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
