"use client";

// Section Expérience CV Mode — SFR en vedette
// Choix : card avec état hover détaillé, badges technos discrets

import { motion } from "framer-motion";
import { useState } from "react";
import BrandLogo from "@/components/shared/BrandLogo";

interface ExperienceCVProps {
  t: (key: string) => string;
}

export default function ExperienceCV({ t }: ExperienceCVProps) {
  const [expandedSfr, setExpandedSfr] = useState(false);

  const sfrBullets: string[] = [
    t("experience.sfr_engineer.bullets.0"),
    t("experience.sfr_engineer.bullets.1"),
    t("experience.sfr_engineer.bullets.2"),
    t("experience.sfr_engineer.bullets.3"),
    t("experience.sfr_engineer.bullets.4"),
  ];

  return (
    <section id="experience" className="py-24 px-4 bg-cv-surface">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-cv-text mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("experience.title")}
        </motion.h2>

        {/* SFR Ingénieur SI — expérience principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-cv-border rounded-xl p-6 mb-6 hover:border-cv-accent/50 transition-colors group"
        >
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-cv-text">
                  {t("experience.sfr_engineer.role")}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-cv-accent/10 text-cv-accent rounded-full font-medium">
                  {t("experience.sfr_engineer.type")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BrandLogo brand="sfr" size={44} />
                <p className="text-cv-accent font-medium text-sm">
                  {t("experience.sfr_engineer.company")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-cv-muted text-sm">
                {t("experience.sfr_engineer.period")}
              </p>
              <p className="text-cv-text font-medium text-sm">
                {t("experience.sfr_engineer.duration")}
              </p>
            </div>
          </div>

          {/* Impact principal */}
          <div className="bg-cv-bg rounded-lg p-3 mb-4 border border-cv-border">
            <p className="text-xs text-cv-muted uppercase tracking-wide mb-1">Impact</p>
            <p className="text-sm text-cv-text font-medium">
              {t("experience.sfr_engineer.impact")}
            </p>
          </div>

          {/* Bullets détail (toggle) */}
          <button
            onClick={() => setExpandedSfr(!expandedSfr)}
            className="text-sm text-cv-accent hover:underline flex items-center gap-1"
          >
            {expandedSfr ? t("experience.show_less") : t("experience.show_more")}
          </button>

          <motion.div
            initial={false}
            animate={{ height: expandedSfr ? "auto" : 0, opacity: expandedSfr ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2">
              {sfrBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-cv-muted">
                  <span className="text-cv-accent mt-0.5 flex-shrink-0">→</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stack badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["Python", "Flask", "Kafka", "Elasticsearch", "Prometheus", "ML/Scikit-learn"].map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 bg-cv-bg border border-cv-border rounded text-cv-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Aérial Group — Stage prospecteur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border border-cv-border rounded-xl p-6 hover:border-cv-border/80 transition-colors opacity-80"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-base font-semibold text-cv-text">
                  {t("experience.aerial_sales.role")}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-cv-bg border border-cv-border text-cv-muted rounded-full">
                  {t("experience.aerial_sales.type")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BrandLogo brand="aerial" size={44} />
                <p className="text-cv-muted font-medium text-sm">
                  {t("experience.aerial_sales.company")}
                </p>
              </div>
              <p className="text-cv-muted text-xs mt-2 italic">
                {t("experience.aerial_sales.impact")}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-cv-muted text-sm">{t("experience.aerial_sales.period")}</p>
              <p className="text-cv-text text-sm">{t("experience.aerial_sales.duration")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
