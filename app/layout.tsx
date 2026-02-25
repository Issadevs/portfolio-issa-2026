import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter : variable font officielle Google — élégance typographique pour CV Mode
// JetBrains Mono remplacé par system monospace côté CSS pour éviter le chargement supplémentaire
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Issa KANE — Ingénieur IA & Data | EFREI Paris",
  description:
    "Portfolio de Issa KANE, ingénieur IA & Data, alternant dès février 2026. EFREI Paris Master 1. Kafka, Elasticsearch, ML, Next.js.",
  keywords: ["IA", "Data", "Machine Learning", "Alternance", "EFREI", "Issa KANE", "SFR", "Kafka"],
  authors: [{ name: "Issa KANE", url: "https://github.com/issadevs" }],
  openGraph: {
    title: "Issa KANE — Ingénieur IA & Data",
    description: "J'transforme des données brutes en systèmes intelligents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="fr" par défaut — mis à jour côté client selon la langue choisie
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
