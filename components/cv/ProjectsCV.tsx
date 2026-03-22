"use client";

// Section Projets CV Mode — présentation visuelle orientée RH
// Choix : grid 2 colonnes avec hover lift, pas de code visible côté RH

import { motion } from "framer-motion";

interface ProjectsCVProps {
  t: (key: string) => string;
}

type ProjectKey = "petfinder" | "bookreco" | "cproject" | "sfr";

const projectMeta: Record<
  ProjectKey,
  { emoji: string; accent: string; featured?: boolean }
> = {
  petfinder: { emoji: "🐾", accent: "blue" },
  bookreco: { emoji: "📚", accent: "purple" },
  cproject: { emoji: "⚙️", accent: "gray" },
  sfr: { emoji: "🏢", accent: "red", featured: true },
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

        <div className="grid sm:grid-cols-2 gap-5">
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
              <div className="flex flex-wrap gap-1.5">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
