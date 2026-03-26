// lib/settings.ts — server-only : ne jamais importer côté client
// Les composants client doivent utiliser `import type { PortfolioSettings }`

import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { portfolioSettings } from "@/lib/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusType = "OPEN" | "SOON" | "NOT_LOOKING";
export type ContractType = "CDI" | "ALTERNANCE" | "STAGE" | "FREELANCE";

export interface PortfolioSettings {
  id: string;
  status: StatusType;
  contract_type: ContractType;
  available_from: string | null; // "YYYY-MM-DD" ou null
  location: string;
  show_contact_cta: boolean;
  headline_fr: string;
  headline_en: string;
  note_fr: string;
  note_en: string;
  updated_at: string;
}

export const DEFAULT_SETTINGS: PortfolioSettings = {
  id: "default",
  status: "OPEN",
  contract_type: "ALTERNANCE",
  available_from: null,
  location: "Paris / Remote",
  show_contact_cta: true,
  headline_fr: "Alternance dès février 2026",
  headline_en: "Apprenticeship from February 2026",
  note_fr: "",
  note_en: "",
  updated_at: new Date().toISOString(),
};

export const PORTFOLIO_SETTINGS_ID = DEFAULT_SETTINGS.id;

// ─── Fetch public (pas de cookies, cacheable en ISR) ─────────────────────────

export const getPortfolioSettings = unstable_cache(
  async (): Promise<PortfolioSettings> => {
    if (!db) {
      console.warn("[settings] DATABASE_URL manquant — fallback defaults");
      return DEFAULT_SETTINGS;
    }

    try {
      const rows = await db
        .select()
        .from(portfolioSettings)
        .where(eq(portfolioSettings.id, PORTFOLIO_SETTINGS_ID))
        .limit(1);

      if (!rows.length) {
        console.warn("[settings] Aucune ligne en DB — fallback defaults");
        return DEFAULT_SETTINGS;
      }

      return rows[0] as PortfolioSettings;
    } catch (err) {
      console.error(
        "[settings] DB error:",
        err instanceof Error ? err.message : "unknown"
      );
      return DEFAULT_SETTINGS;
    }
  },
  ["portfolio-settings"],
  { revalidate: 60, tags: ["portfolio-settings"] }
);
