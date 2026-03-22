import { formatAvailableDate } from "@/lib/date";
import type { PortfolioSettings } from "@/lib/settings";

export type AppLang = "fr" | "en";

export const PROFILE = {
  fullName: "Issa KANE",
  firstName: "Issa",
  lastName: "KANE",
  email: "issa.kane@efrei.net",
  adminEmail: "issa.kane@efrei.net",
  phoneLocal: "06 52 52 72 14",
  phoneIntl: "+33 6 52 52 72 14",
  phoneHref: "tel:+33652527214",
  githubUrl: "https://github.com/issadevs",
  githubHandle: "@issadevs",
  githubPath: "github.com/issadevs",
  linkedInUrl: "https://linkedin.com/in/issakane",
  linkedInHandle: "@issakane",
  linkedInPath: "linkedin.com/in/issakane",
  role: {
    fr: "Ingénieur IA & Data",
    en: "AI & Data Engineer",
  },
  cvTagline: {
    fr: "« Transformer la donnée en valeur métier, à grande échelle »",
    en: "« Turning data into business value, at scale »",
  },
  cvFooterLead: {
    fr: "En recherche d'alternance (Master 1 IA&Data · EFREI Paris)",
    en: "Seeking work-study contract (Master 1 AI&Data · EFREI Paris)",
  },
} as const;

function getContractLabel(
  contractType: PortfolioSettings["contract_type"],
  lang: AppLang
): string {
  const labels = {
    CDI: { fr: "CDI", en: "Permanent" },
    ALTERNANCE: { fr: "Alternance", en: "Apprenticeship" },
    STAGE: { fr: "Stage", en: "Internship" },
    FREELANCE: { fr: "Freelance", en: "Freelance" },
  } as const;

  return labels[contractType][lang];
}

export function getAvailabilityLabel(
  settings: PortfolioSettings,
  lang: AppLang
): string {
  if (settings.status === "NOT_LOOKING") {
    return lang === "fr" ? "Pas en recherche" : "Not actively looking";
  }

  const contract = getContractLabel(settings.contract_type, lang);

  if (settings.status === "SOON") {
    if (settings.available_from) {
      const dateLabel = formatAvailableDate(settings.available_from, lang);
      return lang === "fr"
        ? `${contract} dès ${dateLabel}`
        : `${contract} from ${dateLabel}`;
    }

    return lang === "fr"
      ? `${contract} — Bientôt disponible`
      : `${contract} — Coming soon`;
  }

  return lang === "fr"
    ? `${contract} — Disponible maintenant`
    : `${contract} — Available now`;
}

export function getCvFooterText(
  settings: PortfolioSettings,
  lang: AppLang
): string {
  return `${PROFILE.cvFooterLead[lang]} · ${getAvailabilityLabel(settings, lang)}`;
}
