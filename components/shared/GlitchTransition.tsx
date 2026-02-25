"use client";

// Animation de transition glitch entre CV Mode et Dev Mode
// Choix : CSS + Framer Motion pour la cohérence avec le reste du site
// L'effet "fragmentation" est obtenu par 3 couches décalées avec clip-path animé

import { motion, AnimatePresence } from "framer-motion";

interface GlitchTransitionProps {
  isActive: boolean;
  targetMode: "cv" | "dev";
}

export default function GlitchTransition({ isActive, targetMode }: GlitchTransitionProps) {
  const color = targetMode === "dev" ? "#00FF88" : "#1E40AF";
  const bg = targetMode === "dev" ? "#050810" : "#FAFAFA";

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          {/* Fond de remplissage */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: bg }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Couche glitch 1 — décalage horizontal rouge */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: "#FF0044",
              mixBlendMode: "screen",
            }}
            animate={{
              x: [0, -8, 5, -3, 0, 6, -2, 0],
              clipPath: [
                "inset(0 0 90% 0)",
                "inset(10% 0 60% 0)",
                "inset(40% 0 30% 0)",
                "inset(70% 0 10% 0)",
                "inset(20% 0 50% 0)",
                "inset(80% 0 5% 0)",
                "inset(5% 0 85% 0)",
                "inset(0 0 100% 0)",
              ],
            }}
            transition={{ duration: 0.6, ease: "linear" }}
          />

          {/* Couche glitch 2 — décalage horizontal cyan */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: color,
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
            animate={{
              x: [0, 6, -4, 8, -2, 0, 4, 0],
              clipPath: [
                "inset(90% 0 0% 0)",
                "inset(60% 0 10% 0)",
                "inset(30% 0 40% 0)",
                "inset(5% 0 70% 0)",
                "inset(50% 0 20% 0)",
                "inset(15% 0 75% 0)",
                "inset(85% 0 5% 0)",
                "inset(100% 0 0% 0)",
              ],
            }}
            transition={{ duration: 0.6, ease: "linear", delay: 0.05 }}
          />

          {/* Texte de chargement */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
            transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          >
            <p
              className="font-mono text-sm tracking-[0.3em] uppercase"
              style={{ color }}
            >
              {targetMode === "dev" ? "// LOADING DEV MODE..." : "// LOADING HR MODE..."}
            </p>
          </motion.div>

          {/* Lignes de scan */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${(i + 1) * 12.5}%`,
                backgroundColor: color,
                opacity: 0.3,
              }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
