// lib/supabase/browser.ts — client Supabase côté navigateur
// Utiliser uniquement dans les composants "use client"
// La clé anon est publique par design (sécurité = RLS côté Supabase)

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, getSupabaseEnvStatus } from "@/lib/env/public";

// ─── Client ───────────────────────────────────────────────────────────────────

export function createBrowserSupabase() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}

export { getSupabaseEnvStatus };
