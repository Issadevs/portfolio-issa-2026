// app/auth/callback/route.ts — échange le code PKCE du magic link contre une session
// Supabase redirige ici après le clic sur le lien email

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { hasSupabaseServerConfig } from "@/lib/env/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/admin";
  // Rejeter toute valeur qui n'est pas un chemin interne (évite open redirect)
  const next = /^\/[\w/-]*$/.test(rawNext) ? rawNext : "/admin";

  if (!hasSupabaseServerConfig()) {
    return NextResponse.redirect(
      new URL("/admin?error=supabase_unavailable", req.url)
    );
  }

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, req.url));
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  return NextResponse.redirect(
    new URL("/admin?error=auth_failed", req.url)
  );
}
