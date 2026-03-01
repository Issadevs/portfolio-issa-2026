"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMode } from "@/hooks/useMode";
import { useLang } from "@/hooks/useLang";
import { useTerminal } from "@/hooks/useTerminal";
import Header from "@/components/shared/Header";
import GlitchTransition from "@/components/shared/GlitchTransition";
import HeroCV from "@/components/cv/HeroCV";
import StoryCV from "@/components/cv/StoryCV";
import ExperienceCV from "@/components/cv/ExperienceCV";
import ProjectsCV from "@/components/cv/ProjectsCV";
import MotivationCV from "@/components/cv/MotivationCV";
import ContactCV from "@/components/cv/ContactCV";
import HeroDev from "@/components/dev/HeroDev";
import ProjectsDev from "@/components/dev/ProjectsDev";
import StackDev from "@/components/dev/StackDev";
import Terminal from "@/components/dev/Terminal";

import type { PortfolioSettings } from "@/lib/settings";

const WebGLBackground = dynamic(
  () => import("@/components/dev/WebGLBackground"),
  { ssr: false, loading: () => null }
);

const GitHubFeed = dynamic(() => import("@/components/dev/GitHubFeed"), {
  ssr: false,
  loading: () => <GitHubFeedSkeleton />,
});

const PerfBadge = dynamic(() => import("@/components/dev/PerfBadge"), {
  ssr: false,
  loading: () => null,
});

function GitHubFeedSkeleton() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="h-3 w-28 bg-dev-surface-2 rounded animate-pulse mb-3" />
        <div className="h-6 w-44 bg-dev-surface-2 rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-dev-surface rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}

interface PortfolioClientProps {
  settings: PortfolioSettings;
}

export default function PortfolioClient({ settings }: PortfolioClientProps) {
  const { mode, toggleMode, isGlitching } = useMode();
  const { lang, toggleLang, t, isTransitioning } = useLang();
  const terminal = useTerminal(lang, settings);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [idleReady, setIdleReady] = useState(false);

  const isDev = mode === "dev";

  useEffect(() => {
    if (!isDev) {
      setIdleReady(false);
      return;
    }
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setIdleReady(true), {
        timeout: 2000,
      });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setIdleReady(true), 2000);
      return () => clearTimeout(id);
    }
  }, [isDev]);

  return (
    <>
      <GlitchTransition isActive={isGlitching} targetMode={isDev ? "dev" : "cv"} />

      {isDev && !prefersReducedMotion && idleReady && <WebGLBackground />}

      {isDev && <div className="fixed inset-0 z-[1] dev-grid pointer-events-none" />}

      <Header
        mode={mode}
        lang={lang}
        t={t}
        onToggleMode={toggleMode}
        onToggleLang={toggleLang}
        isGlitching={isGlitching}
      />

      <motion.main
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className={`relative ${isDev ? "z-10" : "z-0"}`}
      >
        <AnimatePresence mode="wait">
          {!isDev ? (
            <motion.div
              key="cv"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-cv-bg min-h-screen"
            >
              <HeroCV
                t={t}
                lang={lang}
                onSwitchToDev={toggleMode}
                settings={settings}
              />
              <StoryCV t={t} />
              <ExperienceCV t={t} />
              <ProjectsCV t={t} />
              <MotivationCV t={t} />
              <ContactCV t={t} lang={lang} settings={settings} />

              <footer className="py-8 px-4 border-t border-cv-border">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-cv-muted text-xs">
                  <p>{t("footer.rights")}</p>
                  <p className="text-center">{t("footer.built")}</p>
                </div>
              </footer>
            </motion.div>
          ) : (
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
                settings={settings}
              />
              <ProjectsDev t={t} lang={lang} />
              <StackDev t={t} lang={lang} />

              {idleReady ? (
                <GitHubFeed lang={lang} />
              ) : (
                <GitHubFeedSkeleton />
              )}

              <footer className="py-8 px-4 border-t border-dev-border relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-dev-muted text-xs font-mono">
                  <p>
                    <span className="opacity-60">{"//"}</span>{" "}
                    {t("footer.rights")}
                  </p>
                  <p className="text-center opacity-50">{t("footer.built")}</p>
                </div>
              </footer>

              <Terminal {...terminal} t={t} />

              {idleReady && <PerfBadge />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
}
