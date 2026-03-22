import {
  isPlaceholderValue,
  isValidHttpUrl,
  previewEnvValue,
} from "@/lib/env/shared";

export interface SupabaseEnvStatus {
  urlOk: boolean;
  keyOk: boolean;
  urlPreview: string;
  keyPreview: string;
}

function getRawSupabaseEnv() {
  return {
    url: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim(),
    key: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  };
}

export function getSupabaseEnvStatus(): SupabaseEnvStatus {
  const { url, key } = getRawSupabaseEnv();

  const urlOk =
    isValidHttpUrl(url) &&
    url.includes(".supabase.co") &&
    !isPlaceholderValue(url);

  const keyOk =
    key.length > 100 &&
    !isPlaceholderValue(key);

  return {
    urlOk,
    keyOk,
    urlPreview: previewEnvValue(url, 40),
    keyPreview: previewEnvValue(key, 12),
  };
}

export function hasSupabaseEnv(): boolean {
  const { urlOk, keyOk } = getSupabaseEnvStatus();
  return urlOk && keyOk;
}

export function getSupabaseEnv(): { url: string; key: string } {
  const { url, key } = getRawSupabaseEnv();
  const status = getSupabaseEnvStatus();

  if (!status.urlOk || !status.keyOk) {
    const errors: string[] = [];

    if (!status.urlOk) {
      errors.push(
        `NEXT_PUBLIC_SUPABASE_URL invalide : "${status.urlPreview}"\n` +
          `  → Attendu : https://<project-ref>.supabase.co`
      );
    }

    if (!status.keyOk) {
      errors.push(
        `NEXT_PUBLIC_SUPABASE_ANON_KEY invalide : "${status.keyPreview}"\n` +
          `  → Attendu : JWT complet (~200 chars)`
      );
    }

    const error = new Error(
      `[Supabase] Configuration manquante ou invalide :\n\n${errors.join("\n\n")}`
    );
    error.name = "SupabaseConfigError";
    throw error;
  }

  return { url, key };
}
