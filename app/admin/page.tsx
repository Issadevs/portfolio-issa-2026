// app/admin/page.tsx — Route admin protégée (Server Component)
// Auth vérifiée côté serveur via cookies Supabase
// Accès : uniquement issa.kane@efrei.net

import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import AdminForm from "./AdminForm";
import type { PortfolioSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS, PORTFOLIO_SETTINGS_ID } from "@/lib/settings";
import { hasSupabaseServerConfig } from "@/lib/env/server";
import { IS_DEV } from "@/lib/env/shared";
import { PROFILE } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Admin — Issa KANE",
  robots: { index: false, follow: false },
};

// Forcer le rendu dynamique (auth via cookies)
export const dynamic = "force-dynamic";

const ALLOWED_EMAIL = PROFILE.adminEmail;

interface AdminPageProps {
  searchParams?: Promise<{
    error?: string | string[];
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;

  if (!hasSupabaseServerConfig()) {
    return (
      <LoginForm
        error={
          errorParam === "auth_failed"
            ? "Lien invalide ou expiré. Réessayez."
            : errorParam === "supabase_unavailable"
              ? "Supabase n'est pas configuré pour cet environnement."
              : IS_DEV
                ? "Supabase n'est pas configuré. Renseigne les variables NEXT_PUBLIC_SUPABASE_* en développement."
                : "Espace admin indisponible sur cet environnement."
        }
      />
    );
  }

  const supabase = await createServerSupabase();

  // Vérification de la session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pas connecté → formulaire de login
  if (!user) {
    return (
      <LoginForm
        error={
          errorParam === "auth_failed"
            ? "Lien invalide ou expiré. Réessayez."
            : undefined
        }
      />
    );
  }

  // Connecté mais mauvais email → accès refusé
  if (user.email !== ALLOWED_EMAIL) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-mono text-red-400 text-sm mb-2">{"// 403 FORBIDDEN"}</p>
          <h1 className="text-white font-mono text-xl mb-4">Accès non autorisé</h1>
          <p className="text-gray-500 font-mono text-sm">
            Compte : <span className="text-gray-300">{user.email}</span>
          </p>
          <p className="text-gray-600 font-mono text-xs mt-2">
            Seul {ALLOWED_EMAIL} peut accéder à cette page.
          </p>
        </div>
      </main>
    );
  }

  // Fetch settings fraîches pour l'admin (bypass cache)
  // maybeSingle() : pas d'erreur si la table est vide (table neuve / pas de seed)
  let settings: PortfolioSettings = DEFAULT_SETTINGS;
  try {
    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("*")
      .eq("id", PORTFOLIO_SETTINGS_ID)
      .maybeSingle();

    if (error) {
      console.error("[admin/page] Erreur lecture settings:", error.message);
    } else if (data) {
      settings = data as PortfolioSettings;
    }
    // data === null → table vide → DEFAULT_SETTINGS → le premier "Save" fera l'INSERT
  } catch {
    // DB indisponible — formulaire affiché avec les valeurs par défaut
  }

  return <AdminForm initialSettings={settings} userEmail={user.email!} />;
}
