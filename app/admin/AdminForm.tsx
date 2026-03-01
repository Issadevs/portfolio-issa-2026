"use client";

// Formulaire admin — édition des portfolio settings
// Server Action pour la sauvegarde, vérification email côté serveur

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettings } from "./actions";
import type { PortfolioSettings } from "@/lib/settings";
import { createBrowserSupabase } from "@/lib/supabase/browser";

interface AdminFormProps {
  initialSettings: PortfolioSettings;
  userEmail: string;
}

type Msg = { type: "success" | "error"; text: string } | null;

export default function AdminForm({
  initialSettings,
  userEmail,
}: AdminFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<Msg>(null);

  const showMsg = (m: Msg) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 5000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if ("error" in result) {
        showMsg({ type: "error", text: result.error });
      } else {
        showMsg({ type: "success", text: "✓ Settings sauvegardés et cache invalidé !" });
      }
    });
  };

  const handleSignOut = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[#00FF88] text-xs mb-1">
              {"// portfolio_settings"}
            </p>
            <h1 className="text-2xl font-bold text-white font-mono">
              Portfolio Admin
            </h1>
            <p className="text-gray-500 text-xs font-mono mt-1">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-red-400 transition-colors text-xs font-mono border border-gray-800 hover:border-red-500/30 px-3 py-1.5 rounded-lg"
          >
            Déconnexion
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ─ Statut + Contrat ─ */}
          <Section title="// statut.disponibilité">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Statut">
                <select
                  name="status"
                  defaultValue={initialSettings.status}
                  className="select-field"
                >
                  <option value="OPEN">🟢 OPEN — Disponible maintenant</option>
                  <option value="SOON">🟡 SOON — Bientôt disponible</option>
                  <option value="NOT_LOOKING">⚫ NOT_LOOKING — Pas en recherche</option>
                </select>
              </Field>

              <Field label="Type de contrat">
                <select
                  name="contract_type"
                  defaultValue={initialSettings.contract_type}
                  className="select-field"
                >
                  <option value="CDI">CDI</option>
                  <option value="ALTERNANCE">Alternance</option>
                  <option value="STAGE">Stage</option>
                  <option value="FREELANCE">Freelance</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Disponible à partir du (optionnel)">
                <input
                  type="date"
                  name="available_from"
                  defaultValue={initialSettings.available_from ?? ""}
                  className="input-field"
                />
              </Field>

              <Field label="Localisation">
                <input
                  type="text"
                  name="location"
                  defaultValue={initialSettings.location}
                  placeholder="Paris / Remote"
                  required
                  className="input-field"
                />
              </Field>
            </div>
          </Section>

          {/* ─ Titres ─ */}
          <Section title="// badge.headline">
            <Field label="Titre FR (badge principal)">
              <input
                type="text"
                name="headline_fr"
                defaultValue={initialSettings.headline_fr}
                placeholder="Alternance dès février 2026"
                required
                className="input-field"
              />
            </Field>

            <Field label="Titre EN (badge principal)">
              <input
                type="text"
                name="headline_en"
                defaultValue={initialSettings.headline_en}
                placeholder="Apprenticeship from February 2026"
                required
                className="input-field"
              />
            </Field>
          </Section>

          {/* ─ Notes ─ */}
          <Section title="// note.supplementaire (optionnel)">
            <Field label="Note FR">
              <textarea
                name="note_fr"
                defaultValue={initialSettings.note_fr}
                rows={2}
                placeholder="Message court affiché sous le badge..."
                className="input-field resize-none"
              />
            </Field>

            <Field label="Note EN">
              <textarea
                name="note_en"
                defaultValue={initialSettings.note_en}
                rows={2}
                placeholder="Short message displayed under the badge..."
                className="input-field resize-none"
              />
            </Field>
          </Section>

          {/* ─ CTA Contact ─ */}
          <Section title="// cta.contact">
            <div className="flex items-center gap-3">
              {/* Hidden fallback for unchecked */}
              <input type="hidden" name="show_contact_cta" value="false" />
              <label className="relative flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="show_contact_cta"
                  value="true"
                  defaultChecked={initialSettings.show_contact_cta}
                  className="sr-only peer"
                  onChange={(e) => {
                    // React synthetic — handled by FormData
                    void e;
                  }}
                />
                <div className="w-10 h-5 bg-gray-800 rounded-full peer-checked:bg-[#00FF88]/20 border border-gray-700 peer-checked:border-[#00FF88]/40 transition-all" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-5 peer-checked:bg-[#00FF88] transition-all" />
                <span className="text-gray-300 text-sm font-mono">
                  {'Afficher le bouton "Me contacter" sur le Hero'}
                </span>
              </label>
            </div>
          </Section>

          {/* Feedback */}
          {msg && (
            <div
              className={`px-4 py-3 rounded-lg border font-mono text-sm ${
                msg.type === "success"
                  ? "bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88]"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#00FF88] text-black rounded-lg text-sm font-mono font-bold hover:bg-[#00e07a] transition-colors disabled:opacity-60"
          >
            {isPending ? "Sauvegarde en cours..." : "Sauvegarder et publier"}
          </button>

          <p className="text-gray-600 text-xs font-mono text-center">
            {"// Cache Next.js invalidé immédiatement après sauvegarde"}
          </p>
        </form>
      </div>

      {/* Styles inline pour les champs (pas de pollution globals.css) */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: #111117;
          border: 1px solid #1e1e2e;
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-family: monospace;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus {
          border-color: #00ff8860;
        }
        .select-field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: #111117;
          border: 1px solid #1e1e2e;
          border-radius: 0.5rem;
          color: #e2e8f0;
          font-family: monospace;
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
        }
        .select-field:focus {
          border-color: #00ff8860;
        }
      `}</style>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#111117] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
      <p className="text-[#00FF88] text-xs font-mono opacity-70">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-gray-500 text-xs font-mono mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
