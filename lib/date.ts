import type { Lang } from "@/hooks/useLang";

export function formatAvailableDate(
  dateStr: string,
  lang: Lang,
  month: "long" | "short" = "long"
): string {
  // ISO format pour forcer UTC et éviter les décalages de timezone
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    month,
    year: "numeric",
  });
}
