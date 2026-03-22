"use client";

// Hook i18n custom : persistance localStorage + fade sur changement de langue
// Choix : pas de next-intl pour garder le contrôle total et éviter la complexité de routing

import { useState, useCallback, useEffect } from "react";
import fr from "@/lib/i18n/fr.json";
import en from "@/lib/i18n/en.json";

export type Lang = "fr" | "en";
type Translations = typeof fr;

// Récupère une valeur imbriquée dans un objet avec un chemin dot-notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

const translations: Record<Lang, Translations> = { fr, en };

export function useLang() {
  const [lang, setLangState] = useState<Lang>("fr");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialisation depuis localStorage côté client uniquement
  useEffect(() => {
    const stored = localStorage.getItem("portfolio_lang") as Lang | null;
    if (stored && (stored === "fr" || stored === "en")) {
      const hydrateLang = setTimeout(() => {
        setLangState(stored);
      }, 0);

      return () => clearTimeout(hydrateLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    if (newLang === lang) return;
    // Fade out → change → fade in
    setIsTransitioning(true);
    setTimeout(() => {
      setLangState(newLang);
      localStorage.setItem("portfolio_lang", newLang);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 150);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(lang === "fr" ? "en" : "fr");
  }, [lang, setLang]);

  // Fonction de traduction avec support des interpolations {key}
  const t = useCallback(
    (path: string, vars?: Record<string, string>): string => {
      let value = getNestedValue(
        translations[lang] as unknown as Record<string, unknown>,
        path
      );
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, v);
        });
      }
      return value;
    },
    [lang]
  );

  return { lang, setLang, toggleLang, t, isTransitioning };
}
