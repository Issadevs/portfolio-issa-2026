"use server";

// app/admin/actions.ts — Server Actions pour l'admin
// L'email est toujours vérifié côté serveur avant toute écriture
// Stratégie DB : maybeSingle() → INSERT si vide, UPDATE si existe

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { StatusType, ContractType } from "@/lib/settings";

const ALLOWED_EMAIL = "issa.kane@efrei.net";

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
  const supabase = createServerSupabase();

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

  // 4. Vérifier si une ligne existe déjà
  // maybeSingle() : retourne null (pas d'erreur) si aucune ligne — contrairement à single()
  const { data: existing, error: fetchError } = await supabase
    .from("portfolio_settings")
    .select("id")
    .maybeSingle();

  if (fetchError) {
    console.error("[admin/actions] Erreur lecture:", fetchError.message);
    return { error: `Erreur de lecture DB : ${fetchError.message}` };
  }

  // 5. INSERT si table vide, UPDATE si ligne existe
  if (existing) {
    const { error: updateError } = await supabase
      .from("portfolio_settings")
      .update(payload)
      .eq("id", existing.id);

    if (updateError) {
      console.error("[admin/actions] Update error:", updateError.message);
      return { error: `Échec de la mise à jour : ${updateError.message}` };
    }
  } else {
    // Première utilisation : crée la ligne (seed automatique)
    const { error: insertError } = await supabase
      .from("portfolio_settings")
      .insert(payload);

    if (insertError) {
      console.error("[admin/actions] Insert error:", insertError.message);
      // Message actionnable si c'est un problème de RLS
      const hint = insertError.message.includes("row-level security")
        ? " → Vérifiez la policy INSERT dans Supabase (voir SQL fourni)."
        : "";
      return { error: `Échec de la création : ${insertError.message}${hint}` };
    }
  }

  // 6. Invalidation du cache Next.js (homepage + data cache)
  revalidatePath("/");
  revalidateTag("portfolio-settings");

  console.info(
    `[admin/actions] Settings ${existing ? "mis à jour" : "créés"} par ${user.email}`
  );
  return { ok: true };
}

export async function signOut(): Promise<ActionResult> {
  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
