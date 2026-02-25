"use client";

// Terminal interactif Dev Mode : Ctrl+K pour ouvrir, historique, autocomplétion Tab
// Choix : composant contrôlé par useTerminal hook, animation slide-up Framer Motion

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { useTerminal } from "@/hooks/useTerminal";

type TerminalProps = ReturnType<typeof useTerminal> & {
  t: (key: string) => string;
};

export default function Terminal({
  isOpen,
  lines,
  input,
  setInput,
  inputRef,
  openTerminal,
  closeTerminal,
  handleKeyDown,
  t,
}: TerminalProps) {
  // Raccourci Ctrl+K pour ouvrir/fermer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        if (isOpen) closeTerminal();
        else openTerminal();
      }
      if (e.key === "Escape" && isOpen) closeTerminal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, openTerminal, closeTerminal]);

  // Auto-scroll vers le bas à chaque nouvelle ligne
  useEffect(() => {
    const container = document.getElementById("terminal-output");
    if (container) container.scrollTop = container.scrollHeight;
  }, [lines]);

  return (
    <>
      {/* Bouton d'ouverture (hint visible) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={openTerminal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-2 border border-dev-accent/40 rounded-lg text-dev-accent text-xs font-mono hover:bg-dev-accent/10 transition-colors"
          >
            <span className="opacity-60">Ctrl+K</span>
            <span className="w-px h-3 bg-dev-border" />
            Terminal
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panneau terminal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[55vh] sm:h-[45vh] max-h-[600px] bg-dev-terminal border-t border-dev-border flex flex-col"
          >
            {/* Barre de titre du terminal */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-dev-border bg-dev-surface flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Dots style macOS */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-dev-muted text-xs font-mono">
                  issa@portfolio:~$
                </span>
              </div>
              <button
                onClick={closeTerminal}
                className="text-dev-muted hover:text-dev-text text-xs font-mono px-2 py-1 rounded hover:bg-dev-surface-2 transition-colors"
                aria-label={t("terminal.close")}
              >
                ✕ Esc
              </button>
            </div>

            {/* Zone de sortie */}
            <div
              id="terminal-output"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 font-mono text-xs scroll-smooth"
            >
              {lines.map((line) => (
                <TerminalLine key={line.id} line={line} />
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="flex items-center px-4 py-3 border-t border-dev-border bg-dev-surface flex-shrink-0">
              <span className="text-dev-accent font-mono text-xs mr-2 flex-shrink-0">
                issa@portfolio:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-dev-text font-mono text-xs outline-none placeholder:text-dev-muted/40 caret-dev-accent"
                placeholder="Tapez une commande... (Tab pour compléter)"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TerminalLine({
  line,
}: {
  line: { type: string; content: string };
}) {
  const colorMap: Record<string, string> = {
    input: "text-dev-accent",
    output: "text-dev-text",
    error: "text-red-400",
    system: "text-dev-muted",
  };

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      className={`font-mono text-xs leading-relaxed whitespace-pre ${colorMap[line.type] ?? "text-dev-text"}`}
    >
      {line.content}
    </motion.p>
  );
}
