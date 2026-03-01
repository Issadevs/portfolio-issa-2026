// lib/supabase/server.ts — client Supabase côté serveur (utilise les cookies Next.js)
// Utiliser uniquement dans : Server Components, Server Actions, Route Handlers

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getServerSupabaseConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || url.includes("xxxx") || !url.startsWith("https://")) {
    throw new Error(
      `[Supabase/server] NEXT_PUBLIC_SUPABASE_URL invalide : "${url.slice(0, 50)}"\n` +
      `Vérifiez votre .env.local (ou les env vars Vercel en prod).`
    );
  }
  if (!key || key.endsWith("...") || key.length < 100) {
    throw new Error(
      `[Supabase/server] NEXT_PUBLIC_SUPABASE_ANON_KEY invalide.\n` +
      `Vérifiez votre .env.local (ou les env vars Vercel en prod).`
    );
  }

  return { url, key };
}

export function createServerSupabase() {
  const { url, key } = getServerSupabaseConfig();
  const cookieStore = cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dans un Server Component en lecture seule — ignoré
          // Les cookies sont mis à jour par les Route Handlers / Server Actions
        }
      },
    },
  });
}
