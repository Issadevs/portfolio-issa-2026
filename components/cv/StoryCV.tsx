"use client";

// Section "Mon histoire" — timeline narrative et visuelle
// Choix : timeline verticale avec intersection observer (via Framer Motion viewport)

import { motion } from "framer-motion";

interface StoryCVProps {
  t: (key: string) => string;
}

const chapters = [
  { key: "chapter1", icon: "🎓", color: "border-blue-300" },
  { key: "chapter2", icon: "⚡", color: "border-cv-accent" },
  { key: "chapter3", icon: "🤖", color: "border-purple-400" },
  { key: "chapter4", icon: "🚀", color: "border-green-400" },
];

export default function StoryCV({ t }: StoryCVProps) {
  return (
    <section id="parcours" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-cv-text mb-3">
            {t("story.title")}
          </h2>
          <p className="text-cv-muted text-base leading-relaxed">
            {t("story.intro")}
          </p>
        </motion.div>

        {/* Timeline verticale */}
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-cv-border" />

          <div className="space-y-10">
            {chapters.map((chapter, i) => (
              <motion.div
                key={chapter.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6"
              >
                {/* Icône + nœud */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-cv-surface border-2 ${chapter.color} flex items-center justify-center text-lg shadow-sm`}>
                    {chapter.icon}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 pb-2 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-cv-muted border border-cv-border px-2 py-0.5 rounded">
                      {t(`story.${chapter.key}.year`)}
                    </span>
                    <h3 className="font-semibold text-cv-text text-base">
                      {t(`story.${chapter.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-cv-muted text-sm leading-relaxed">
                    {t(`story.${chapter.key}.text`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
