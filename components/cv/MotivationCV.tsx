"use client";

// Section "Ce qui me motive" — aspects humains et soft skills
// Choix : cards icon + texte, ton personnel mais professionnel

import { motion } from "framer-motion";

interface MotivationCVProps {
  t: (key: string) => string;
}

const motivations = [
  { key: "fitness", icon: "💪" },
  { key: "football", icon: "⚽" },
  { key: "curiosity", icon: "🧠" },
];

export default function MotivationCV({ t }: MotivationCVProps) {
  return (
    <section className="py-24 px-4 bg-cv-surface">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-cv-text mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t("motivation.title")}
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {motivations.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 border border-cv-border rounded-xl hover:border-cv-accent/40 transition-colors group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <h3 className="font-semibold text-cv-text text-sm mb-1">
                {t(`motivation.${item.key}.title`)}
              </h3>
              <p className="text-cv-muted text-sm leading-relaxed mt-2">
                {t(`motivation.${item.key}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
