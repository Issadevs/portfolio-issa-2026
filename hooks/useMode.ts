"use client";

// Hook de switch CV/Dev avec persistance session
// Choix : useState + sessionStorage (pas localStorage) — le mode se reset à chaque visite

import { useState, useCallback, useEffect } from "react";

export type Mode = "cv" | "dev";

export function useMode() {
  const [mode, setModeState] = useState<Mode>("cv");
  const [isGlitching, setIsGlitching] = useState(false);

  // Sync avec session storage
  useEffect(() => {
    const stored = sessionStorage.getItem("portfolio_mode") as Mode | null;
    if (stored === "cv" || stored === "dev") {
      const hydrateMode = setTimeout(() => {
        setModeState(stored);
      }, 0);

      return () => clearTimeout(hydrateMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dev");
  }, [mode]);

  const switchMode = useCallback(
    (newMode: Mode) => {
      if (newMode === mode || isGlitching) return;

      setIsGlitching(true);

      // L'animation glitch dure 800ms, puis on bascule
      setTimeout(() => {
        setModeState(newMode);
        sessionStorage.setItem("portfolio_mode", newMode);

        setTimeout(() => setIsGlitching(false), 200);
      }, 600);
    },
    [mode, isGlitching]
  );

  const toggleMode = useCallback(() => {
    switchMode(mode === "cv" ? "dev" : "cv");
  }, [mode, switchMode]);

  return { mode, switchMode, toggleMode, isGlitching };
}
