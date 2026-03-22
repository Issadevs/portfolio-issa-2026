"use client";

// Hero CV Mode : présentation principale avec badge de disponibilité dynamique
// Le badge est piloté par portfolio_settings (Supabase) via les props

import { motion, type Variants } from "framer-motion";
import type { Lang } from "@/hooks/useLang";
import type { PortfolioSettings } from "@/lib/settings";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import { PROFILE, getAvailabilityLabel } from "@/lib/profile";

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
  const badgeText = getAvailabilityLabel(settings, lang);
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
            {PROFILE.firstName} <span className="text-cv-accent">{PROFILE.lastName}</span>
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

          <a
            href="/cv"
            className="px-8 py-3 border border-cv-border text-cv-text rounded-lg font-medium text-sm hover:border-cv-accent hover:text-cv-accent transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="flex-shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {lang === "fr" ? "Voir le CV" : "View CV"}
          </a>

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
