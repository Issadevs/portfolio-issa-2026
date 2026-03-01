// lib/supabase/browser.ts — client Supabase côté navigateur
// Utiliser uniquement dans les composants "use client"
// La clé anon est publique par design (sécurité = RLS côté Supabase)

import { createBrowserClient } from "@supabase/ssr";

// ─── Validation env vars ──────────────────────────────────────────────────────
// Appelée AVANT de créer le client — donne un message actionnable si config KO

export interface SupabaseEnvStatus {
  urlOk: boolean;
  keyOk: boolean;
  urlPreview: string; // premiers chars, jamais la clé complète
  keyPreview: string;
}

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const urlOk =
    url.length > 0 &&
    /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url) &&
    !url.includes("xxxx") &&
    !url.includes("...");

  const keyOk =
    key.length > 100 &&          // un JWT Supabase fait ~200+ chars
    !key.endsWith("...") &&
    !key.includes("xxxx");

  return {
    urlOk,
    keyOk,
    urlPreview: url ? `${url.slice(0, 40)}${url.length > 40 ? "…" : ""}` : "(non définie)",
    keyPreview: key ? `${key.slice(0, 12)}…` : "(non définie)",
  };
}

function assertSupabaseConfig(): { url: string; key: string } {
  const { urlOk, keyOk, urlPreview, keyPreview } = getSupabaseEnvStatus();
  const errors: string[] = [];

  if (!urlOk) {
    errors.push(
      `NEXT_PUBLIC_SUPABASE_URL invalide : "${urlPreview}"\n` +
      `  → Attendu : https://<project-ref>.supabase.co\n` +
      `  → Supabase Dashboard → Project Settings → API → Project URL`
    );
  }

  if (!keyOk) {
    errors.push(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY invalide : "${keyPreview}"\n` +
      `  → Attendu : JWT complet (~200 chars)\n` +
      `  → Supabase Dashboard → Project Settings → API → anon public`
    );
  }

  if (errors.length > 0) {
    const msg =
      `[Supabase] Configuration manquante ou invalide dans .env.local :\n\n` +
      errors.join("\n\n");
    console.error(msg);
    const err = new Error(msg);
    err.name = "SupabaseConfigError";
    throw err;
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

// ─── Client ───────────────────────────────────────────────────────────────────

export function createBrowserSupabase() {
  const { url, key } = assertSupabaseConfig();
  return createBrowserClient(url, key);
}
