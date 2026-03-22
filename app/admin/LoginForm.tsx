"use client";

// Formulaire de connexion magic link — /admin

import { useState } from "react";
import { createBrowserSupabase, getSupabaseEnvStatus } from "@/lib/supabase/browser";
import { IS_DEV } from "@/lib/env/shared";
import { PROFILE } from "@/lib/profile";

interface LoginFormProps {
  error?: string;
}

const ADMIN_EMAIL = PROFILE.adminEmail;
const ADMIN_REDIRECT_PATH = "/auth/callback?next=/admin";

export default function LoginForm({ error }: LoginFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState(error ?? "");

  // Évalué une seule fois au rendu (client-side, NEXT_PUBLIC vars disponibles)
  const envStatus = getSupabaseEnvStatus();
  const configOk = envStatus.urlOk && envStatus.keyOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const supabase = createBrowserSupabase(); // throw si config invalide

      const { error: sbError } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}${ADMIN_REDIRECT_PATH}`,
          // shouldCreateUser: true — crée l'utilisateur s'il n'existe pas encore
          // La protection est assurée côté serveur (vérification email dans actions.ts)
          shouldCreateUser: true,
        },
      });

      if (sbError) {
        // Erreur retournée par Supabase (ex: rate limit, email invalide)
        setErrorMsg(sbError.message);
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "SupabaseConfigError") {
        // Env vars manquantes ou invalides — message détaillé en dev
        setErrorMsg(
          IS_DEV
            ? `Configuration Supabase invalide.\nVérifiez le panneau de debug ci-dessous.`
            : "Erreur de configuration serveur. Contactez l'administrateur."
        );
      } else if (
        err instanceof Error &&
        err.message.toLowerCase().includes("failed to fetch")
      ) {
        setErrorMsg(
          "Impossible de joindre Supabase (ERR_NAME_NOT_RESOLVED).\n" +
          "Vérifiez NEXT_PUBLIC_SUPABASE_URL dans votre .env.local."
        );
      } else {
        setErrorMsg(
          err instanceof Error ? err.message : "Erreur inattendue. Rechargez la page."
        );
      }
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[#00FF88] text-xs mb-1">
            {"// admin.access"}
          </p>
          <h1 className="text-2xl font-bold text-white font-mono">
            Portfolio Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            Accès restreint à {ADMIN_EMAIL}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email affiché (non éditable) */}
          <div>
            <label className="block text-gray-400 text-xs font-mono mb-1.5">
              Email
            </label>
            <div className="w-full px-3 py-2.5 bg-[#111117] border border-[#1e1e2e] rounded-lg text-gray-300 font-mono text-sm">
              {ADMIN_EMAIL}
            </div>
          </div>

          {/* Feedback erreur */}
          {(status === "error" || errorMsg) && (
            <pre className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 whitespace-pre-wrap break-words">
              {errorMsg || "Erreur d'authentification."}
            </pre>
          )}

          {!configOk && !IS_DEV && !errorMsg && (
            <p className="text-yellow-300 text-xs font-mono bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
              Configuration Supabase absente sur cet environnement. Connexion admin désactivée.
            </p>
          )}

          {/* Feedback succès */}
          {status === "sent" ? (
            <div className="bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-lg px-4 py-4 text-center">
              <p className="text-[#00FF88] font-mono text-sm">
                ✓ Magic link envoyé
              </p>
              <p className="text-gray-500 text-xs mt-1 font-mono">
                Vérifie ta boîte mail {ADMIN_EMAIL} et clique sur le lien.
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={status === "sending" || !configOk}
              className="w-full py-3 bg-[#00FF88] text-black rounded-lg text-sm font-mono font-bold hover:bg-[#00e07a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "sending"
                ? "Envoi en cours..."
                : "Envoyer le magic link"}
            </button>
          )}
        </form>

        {/* ─── Debug panel (DEV uniquement) ─────────────────────────────────── */}
        {IS_DEV && envStatus && (
          <div className="mt-6 p-4 bg-[#0f0f1a] border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-xs font-mono mb-3">
              {"// debug — env vars (visible en DEV uniquement)"}
            </p>
            <div className="space-y-2">
              <EnvRow
                name="NEXT_PUBLIC_SUPABASE_URL"
                ok={envStatus.urlOk}
                value={envStatus.urlPreview}
              />
              <EnvRow
                name="NEXT_PUBLIC_SUPABASE_ANON_KEY"
                ok={envStatus.keyOk}
                value={envStatus.keyPreview}
              />
            </div>

            {(!envStatus.urlOk || !envStatus.keyOk) && (
              <div className="mt-3 pt-3 border-t border-yellow-500/10">
                <p className="text-yellow-300 text-xs font-mono">
                  → Ouvre <span className="text-white">.env.local</span> et remplace les placeholders par tes vraies clés Supabase.
                </p>
                <p className="text-gray-500 text-xs font-mono mt-1">
                  Supabase Dashboard → Project Settings → API
                </p>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-yellow-500/10">
              <p className="text-gray-500 text-xs font-mono">
                redirectTo:{" "}
                <span className="text-gray-300">{ADMIN_REDIRECT_PATH}</span>
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 text-gray-600 text-xs font-mono text-center">
          {"// Ce panneau n'est pas indexé"}
        </p>
      </div>
    </main>
  );
}

function EnvRow({
  name,
  ok,
  value,
}: {
  name: string;
  ok: boolean;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className={`text-xs font-mono flex-shrink-0 ${ok ? "text-[#00FF88]" : "text-red-400"}`}>
        {ok ? "✓" : "✗"}
      </span>
      <div className="min-w-0">
        <p className="text-gray-300 text-xs font-mono">{name}</p>
        <p className={`text-xs font-mono truncate ${ok ? "text-gray-500" : "text-red-300"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
