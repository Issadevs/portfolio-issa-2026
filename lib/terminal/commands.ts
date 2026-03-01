import type { Lang } from "@/hooks/useLang";
import type { PortfolioSettings } from "@/lib/settings";

export type CommandHandler = (lang: Lang, settings: PortfolioSettings) => string | string[];
type Commands = Record<string, CommandHandler>;

function getAge(): number {
  return new Date().getFullYear() - 2003;
}

function padBox(s: string): string {
  const safe = s.length > 39 ? s.slice(0, 38) + "…" : s;
  return `│  ${safe.padEnd(39)}│`;
}

export const terminalCommands: Commands = {
  help: (lang, _settings) =>
    lang === "fr"
      ? [
          "╔═══════════════════════════════════════╗",
          "║       TERMINAL ISSA KANE v1.0         ║",
          "╚═══════════════════════════════════════╝",
          "",
          "  whoami      → Qui suis-je ?",
          "  projects    → Mes 4 projets",
          "  stack       → Stack technique complète",
          "  xp          → Expérience professionnelle",
          "  contact     → Me contacter",
          "  clear        → Vider le terminal",
          "  exit         → Fermer le terminal",
          "",
          "  Astuce : Tab pour l'autocomplétion, ↑↓ pour l'historique",
        ]
      : [
          "╔═══════════════════════════════════════╗",
          "║       ISSA KANE TERMINAL v1.0         ║",
          "╚═══════════════════════════════════════╝",
          "",
          "  whoami      → Who am I?",
          "  projects    → My 4 projects",
          "  stack       → Full tech stack",
          "  xp          → Work experience",
          "  contact     → Get in touch",
          "  clear        → Clear terminal",
          "  exit         → Close terminal",
          "",
          "  Tip: Tab for autocomplete, ↑↓ for history",
        ],

  whoami: (lang, settings) => {
    const notLooking = settings.status === "NOT_LOOKING";
    const showRhythm = settings.contract_type === "ALTERNANCE" && !notLooking;

    if (lang === "fr") {
      const availLine = notLooking
        ? padBox("Pas en recherche active")
        : padBox(settings.headline_fr || "Disponible");
      const lines: string[] = [
        "┌─────────────────────────────────────────┐",
        "│  Issa KANE                              │",
        "│  Ingénieur IA & Data                    │",
        "│  EFREI Paris | Master 1                 │",
        padBox(`${getAge()} ans | ${settings.location}`),
        availLine,
      ];
      if (showRhythm) lines.push(padBox("3j entreprise / 2j école"));
      lines.push(
        "└─────────────────────────────────────────┘",
        "",
        "  Né au Sénégal 🌍, Bac S mention AB à Dakar",
        "  Stage commercial chez Aérial Group (2022)",
        "  Ingénieur SI chez SFR pendant 2 ans (2023-2025)",
        "  \"Je build des pipelines data et des systèmes ML.\""
      );
      return lines;
    } else {
      const availLine = notLooking
        ? padBox("Not actively looking")
        : padBox(settings.headline_en || "Available");
      const lines: string[] = [
        "┌─────────────────────────────────────────┐",
        "│  Issa KANE                              │",
        "│  AI & Data Engineer                     │",
        "│  EFREI Paris | Master 1                 │",
        padBox(`${getAge()} years old | ${settings.location}`),
        availLine,
      ];
      if (showRhythm) lines.push(padBox("3 days company / 2 days school"));
      lines.push(
        "└─────────────────────────────────────────┘",
        "",
        "  Born in Senegal 🌍, high school diploma with honors in Dakar",
        "  Commercial internship at Aérial Group (2022)",
        "  Systems engineer at SFR for 2 years (2023-2025)",
        "  \"I build data pipelines and ML systems.\""
      );
      return lines;
    }
  },

  projects: (lang, _settings) =>
    lang === "fr"
      ? [
          "── PROJETS ──────────────────────────────────",
          "",
          "  [1] PetFinder — Full-stack web",
          "      Spring Boot + MyBatis + Vue.js + SQL",
          "      Plateforme d'adoption avec recherche temps réel",
          "",
          "  [2] Système de reco livres — IA & Data",
          "      Python + NLP + TF-IDF + Filtrage collaboratif",
          "      Content-based + collaborative filtering",
          "",
          "  [3] Recommandations en C — Autodidacte",
          "      C pur + structures de données + algos custom",
          "      Analyse d'humeur → suggestions films/livres",
          "",
          "  [4] App SI SFR — Prod réelle ⭐",
          "      Python/Flask + Kafka + Elasticsearch + ML + Prometheus",
          "      Pipeline complet, présenté à la direction SFR",
          "",
          "  → Tapez 'xp' pour plus de détails sur le projet SFR",
        ]
      : [
          "── PROJECTS ─────────────────────────────────",
          "",
          "  [1] PetFinder — Full-stack web",
          "      Spring Boot + MyBatis + Vue.js + SQL",
          "      Adoption platform with real-time search",
          "",
          "  [2] Book Recommendation System — AI & Data",
          "      Python + NLP + TF-IDF + Collaborative Filtering",
          "      Content-based + collaborative filtering",
          "",
          "  [3] Recommendations in C — Self-taught",
          "      Pure C + data structures + custom algorithms",
          "      Mood analysis → movie/book suggestions",
          "",
          "  [4] SFR IS App — Real Production ⭐",
          "      Python/Flask + Kafka + Elasticsearch + ML + Prometheus",
          "      Full pipeline, presented to SFR management",
          "",
          "  → Type 'xp' for more details on the SFR project",
        ],

  stack: (lang, _settings) =>
    lang === "fr"
      ? [
          "── STACK TECHNIQUE ──────────────────────────",
          "",
          "  LANGAGES",
          "  Python · Java · C · SQL · TypeScript · PHP · Swift · Kotlin",
          "",
          "  FRAMEWORKS",
          "  Flask · Spring Boot · Vue.js · Next.js · Laravel",
          "  LangChain · LangGraph",
          "",
          "  DATA & IA",
          "  Pandas · Scikit-learn · NLP · TF-IDF",
          "  Filtrage collaboratif · Détection d'anomalies · ML pipelines",
          "",
          "  BIG DATA",
          "  Kafka · Elasticsearch · Spark / PySpark",
          "",
          "  BASES DE DONNÉES",
          "  MySQL · PostgreSQL · MongoDB · MyBatis",
          "",
          "  SYSTÈMES",
          "  Linux · Bash · Windows Server · NFS · Active Directory",
          "",
          "  DEVOPS & MONITORING",
          "  Docker · Git/GitHub · Prometheus · Grafana",
          "",
          "  CE PORTFOLIO",
          "  Next.js 14 · TypeScript · Tailwind · Framer Motion",
          "  Three.js · GLSL · Shiki · Monaco Editor",
        ]
      : [
          "── TECH STACK ───────────────────────────────",
          "",
          "  LANGUAGES",
          "  Python · Java · C · SQL · TypeScript · PHP · Swift · Kotlin",
          "",
          "  FRAMEWORKS",
          "  Flask · Spring Boot · Vue.js · Next.js · Laravel",
          "  LangChain · LangGraph",
          "",
          "  DATA & AI",
          "  Pandas · Scikit-learn · NLP · TF-IDF",
          "  Collaborative filtering · Anomaly detection · ML pipelines",
          "",
          "  BIG DATA",
          "  Kafka · Elasticsearch · Spark / PySpark",
          "",
          "  DATABASES",
          "  MySQL · PostgreSQL · MongoDB · MyBatis",
          "",
          "  SYSTEMS",
          "  Linux · Bash · Windows Server · NFS · Active Directory",
          "",
          "  DEVOPS & MONITORING",
          "  Docker · Git/GitHub · Prometheus · Grafana",
          "",
          "  THIS PORTFOLIO",
          "  Next.js 14 · TypeScript · Tailwind · Framer Motion",
          "  Three.js · GLSL · Shiki · Monaco Editor",
        ],

  xp: (lang, _settings) =>
    lang === "fr"
      ? [
          "── EXPÉRIENCE ───────────────────────────────",
          "",
          "  ★ Ingénieur SI — SFR Paris",
          "    Août 2023 → Août 2025  (2 ans, Alternance)",
          "",
          "    ● App web Python/Flask : suivi performance SI",
          "    ● Pipeline Kafka → Elasticsearch (de zéro)",
          "    ● Monitoring Prometheus en production",
          "    ● Intégration ML : détection d'anomalies temps réel",
          "    ● Présentation à la direction SFR ← projet stratégique",
          "",
          "    Architecture : Flask REST → Kafka Broker → ES Index",
          "                  → Scikit-learn model → Prometheus metrics",
          "",
          "  ○ Prospecteur commercial — Aérial Group",
          "    Janvier 2022 → Février 2022  (Stage)",
          "    Startup création de sites web · Prospection clients · Vente de solutions digitales",
        ]
      : [
          "── EXPERIENCE ───────────────────────────────",
          "",
          "  ★ Systems Engineer — SFR Paris",
          "    August 2023 → August 2025  (2 years, Apprenticeship)",
          "",
          "    ● Python/Flask web app: IS performance tracking",
          "    ● Kafka → Elasticsearch pipeline (from scratch)",
          "    ● Prometheus monitoring in production",
          "    ● ML integration: real-time anomaly detection",
          "    ● Presented to SFR management ← strategic project",
          "",
          "    Architecture: Flask REST → Kafka Broker → ES Index",
          "                  → Scikit-learn model → Prometheus metrics",
          "",
          "  ○ Commercial Prospector — Aérial Group",
          "    January 2022 → February 2022  (Internship)",
          "    Web agency startup · Client prospecting · Selling digital solutions",
        ],

  contact: (lang, settings) => {
    const notLooking = settings.status === "NOT_LOOKING";
    const showRhythm = settings.contract_type === "ALTERNANCE" && !notLooking;

    if (lang === "fr") {
      const lines: string[] = [
        "── CONTACT ──────────────────────────────────",
        "",
        "  Email    →  issa.kane@efrei.net",
        "  GitHub   →  github.com/issadevs",
        "  LinkedIn →  linkedin.com/in/issakane",
        "  Tél      →  06 52 52 72 14",
        "",
      ];
      if (!notLooking) lines.push(`  ${settings.headline_fr || "Disponible"}`);
      if (showRhythm) lines.push("  Rythme : 3j entreprise / 2j école");
      lines.push(`  Localisation : ${settings.location}`);
      return lines;
    } else {
      const lines: string[] = [
        "── CONTACT ──────────────────────────────────",
        "",
        "  Email    →  issa.kane@efrei.net",
        "  GitHub   →  github.com/issadevs",
        "  LinkedIn →  linkedin.com/in/issakane",
        "  Phone    →  +33 6 52 52 72 14",
        "",
      ];
      if (!notLooking) lines.push(`  ${settings.headline_en || "Available"}`);
      if (showRhythm) lines.push("  Schedule: 3 days company / 2 days school");
      lines.push(`  Location: ${settings.location}`);
      return lines;
    }
  },

  dakar: (_lang, _settings) => [
    "",
    "  ██████████████████████████████████████████",
    "  ██        ██████████████████████████████ ██",
    "  ██  VERT  ██        JAUNE        ██  R  ██",
    "  ██        ██  ★ SÉNÉGAL ★       ██  O  ██",
    "  ██        ██████████████████████████  U  ██",
    "  ██████████████████████████████████████  G  ██",
    "  ████████████████████████████████████  E  ██",
    "  ██████████████████████████████████████████",
    "",
    "  🌍 Né à Dakar, Sénégal",
    "  Bac scientifique mention Assez Bien",
    "  Parti étudier à EFREI Paris, classe prépa intégrée",
    "",
    "  \"Le Sénégal m'a appris la résilience.",
    "   Paris m'a appris l'ingénierie.",
    "   Les deux font qui je suis.\"",
    "",
    "  Teranga 🤝",
    "",
  ],
};
