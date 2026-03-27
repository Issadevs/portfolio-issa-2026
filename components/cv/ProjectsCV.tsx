"use client";

// Section Projets CV Mode — présentation visuelle orientée RH
// Choix : grid 2 colonnes avec hover lift, pas de code visible côté RH

import { motion } from "framer-motion";

interface ProjectsCVProps {
  t: (key: string) => string;
}

type ProjectKey = "petfinder" | "bookreco" | "cproject" | "sfr" | "sad" | "metavideosync";

const projectMeta: Record<
  ProjectKey,
  { emoji: string; accent: string; featured?: boolean; github?: string }
> = {
  sfr:           { emoji: "🏢", accent: "red",    featured: true },
  sad:           { emoji: "🧠", accent: "violet", featured: true, github: "https://github.com/Issadevs/SAD-Tumeurs-Cerebrales" },
  metavideosync: { emoji: "📱", accent: "blue" },
  petfinder:     { emoji: "🐾", accent: "blue",   github: "https://github.com/Issadevs/PetFinder" },
  bookreco:      { emoji: "📚", accent: "purple" },
  cproject:      { emoji: "⚙️", accent: "gray",   github: "https://github.com/Issadevs/Projet-IA" },
};


export default function ProjectsCV({ t }: ProjectsCVProps) {
  const projects = Object.entries(projectMeta) as [ProjectKey, (typeof projectMeta)[ProjectKey]][];

  return (
    <section id="projets" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-cv-text mb-2">
            {t("projects.title")}
          </h2>
          <p className="text-cv-muted text-base">{t("projects.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(([key, meta], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`border rounded-xl p-5 bg-cv-surface transition-shadow hover:shadow-md cursor-default ${
                meta.featured ? "border-cv-accent/40 ring-1 ring-cv-accent/10" : "border-cv-border"
              }`}
            >
              {/* En-tête */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{meta.emoji}</span>
                {meta.featured && (
                  <span className="text-xs px-2 py-0.5 bg-cv-accent text-white rounded-full font-medium">
                    {t("projects.featured_badge")}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-cv-text text-base mb-0.5">
                {t(`projects.${key}.title`)}
              </h3>
              <p className="text-cv-muted text-xs mb-3 font-medium uppercase tracking-wide">
                {t(`projects.${key}.category`)}
              </p>
              <p className="text-cv-muted text-sm leading-relaxed mb-4">
                {t(`projects.${key}.description`)}
              </p>

              {/* Impact */}
              <div className="bg-cv-bg rounded-md p-2 mb-4 border border-cv-border">
                <p className="text-xs text-cv-text font-medium">
                  ↳ {t(`projects.${key}.impact`)}
                </p>
              </div>

              {/* Stack badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(t(`projects.${key}.stack`) as unknown as string[]).length > 0
                  ? String(t(`projects.${key}.stack`))
                      .replace(/[\[\]"]/g, "")
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((tech: string) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 bg-cv-bg border border-cv-border rounded text-cv-muted"
                        >
                          {tech}
                        </span>
                      ))
                  : null}
              </div>

              {/* Lien GitHub */}
              {meta.github && (
                <a
                  href={meta.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cv-accent hover:underline"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
