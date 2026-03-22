// lib/supabase/server.ts — client Supabase côté serveur (utilise les cookies Next.js)
// Utiliser uniquement dans : Server Components, Server Actions, Route Handlers

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseServerConfig } from "@/lib/env/server";

export async function createServerSupabase() {
  const { url, key } = getSupabaseServerConfig();
  const cookieStore = await cookies();

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
