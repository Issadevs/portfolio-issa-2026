"use client";

// Page principale — orchestration des deux modes CV et Dev
// Choix : tout dans un seul composant client pour partager l'état mode/langue
// Le WebGL background est importé dynamiquement (ssr: false) car Three.js est client-only

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useMode } from "@/hooks/useMode";
import { useLang } from "@/hooks/useLang";
import { useTerminal } from "@/hooks/useTerminal";

// Composants partagés
import Header from "@/components/shared/Header";
import GlitchTransition from "@/components/shared/GlitchTransition";

// Composants CV Mode
import HeroCV from "@/components/cv/HeroCV";
import StoryCV from "@/components/cv/StoryCV";
import ExperienceCV from "@/components/cv/ExperienceCV";
import ProjectsCV from "@/components/cv/ProjectsCV";
import MotivationCV from "@/components/cv/MotivationCV";
import ContactCV from "@/components/cv/ContactCV";

// Composants Dev Mode
import HeroDev from "@/components/dev/HeroDev";
import ProjectsDev from "@/components/dev/ProjectsDev";
import StackDev from "@/components/dev/StackDev";
import GitHubFeed from "@/components/dev/GitHubFeed";
import Terminal from "@/components/dev/Terminal";
import PerfBadge from "@/components/dev/PerfBadge";

// Dynamic import obligatoire pour Three.js (client-only, pas de SSR)
const WebGLBackground = dynamic(
  () => import("@/components/dev/WebGLBackground"),
  { ssr: false, loading: () => null }
);

export default function Portfolio() {
  const { mode, toggleMode, isGlitching } = useMode();
  const { lang, toggleLang, t, isTransitioning } = useLang();
  const terminal = useTerminal(lang);

  const isDev = mode === "dev";

  return (
    <>
      {/* Transition glitch entre modes */}
      <GlitchTransition isActive={isGlitching} targetMode={isDev ? "dev" : "cv"} />

      {/* Background WebGL (Dev Mode uniquement) */}
      {isDev && <WebGLBackground />}

      {/* Grille CSS de fond (Dev Mode) */}
      {isDev && <div className="fixed inset-0 z-[1] dev-grid pointer-events-none" />}

      {/* Header partagé */}
      <Header
        mode={mode}
        lang={lang}
        t={t}
        onToggleMode={toggleMode}
        onToggleLang={toggleLang}
        isGlitching={isGlitching}
      />

      {/* Contenu principal avec fade sur changement de langue */}
      <motion.main
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className={`relative ${isDev ? "z-10" : "z-0"}`}
      >
        <AnimatePresence mode="wait">
          {!isDev ? (
            // ═══════════════════════════════════
            //  CV MODE — Pour les RH
            // ═══════════════════════════════════
            <motion.div
              key="cv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-cv-bg min-h-screen"
            >
              <HeroCV t={t} lang={lang} onSwitchToDev={toggleMode} />
              <StoryCV t={t} />
              <ExperienceCV t={t} />
              <ProjectsCV t={t} />
              <MotivationCV t={t} />
              <ContactCV t={t} />

              {/* Footer CV */}
              <footer className="py-8 px-4 border-t border-cv-border">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-cv-muted text-xs">
                  <p>{t("footer.rights")}</p>
                  <p className="text-center">{t("footer.built")}</p>
                </div>
              </footer>
            </motion.div>
          ) : (
            // ═══════════════════════════════════
            //  DEV MODE — Pour les lead devs
            // ═══════════════════════════════════
            <motion.div
              key="dev"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen"
            >
              <HeroDev
                t={t}
                lang={lang}
                onOpenTerminal={terminal.openTerminal}
              />
              <ProjectsDev t={t} lang={lang} />
              <StackDev t={t} lang={lang} />
              <GitHubFeed lang={lang} />

              {/* Footer Dev */}
              <footer className="py-8 px-4 border-t border-dev-border relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-dev-muted text-xs font-mono">
                  <p><span className="opacity-60">{"//"}</span>{" "}{t("footer.rights")}</p>
                  <p className="text-center opacity-50">{t("footer.built")}</p>
                </div>
              </footer>

              {/* Terminal (Ctrl+K) */}
              <Terminal {...terminal} t={t} />

              {/* Badge performance */}
              <PerfBadge />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
}
