"use client";

// Header partagé CV + Dev : logo, navigation, toggles langue et mode
// Choix : position fixed avec blur backdrop pour lisibilité sur les deux backgrounds

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { Mode } from "@/hooks/useMode";
import type { Lang } from "@/hooks/useLang";

interface HeaderProps {
  mode: Mode;
  lang: Lang;
  t: (key: string) => string;
  onToggleMode: () => void;
  onToggleLang: () => void;
  isGlitching: boolean;
  /** Préfixe de chemin pour les liens nav (ex: "/" depuis /cv) */
  basePath?: string;
}

export default function Header({
  mode,
  lang,
  t,
  onToggleMode,
  onToggleLang,
  isGlitching,
  basePath,
}: HeaderProps) {
  const isDev = mode === "dev";
  const pathname = usePathname();
  const isOnCvPage = pathname === "/cv";

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isDev
          ? "border-b border-dev-border bg-dev-bg/80"
          : "border-b border-cv-border bg-cv-bg/80"
      } backdrop-blur-md`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo / identité */}
        <motion.a
          href={basePath ?? "#"}
          className={`font-mono text-sm font-semibold tracking-tight transition-colors ${
            isDev ? "text-dev-accent" : "text-cv-accent"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {isDev ? (
            <span className="flex items-center gap-1.5">
              <span className="opacity-60">{">"}</span>
              <span>issa.kane</span>
              <span className="opacity-60 animate-pulse">_</span>
            </span>
          ) : (
            "IK"
          )}
        </motion.a>

        {/* Navigation centrale — CV Mode seulement */}
        {!isDev && (
          <nav className="hidden sm:flex items-center gap-6">
            {["parcours", "projets", "contact"].map((section) => (
              <a
                key={section}
                href={`${basePath ?? ""}#${section}`}
                className="text-sm text-cv-muted hover:text-cv-text transition-colors"
              >
                {t(`nav.${section}`)}
              </a>
            ))}
            <a
              href="/cv"
              className={`text-sm transition-colors flex items-center gap-1.5 ${
                isOnCvPage
                  ? "text-cv-accent font-medium"
                  : "text-cv-muted hover:text-cv-text"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              CV
            </a>
          </nav>
        )}

        {/* Contrôles droite : langue + switch mode */}
        <div className="flex items-center gap-3">
          {/* Toggle langue FR/EN */}
          <motion.button
            onClick={onToggleLang}
            className={`font-mono text-xs px-2 py-1 rounded border transition-all ${
              isDev
                ? "border-dev-border text-dev-muted hover:text-dev-accent hover:border-dev-accent"
                : "border-cv-border text-cv-muted hover:text-cv-accent hover:border-cv-accent"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${lang === "fr" ? "English" : "Français"}`}
          >
            {lang === "fr" ? "EN" : "FR"}
          </motion.button>

          {/* Switch mode CV/Dev */}
          <motion.button
            onClick={onToggleMode}
            disabled={isGlitching}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition-all ${
              isDev
                ? "border-dev-accent text-dev-accent hover:bg-dev-accent hover:text-dev-bg"
                : "border-cv-accent text-cv-accent hover:bg-cv-accent hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={!isGlitching ? { scale: 1.05 } : {}}
            whileTap={!isGlitching ? { scale: 0.95 } : {}}
          >
            {isDev ? "⬡ HR Mode" : "< Dev Mode >"}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
