"use server";

// app/admin/actions.ts — Server Actions pour l'admin
// L'email est toujours vérifié côté serveur avant toute écriture
// Stratégie DB : maybeSingle() → INSERT si vide, UPDATE si existe

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  DEFAULT_SETTINGS,
  type StatusType,
  type ContractType,
} from "@/lib/settings";
import { hasSupabaseServerConfig } from "@/lib/env/server";
import { IS_DEV } from "@/lib/env/shared";
import { PROFILE } from "@/lib/profile";

const ALLOWED_EMAIL = PROFILE.adminEmail;

// Rate limit in-memory (reset sur cold start — suffisant pour un seul admin)
const updateRateLimit = new Map<string, { count: number; resetAt: number }>();
const UPDATE_LIMIT = 20;
const UPDATE_WINDOW_MS = 60 * 60 * 1000; // 1h

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = updateRateLimit.get(userId);
  if (!record || now > record.resetAt) {
    updateRateLimit.set(userId, { count: 1, resetAt: now + UPDATE_WINDOW_MS });
    return true;
  }
  if (record.count >= UPDATE_LIMIT) return false;
  record.count++;
  return true;
}

type ActionResult = { ok: true } | { error: string };

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  if (!hasSupabaseServerConfig()) {
    return {
      error: IS_DEV
        ? "Supabase n'est pas configuré pour cet environnement de développement."
        : "Configuration serveur indisponible.",
    };
  }

  const supabase = await createServerSupabase();

  // 1. Vérification auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Non authentifié." };
  if (user.email !== ALLOWED_EMAIL) return { error: "Accès non autorisé." };

  // 2. Rate limit
  if (!checkRateLimit(user.id)) {
    return { error: "Trop de modifications. Réessayez dans 1h." };
  }

  // 3. Extraction + validation des champs
  const status = (formData.get("status") as string)?.trim();
  const contract_type = (formData.get("contract_type") as string)?.trim();
  const available_from = (formData.get("available_from") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const headline_fr = (formData.get("headline_fr") as string)?.trim();
  const headline_en = (formData.get("headline_en") as string)?.trim();
  const note_fr = (formData.get("note_fr") as string)?.trim() ?? "";
  const note_en = (formData.get("note_en") as string)?.trim() ?? "";

  // Checkbox : le hidden input "false" précède le checkbox "true" dans le DOM.
  // formData.get() retourne toujours le premier → faux négatif systématique.
  // formData.getAll() retourne les deux valeurs → on cherche "true" dedans.
  const show_contact_cta = formData.getAll("show_contact_cta").includes("true");

  const VALID_STATUSES: StatusType[] = ["OPEN", "SOON", "NOT_LOOKING"];
  const VALID_CONTRACTS: ContractType[] = ["CDI", "ALTERNANCE", "STAGE", "FREELANCE"];

  if (!VALID_STATUSES.includes(status as StatusType)) {
    return { error: "Statut invalide." };
  }
  if (!VALID_CONTRACTS.includes(contract_type as ContractType)) {
    return { error: "Type de contrat invalide." };
  }
  if (!location || location.length < 2) {
    return { error: "Localisation requise." };
  }
  if (!headline_fr || !headline_en) {
    return { error: "Les titres FR et EN sont requis." };
  }

  // Date optionnelle : format YYYY-MM-DD ou null
  const available_from_value =
    available_from && /^\d{4}-\d{2}-\d{2}$/.test(available_from)
      ? available_from
      : null;

  const payload = {
    status,
    contract_type,
    available_from: available_from_value,
    location,
    headline_fr,
    headline_en,
    note_fr,
    note_en,
    show_contact_cta,
    updated_at: new Date().toISOString(),
  };

  // 4. Upsert singleton : une seule ligne, id fixe = "default"
  // nosemgrep: server-action-upsert-without-auth-comment — auth vérifié lignes 52-56
  const { error: upsertError } = await supabase
    .from("portfolio_settings")
    .upsert(
      {
        id: DEFAULT_SETTINGS.id,
        ...payload,
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    console.error("[admin/actions] Upsert error:", upsertError.message);
    const hint = upsertError.message.includes("row-level security")
      ? " → Vérifiez les policies RLS Supabase versionnées dans supabase/migrations."
      : "";
    return { error: `Échec de la sauvegarde : ${upsertError.message}${hint}` };
  }

  // 5. Invalidation du cache Next.js (homepage + data cache)
  revalidatePath("/");
  revalidatePath("/cv");
  revalidateTag("portfolio-settings", "max");

  console.info(`[admin/actions] Settings sauvegardés par ${user.email}`);
  return { ok: true };
}

export async function signOut(): Promise<ActionResult> {
  if (!hasSupabaseServerConfig()) {
    return {
      error: IS_DEV
        ? "Supabase n'est pas configuré pour cet environnement de développement."
        : "Configuration serveur indisponible.",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
