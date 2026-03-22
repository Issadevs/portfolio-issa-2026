"use client";

// Hero Dev Mode : présentation technique avec style terminal
// La ligne "status" est dynamique (pilotée par portfolio_settings)

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Lang } from "@/hooks/useLang";
import type { PortfolioSettings } from "@/lib/settings";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import { PROFILE, getAvailabilityLabel } from "@/lib/profile";

interface HeroDevProps {
  t: (key: string) => string;
  lang: Lang;
  onOpenTerminal: () => void;
  settings: PortfolioSettings;
}

function useTypewriter(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i >= text.length) {
        setDone(true);
        clearInterval(timer);
        return;
      }
      setDisplayed(text.slice(0, i + 1));
      i++;
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function HeroDev({
  t,
  lang,
  onOpenTerminal,
  settings,
}: HeroDevProps) {
  const signature = t("hero.signature");
  const { displayed, done } = useTypewriter(signature, 35);

  const statusValue = `"${getAvailabilityLabel(settings, lang)}"`;

  const lines = [
    {
      label: "const",
      key: "name",
      value: `"${PROFILE.fullName}"`,
      color: "text-yellow-300",
    },
    {
      label: "const",
      key: "role",
      value: `"${PROFILE.role[lang]}"`,
      color: "text-green-300",
    },
    {
      label: "const",
      key: "school",
      value: '"EFREI Paris — Master 1"',
      color: "text-blue-300",
    },
    {
      label: "const",
      key: "status",
      value: statusValue, // ← dynamique
      color: "text-dev-accent",
    },
    {
      label: "const",
      key: "location",
      value: `"${settings.location}"`, // ← dynamique
      color: "text-purple-300",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-14 relative z-10">
      <div className="max-w-4xl w-full">
        {/* Bloc code-style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-dev-surface border border-dev-border rounded-xl overflow-hidden shadow-2xl shadow-black/50"
        >
          {/* Barre de titre */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-dev-border bg-dev-surface-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <ProfileAvatar size={28} priority />
            <span className="text-dev-muted text-xs font-mono">
              issa.kane — portfolio.ts
            </span>
          </div>

          {/* Contenu code */}
          <div className="p-6 sm:p-8 font-mono">
            <p className="text-dev-muted text-sm mb-4">
              {"// portfolio/src/engineer.ts"}
            </p>

            {lines.map((line, i) => (
              <motion.div
                key={line.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-2 text-sm sm:text-base mb-1.5"
              >
                <span className="text-purple-400">{line.label}</span>
                <span className="text-dev-text">{line.key}</span>
                <span className="text-dev-muted">=</span>
                <span className={line.color}>{line.value}</span>
                <span className="text-dev-muted">;</span>
              </motion.div>
            ))}

            {/* Séparateur */}
            <div className="my-5 border-t border-dev-border" />

            {/* Phrase signature typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg sm:text-2xl text-dev-text font-mono"
            >
              <span className="text-dev-muted">{"// "}</span>
              <span>{displayed}</span>
              {!done && (
                <motion.span
                  className="inline-block w-0.5 h-5 bg-dev-accent ml-0.5 align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-6 py-3 border border-dev-accent text-dev-accent rounded-lg font-mono text-sm hover:bg-dev-accent/10 transition-colors w-full sm:w-auto justify-center"
          >
            <span className="opacity-60">$</span>
            <span>Ctrl+K → Terminal</span>
          </button>
          <a
            href="#dev-projects"
            className="flex items-center gap-2 px-6 py-3 border border-dev-border text-dev-text rounded-lg font-mono text-sm hover:border-dev-accent/40 transition-colors w-full sm:w-auto justify-center"
          >
            <span>↓</span>
            <span>{lang === "fr" ? "Voir les projets" : "View projects"}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
