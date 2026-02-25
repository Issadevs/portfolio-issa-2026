"use client";

// Section Stack technique complète Dev Mode
// Choix : grid compact avec niveau d'expertise et contexte d'utilisation réel

import { motion } from "framer-motion";
import type { Lang } from "@/hooks/useLang";

interface StackDevProps {
  t: (key: string) => string;
  lang: Lang;
}

type SkillLevel = "expert" | "avancé" | "intermédiaire" | "notions";
type SkillLevelEn = "expert" | "advanced" | "intermediate" | "basics";

interface Skill {
  name: string;
  level: SkillLevel;
  levelEn: SkillLevelEn;
  context: string;
  contextEn: string;
}

interface Category {
  key: string;
  labelFr: string;
  labelEn: string;
  skills: Skill[];
}

const STACK: Category[] = [
  {
    key: "languages",
    labelFr: "Langages",
    labelEn: "Languages",
    skills: [
      { name: "Python", level: "expert", levelEn: "expert", context: "Flask, ML, pipelines data", contextEn: "Flask, ML, data pipelines" },
      { name: "Java", level: "avancé", levelEn: "advanced", context: "Spring Boot, Spring Security", contextEn: "Spring Boot, Spring Security" },
      { name: "TypeScript", level: "avancé", levelEn: "advanced", context: "Next.js, ce portfolio", contextEn: "Next.js, this portfolio" },
      { name: "SQL", level: "avancé", levelEn: "advanced", context: "MySQL, PostgreSQL, requêtes complexes", contextEn: "MySQL, PostgreSQL, complex queries" },
      { name: "C", level: "intermédiaire", levelEn: "intermediate", context: "Projet autodidacte IA, gestion mémoire", contextEn: "Self-taught AI project, memory management" },
      { name: "PHP", level: "intermédiaire", levelEn: "intermediate", context: "Laravel", contextEn: "Laravel" },
      { name: "Swift", level: "notions", levelEn: "basics", context: "iOS — en apprentissage", contextEn: "iOS — learning" },
      { name: "Kotlin", level: "notions", levelEn: "basics", context: "Android — en apprentissage", contextEn: "Android — learning" },
    ],
  },
  {
    key: "ai",
    labelFr: "IA & Data",
    labelEn: "AI & Data",
    skills: [
      { name: "Scikit-learn", level: "avancé", levelEn: "advanced", context: "Isolation Forest, SVD, pipelines ML", contextEn: "Isolation Forest, SVD, ML pipelines" },
      { name: "NLP / TF-IDF", level: "avancé", levelEn: "advanced", context: "Système de recommandation livres", contextEn: "Book recommendation system" },
      { name: "LangChain", level: "intermédiaire", levelEn: "intermediate", context: "Chaînes RAG, agents LLM", contextEn: "RAG chains, LLM agents" },
      { name: "LangGraph", level: "intermédiaire", levelEn: "intermediate", context: "Workflows agentiques stateful", contextEn: "Stateful agentic workflows" },
      { name: "Pandas", level: "avancé", levelEn: "advanced", context: "Preprocessing, feature engineering", contextEn: "Preprocessing, feature engineering" },
      { name: "Filtrage collaboratif", level: "avancé", levelEn: "advanced", context: "SVD sur matrice user-item", contextEn: "SVD on user-item matrix" },
    ],
  },
  {
    key: "bigdata",
    labelFr: "Big Data",
    labelEn: "Big Data",
    skills: [
      { name: "Kafka", level: "avancé", levelEn: "advanced", context: "Pipeline SFR prod — consumer groups, lag monitoring", contextEn: "SFR prod pipeline — consumer groups, lag monitoring" },
      { name: "Elasticsearch", level: "avancé", levelEn: "advanced", context: "Indexation, ILM, requêtes complexes", contextEn: "Indexing, ILM, complex queries" },
      { name: "Spark / PySpark", level: "intermédiaire", levelEn: "intermediate", context: "Traitements batch à grande échelle", contextEn: "Large-scale batch processing" },
    ],
  },
  {
    key: "devops",
    labelFr: "DevOps & Monitoring",
    labelEn: "DevOps & Monitoring",
    skills: [
      { name: "Docker", level: "avancé", levelEn: "advanced", context: "Conteneurisation services, compose", contextEn: "Service containerization, compose" },
      { name: "Prometheus", level: "avancé", levelEn: "advanced", context: "Métriques custom SI SFR, alerting", contextEn: "Custom SFR IS metrics, alerting" },
      { name: "Grafana", level: "intermédiaire", levelEn: "intermediate", context: "Dashboards monitoring SFR", contextEn: "SFR monitoring dashboards" },
      { name: "Git/GitHub", level: "expert", levelEn: "expert", context: "Branches, PRs, GitHub Actions", contextEn: "Branches, PRs, GitHub Actions" },
      { name: "Linux / Bash", level: "avancé", levelEn: "advanced", context: "Scripting, administration serveur", contextEn: "Scripting, server administration" },
    ],
  },
  {
    key: "portfolio",
    labelFr: "Ce portfolio",
    labelEn: "This portfolio",
    skills: [
      { name: "Next.js 14", level: "avancé", levelEn: "advanced", context: "App Router, SSR, RSC", contextEn: "App Router, SSR, RSC" },
      { name: "Three.js + GLSL", level: "intermédiaire", levelEn: "intermediate", context: "Shaders custom, instanced mesh", contextEn: "Custom shaders, instanced mesh" },
      { name: "Framer Motion", level: "avancé", levelEn: "advanced", context: "Transitions glitch, animations staggered", contextEn: "Glitch transitions, staggered animations" },
      { name: "Tailwind CSS", level: "expert", levelEn: "expert", context: "Design system dual-mode", contextEn: "Dual-mode design system" },
    ],
  },
];

const levelColors: Record<SkillLevel, string> = {
  expert: "text-dev-accent",
  avancé: "text-blue-400",
  intermédiaire: "text-yellow-400",
  notions: "text-dev-muted",
};

const levelBars: Record<SkillLevel, number> = {
  expert: 4,
  avancé: 3,
  intermédiaire: 2,
  notions: 1,
};

export default function StackDev({ t, lang }: StackDevProps) {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-mono text-dev-accent text-sm mb-1">
            {"// stack.json"}
          </h2>
          <h3 className="text-2xl font-bold text-dev-text">{t("stack.title")}</h3>
        </motion.div>

        <div className="space-y-8">
          {STACK.map((cat, ci) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: ci * 0.05 }}
            >
              <h4 className="font-mono text-dev-muted text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-dev-accent" aria-hidden="true">{"//"}</span>
                {lang === "fr" ? cat.labelFr : cat.labelEn}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.skills.map((skill, si) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.05 + si * 0.03 }}
                    className="bg-dev-surface border border-dev-border rounded-lg p-3 hover:border-dev-accent/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-dev-text text-sm font-mono font-medium">
                        {skill.name}
                      </span>
                      {/* Indicateur niveau */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1.5 h-3 rounded-sm transition-colors ${
                              bar <= levelBars[skill.level]
                                ? levelColors[skill.level].replace("text-", "bg-").replace("text-dev-accent", "bg-[#00FF88]").replace("text-dev-muted", "bg-dev-muted")
                                : "bg-dev-surface-2"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs font-mono mb-1 ${levelColors[skill.level]}`}>
                      {lang === "fr" ? skill.level : skill.levelEn}
                    </p>
                    <p className="text-dev-muted text-xs leading-tight">
                      {lang === "fr" ? skill.context : skill.contextEn}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
