"use client";

// Hero CV Mode : présentation principale avec badge de disponibilité dynamique
// Le badge est piloté par portfolio_settings (Supabase) via les props

import { motion, type Variants } from "framer-motion";
import type { Lang } from "@/hooks/useLang";
import type { PortfolioSettings } from "@/lib/settings";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import { formatAvailableDate } from "@/lib/date";

interface HeroCVProps {
  t: (key: string) => string;
  lang: Lang;
  onSwitchToDev: () => void;
  settings: PortfolioSettings;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Helpers badge ────────────────────────────────────────────────────────────

function getBadgeText(
  settings: PortfolioSettings,
  lang: Lang,
  t: (key: string) => string
): string {
  const contract = t(
    `status.contract.${settings.contract_type.toLowerCase()}`
  );

  if (settings.status === "NOT_LOOKING") {
    return t("status.not_looking");
  }

  if (settings.status === "SOON") {
    if (settings.available_from) {
      const dateStr = formatAvailableDate(settings.available_from, lang);
      return lang === "fr"
        ? `${contract} dès ${dateStr}`
        : `${contract} from ${dateStr}`;
    }
    return lang === "fr"
      ? `${contract} — Bientôt disponible`
      : `${contract} — Coming soon`;
  }

  // OPEN
  return lang === "fr"
    ? `${contract} — Disponible maintenant`
    : `${contract} — Available now`;
}

function getBadgeDotClass(status: PortfolioSettings["status"]): string {
  if (status === "OPEN") return "bg-green-500 animate-pulse";
  if (status === "SOON") return "bg-yellow-500 animate-pulse";
  return "bg-gray-500";
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function HeroCV({
  t,
  lang,
  onSwitchToDev,
  settings,
}: HeroCVProps) {
  const badgeText = getBadgeText(settings, lang, t);
  const dotClass = getBadgeDotClass(settings.status);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-14">
      <motion.div
        className="max-w-3xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Photo de profil */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <ProfileAvatar size={112} priority className="ring-2 ring-cv-accent/20" />
        </motion.div>

        {/* Badge disponibilité dynamique */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cv-accent/30 text-cv-accent text-xs font-medium tracking-wide">
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {badgeText}
          </span>

          {/* Note optionnelle sous le badge */}
          {(lang === "fr" ? settings.note_fr : settings.note_en) && (
            <p className="text-cv-muted text-xs mt-2">
              {lang === "fr" ? settings.note_fr : settings.note_en}
            </p>
          )}
        </motion.div>

        {/* Prénom + Nom */}
        <motion.div variants={itemVariants}>
          <p className="text-cv-muted text-sm mb-2 tracking-widest uppercase">
            {t("hero.greeting")}
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-cv-text tracking-tight leading-none mb-6">
            Issa <span className="text-cv-accent">KANE</span>
          </h1>
        </motion.div>

        {/* Phrase signature */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-cv-text font-medium leading-relaxed mb-4 max-w-xl mx-auto"
        >
          {t("hero.signature")}
        </motion.p>

        {/* Sous-titre */}
        <motion.p
          variants={itemVariants}
          className="text-cv-muted text-base mb-10"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs — le CTA contact est conditionnel */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#parcours"
            className="px-8 py-3 bg-cv-accent text-white rounded-lg font-medium text-sm hover:bg-cv-accent-light transition-colors w-full sm:w-auto text-center"
          >
            {t("hero.cta_parcours")}
          </a>

          {settings.show_contact_cta && (
            <a
              href="#contact"
              className="px-8 py-3 border border-cv-border text-cv-text rounded-lg font-medium text-sm hover:border-cv-accent hover:text-cv-accent transition-colors w-full sm:w-auto text-center"
            >
              {t("hero.cta_contact")}
            </a>
          )}

          <button
            onClick={onSwitchToDev}
            className="px-8 py-3 border border-cv-accent/30 text-cv-accent rounded-lg font-mono font-medium text-sm hover:border-cv-accent transition-colors w-full sm:w-auto"
          >
            {t("hero.cta_dev")}
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-col items-center gap-2 text-cv-muted"
        >
          <span className="text-xs tracking-widest uppercase">
            {t("hero.scroll")}
          </span>
          <motion.div
            className="w-px h-8 bg-cv-border"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
