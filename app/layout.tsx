import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Issa KANE | Ingénieur IA & Data | EFREI Paris",
  description:
    "Portfolio de Issa KANE, ingénieur IA & Data, alternant dès février 2026. EFREI Paris Master 1. Kafka, Elasticsearch, ML, Next.js.",
  keywords: ["IA", "Data", "Machine Learning", "Alternance", "EFREI", "Issa KANE", "SFR", "Kafka"],
  authors: [{ name: "Issa KANE", url: "https://github.com/issadevs" }],
  openGraph: {
    title: "Issa KANE | Ingénieur IA & Data",
    description: "Je build des pipelines data et des systèmes ML.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
