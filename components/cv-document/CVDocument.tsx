"use client";

import Image from "next/image";
import { useState } from "react";
import { PROFILE, getAvailabilityLabel, getCvFooterText } from "@/lib/profile";
import type { PortfolioSettings } from "@/lib/settings";

// ─── Logo CV : hauteur fixe + largeur auto → ratio naturel préservé ─────────
const logoSrcs: Record<"sfr" | "efrei" | "aerial", string> = {
  sfr: "/assets/logos/sfr.webp",
  efrei: "/assets/logos/efrei.webp",
  aerial: "/assets/logos/aerial.webp",
};

const logoDimensions: Record<
  keyof typeof logoSrcs,
  {
    width: number;
    height: number;
  }
> = {
  sfr: { width: 600, height: 600 },
  efrei: { width: 800, height: 296 },
  aerial: { width: 697, height: 227 },
};

function CvLogo({
  brand,
  height = 28,
}: {
  brand: "sfr" | "efrei" | "aerial";
  height?: number;
}) {
  const dimensions = logoDimensions[brand];
  const computedWidth = Math.round((dimensions.width / dimensions.height) * height);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrcs[brand]}
      alt={brand}
      width={computedWidth}
      height={height}
      style={{
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────

type Lang = "fr" | "en";

interface CvData {
  personal: {
    name: string;
    title: string;
    tagline: string;
    availability: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  experience: {
    role: string;
    company: string;
    brand: "sfr" | "aerial";
    period: string;
    duration: string;
    bullets: string[];
    impact?: string;
  }[];
  education: {
    degree: string;
    school: string;
    brand?: "efrei";
    period: string;
    detail?: string;
    badge?: string;
  }[];
  skills: { name: string; level: number; category: string }[];
  languages: { name: string; level: number; label: string }[];
  interests: { icon: string; label: string }[];
  projects: { title: string; desc: string; tech: string; star?: boolean }[];
}

// ─── Données bilingues inline ───────────────────────────────────────────────

const cvDataFr: CvData = {
  personal: {
    name: PROFILE.fullName,
    title: PROFILE.role.fr,
    tagline: PROFILE.cvTagline.fr,
    availability: "",
    email: PROFILE.email,
    phone: PROFILE.phoneLocal,
    location: "",
    linkedin: PROFILE.linkedInPath,
    github: PROFILE.githubPath,
  },
  experience: [
    {
      role: "Ingénieur Systèmes d'Information",
      company: "SFR",
      brand: "sfr",
      period: "Août 2023 – Août 2025",
      duration: "2 ans · Alternance",
      bullets: [
        "Conception et déploiement de pipelines de détection d'anomalies temps réel (Kafka + Elasticsearch)",
        "Intégration de modèles ML pour l'optimisation des performances et la détection d'anomalies",
        "Supervision et monitoring avec Prometheus — alerting présenté à la direction SFR",
        "Développement d'une app web Python/Flask pour le suivi de la performance SI",
        "Projet stratégique mené en autonomie, présenté à la direction",
      ],
      impact: "▸ Impact clé : Pipeline Kafka → Elasticsearch → ML → alerting Prometheus",
    },
    {
      role: "Téléprospecteur",
      company: "Aérial Group",
      brand: "aerial",
      period: "Jan. – Fév. 2022",
      duration: "2 mois · Stage",
      bullets: [
        "Prise de rendez-vous B2B pour des solutions de sécurité électronique",
        "Atteinte de 120 % des objectifs hebdomadaires de contacts qualifiés",
      ],
    },
  ],
  education: [
    {
      degree: "Master 1 — Intelligence Artificielle & Data",
      school: "EFREI Paris",
      brand: "efrei",
      period: "2024 – 2026",
      detail: "Parcours grande école · Villejuif",
    },
    {
      degree: "Cycle Préparatoire Intégré",
      school: "EFREI Paris",
      brand: "efrei",
      period: "2022 – 2024",
      detail: "Mathématiques, Physique, Informatique",
    },
    {
      degree: "Baccalauréat Scientifique — Mention Assez Bien",
      school: "Lycée Lamine Guèye",
      period: "2022",
      detail: "Dakar, Sénégal",
      badge: "🌍 Dakar",
    },
  ],
  skills: [
    { name: "Python", level: 5, category: "Data" },
    { name: "Apache Kafka", level: 4, category: "Data" },
    { name: "Elasticsearch", level: 4, category: "Data" },
    { name: "SQL / dbt", level: 5, category: "Data" },
    { name: "Airflow", level: 4, category: "Data" },
    { name: "Machine Learning", level: 4, category: "AI" },
    { name: "Deep Learning", level: 3, category: "AI" },
    { name: "FastAPI", level: 4, category: "Dev" },
    { name: "Docker", level: 4, category: "Dev" },
    { name: "Git / CI-CD", level: 4, category: "Dev" },
    { name: "PostgreSQL", level: 4, category: "Data" },
    { name: "TypeScript / Next.js", level: 3, category: "Dev" },
    { name: "AWS (S3, Lambda)", level: 3, category: "Cloud" },
    { name: "Power BI", level: 3, category: "BI" },
  ],
  languages: [
    { name: "Français", level: 5, label: "Langue maternelle" },
    { name: "Anglais", level: 4, label: "Professionnel (B2)" },
    { name: "Wolof", level: 5, label: "Courant" },
  ],
  interests: [
    { icon: "🏋️", label: "Musculation" },
    { icon: "🎯", label: "Échecs" },
    { icon: "💻", label: "Open Source" },
    { icon: "🌍", label: "Voyages" },
  ],
  projects: [
    {
      title: "Pipeline SI SFR",
      desc: "Pipeline temps réel de détection d'anomalies avec alerting et dashboard",
      tech: "Kafka · Elasticsearch · Prometheus · ML",
      star: true,
    },
    {
      title: "BookReco",
      desc: "Moteur de recommandation combinant analyse de contenu et comportement utilisateur",
      tech: "Python · NLP · TF-IDF · Filtrage collaboratif",
    },
    {
      title: "PetFinder",
      desc: "Plateforme d'adoption d'animaux avec authentification et recherche multicritères",
      tech: "Spring Boot · MyBatis · Vue.js · SQL",
    },
  ],
};

const cvDataEn: CvData = {
  personal: {
    name: PROFILE.fullName,
    title: PROFILE.role.en,
    tagline: PROFILE.cvTagline.en,
    availability: "",
    email: PROFILE.email,
    phone: PROFILE.phoneLocal,
    location: "",
    linkedin: PROFILE.linkedInPath,
    github: PROFILE.githubPath,
  },
  experience: [
    {
      role: "Information Systems Engineer",
      company: "SFR",
      brand: "sfr",
      period: "Aug. 2023 – Aug. 2025",
      duration: "2 years · Work-study",
      bullets: [
        "Designed and deployed real-time anomaly detection pipelines (Kafka + Elasticsearch)",
        "Integrated ML models for performance optimization and anomaly detection",
        "Supervision and monitoring with Prometheus — alerting presented to SFR management",
        "Developed a Python/Flask web app for SI performance tracking and management",
        "Led a strategic project autonomously, presented to company management",
      ],
      impact: "▸ Key impact: Kafka → Elasticsearch → ML → Prometheus alerting pipeline",
    },
    {
      role: "Teleprospector",
      company: "Aérial Group",
      brand: "aerial",
      period: "Jan. – Feb. 2022",
      duration: "2 months · Internship",
      bullets: [
        "Scheduled B2B appointments for electronic security solutions",
        "Achieved 120% of weekly qualified contact targets",
      ],
    },
  ],
  education: [
    {
      degree: "Master 1 — Artificial Intelligence & Data",
      school: "EFREI Paris",
      brand: "efrei",
      period: "2024 – 2026",
      detail: "Graduate school track · Villejuif",
    },
    {
      degree: "Integrated Preparatory Cycle",
      school: "EFREI Paris",
      brand: "efrei",
      period: "2022 – 2024",
      detail: "Mathematics, Physics, Computer Science",
    },
    {
      degree: "Scientific Baccalaureate — Merit",
      school: "Lycée Lamine Guèye",
      period: "2022",
      detail: "Dakar, Senegal",
      badge: "🌍 Dakar",
    },
  ],
  skills: [
    { name: "Python", level: 5, category: "Data" },
    { name: "Apache Kafka", level: 4, category: "Data" },
    { name: "Elasticsearch", level: 4, category: "Data" },
    { name: "SQL / dbt", level: 5, category: "Data" },
    { name: "Airflow", level: 4, category: "Data" },
    { name: "Machine Learning", level: 4, category: "AI" },
    { name: "Deep Learning", level: 3, category: "AI" },
    { name: "FastAPI", level: 4, category: "Dev" },
    { name: "Docker", level: 4, category: "Dev" },
    { name: "Git / CI-CD", level: 4, category: "Dev" },
    { name: "PostgreSQL", level: 4, category: "Data" },
    { name: "TypeScript / Next.js", level: 3, category: "Dev" },
    { name: "AWS (S3, Lambda)", level: 3, category: "Cloud" },
    { name: "Power BI", level: 3, category: "BI" },
  ],
  languages: [
    { name: "French", level: 5, label: "Native" },
    { name: "English", level: 4, label: "Professional (B2)" },
    { name: "Wolof", level: 5, label: "Fluent" },
  ],
  interests: [
    { icon: "🏋️", label: "Weightlifting" },
    { icon: "🎯", label: "Chess" },
    { icon: "💻", label: "Open Source" },
    { icon: "🌍", label: "Travel" },
  ],
  projects: [
    {
      title: "SFR SI Pipeline",
      desc: "Real-time anomaly detection pipeline with alerting and dashboard",
      tech: "Kafka · Elasticsearch · Prometheus · ML",
      star: true,
    },
    {
      title: "BookReco",
      desc: "Recommendation engine combining content analysis and user behavior",
      tech: "Python · NLP · TF-IDF · Collaborative Filtering",
    },
    {
      title: "PetFinder",
      desc: "Pet adoption platform with authentication and multi-criteria search",
      tech: "Spring Boot · MyBatis · Vue.js · SQL",
    },
  ],
};

// ─── Sous-composants ────────────────────────────────────────────────────────

function SkillDots({ level, color = "#3B82F6" }: { level: number; color?: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: i < level ? color : "transparent",
            border: `1.5px solid ${i < level ? color : color + "60"}`,
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

function SectionTitle({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: light ? "#3B82F6" : "#1D4ED8",
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <div
        style={{
          height: 1,
          backgroundColor: light ? "#3B82F640" : "#BFDBFE",
          width: "100%",
        }}
      />
    </div>
  );
}

function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
      <span style={{ color: "#3B82F6", flexShrink: 0, fontSize: 12 }}>{icon}</span>
      <span style={{ fontSize: 10, color: "#CBD5E1", lineHeight: 1.4, wordBreak: "break-all" }}>
        {text}
      </span>
    </div>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────

interface CVDocumentProps {
  lang: Lang;
  settings: PortfolioSettings;
}

export default function CVDocument({ lang, settings }: CVDocumentProps) {
  const [imgError, setImgError] = useState(false);
  const baseCv = lang === "fr" ? cvDataFr : cvDataEn;
  const cv = {
    ...baseCv,
    personal: {
      ...baseCv.personal,
      availability: getAvailabilityLabel(settings, lang),
      location: settings.location,
    },
  };

  const sectionLabelExp = lang === "fr" ? "Expérience professionnelle" : "Professional Experience";
  const sectionLabelEdu = lang === "fr" ? "Formation" : "Education";
  const sectionLabelProj = lang === "fr" ? "Projets phares" : "Featured Projects";
  const sectionLabelSkills = lang === "fr" ? "Compétences" : "Skills";
  const sectionLabelLang = lang === "fr" ? "Langues" : "Languages";
  const sectionLabelInterests = lang === "fr" ? "Centres d'intérêt" : "Interests";
  const sectionLabelContact = "Contact";
  const footerText = getCvFooterText(settings, lang);

  return (
    <div
      id="cv-document"
      style={{
        width: 794,
        minHeight: 1123,
        display: "flex",
        flexDirection: "row",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 240,
          minHeight: 1123,
          backgroundColor: "#0C1F3C",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flexShrink: 0,
        }}
      >
        {/* Photo + nom + titre */}
        <div style={{ textAlign: "center" }}>
          {imgError ? (
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#1D4ED8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
                border: "3px solid #3B82F6",
                marginBottom: 12,
              }}
            >
              IK
            </div>
          ) : (
            <div style={{ display: "inline-block", marginBottom: 12 }}>
              <Image
                src="/images/profile.jpg"
                alt={PROFILE.fullName}
                width={90}
                height={90}
                loading="eager"
                fetchPriority="high"
                style={{
                  borderRadius: "50%",
                  border: "3px solid #3B82F6",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#F1F5F9",
              marginBottom: 4,
              lineHeight: 1.2,
            }}
          >
            {cv.personal.name}
          </p>
          <p
            style={{
              fontSize: 10,
              color: "#93C5FD",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1.4,
            }}
          >
            {cv.personal.title}
          </p>
        </div>

        {/* Contact */}
        <div>
          <SectionTitle label={sectionLabelContact} light />
          <ContactItem
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            text={cv.personal.email}
          />
          <ContactItem
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
              </svg>
            }
            text={cv.personal.phone}
          />
          <ContactItem
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            text={cv.personal.location}
          />
          <ContactItem
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            }
            text={cv.personal.linkedin}
          />
          <ContactItem
            icon={
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            }
            text={cv.personal.github}
          />
        </div>

        {/* Compétences */}
        <div>
          <SectionTitle label={sectionLabelSkills} light />
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {cv.skills.map((skill) => (
              <div key={skill.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#E2E8F0", fontWeight: 500 }}>{skill.name}</span>
                <SkillDots level={skill.level} color="#3B82F6" />
              </div>
            ))}
          </div>
        </div>

        {/* Langues */}
        <div>
          <SectionTitle label={sectionLabelLang} light />
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {cv.languages.map((lang) => (
              <div key={lang.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 10, color: "#E2E8F0", fontWeight: 500 }}>{lang.name}</span>
                  <SkillDots level={lang.level} color="#3B82F6" />
                </div>
                <span style={{ fontSize: 9, color: "#94A3B8" }}>{lang.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centres d'intérêt */}
        <div>
          <SectionTitle label={sectionLabelInterests} light />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cv.interests.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: "#CBD5E1",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: "28px 28px 20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: "2px solid #BFDBFE", paddingBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F2148", margin: 0, lineHeight: 1.1 }}>
                {cv.personal.name}
              </h1>
              <p style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 600, marginTop: 3, marginBottom: 0 }}>
                {cv.personal.title}
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#DBEAFE",
                border: "1px solid #93C5FD",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 9,
                color: "#1D4ED8",
                fontWeight: 600,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#22C55E",
                  display: "inline-block",
                }}
              />
              {cv.personal.availability}
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#64748B", fontStyle: "italic", marginTop: 8, marginBottom: 0 }}>
            {cv.personal.tagline}
          </p>
        </div>

        {/* Expérience */}
        <div>
          <SectionTitle label={sectionLabelExp} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cv.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <CvLogo brand={exp.brand} height={28} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0F2148", margin: 0 }}>{exp.role}</p>
                    <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>
                      {exp.company} · {exp.period} · <span style={{ color: "#64748B" }}>{exp.duration}</span>
                    </p>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 14, listStyle: "none" }}>
                  {exp.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 10,
                        color: "#475569",
                        marginBottom: 3,
                        lineHeight: 1.5,
                        paddingLeft: 0,
                        display: "flex",
                        gap: 5,
                      }}
                    >
                      <span style={{ color: "#3B82F6", flexShrink: 0 }}>▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {exp.impact && (
                  <div
                    style={{
                      marginTop: 6,
                      backgroundColor: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      borderRadius: 4,
                      padding: "4px 8px",
                      fontSize: 9,
                      color: "#1D4ED8",
                      fontWeight: 600,
                    }}
                  >
                    {exp.impact}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formation */}
        <div>
          <SectionTitle label={sectionLabelEdu} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Groupe EFREI : logo une seule fois pour les deux diplômes */}
            {(() => {
              const efreiEntries = cv.education.filter((e) => e.brand === "efrei");
              const otherEntries = cv.education.filter((e) => e.brand !== "efrei");
              return (
                <>
                  {efreiEntries.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flexShrink: 0 }}>
                        <CvLogo brand="efrei" height={22} />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        {efreiEntries.map((edu, i) => (
                          <div key={i}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#0F2148", margin: 0 }}>{edu.degree}</p>
                            <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>
                              {edu.school} · {edu.period}
                            </p>
                            {edu.detail && (
                              <p style={{ fontSize: 9, color: "#94A3B8", margin: 0 }}>{edu.detail}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {otherEntries.map((edu, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: "#FEF3C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        🎓
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#0F2148", margin: 0 }}>{edu.degree}</p>
                        <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>
                          {edu.school} · {edu.period}
                          {edu.badge && (
                            <span
                              style={{
                                marginLeft: 6,
                                backgroundColor: "#DCFCE7",
                                color: "#166534",
                                fontSize: 9,
                                padding: "1px 5px",
                                borderRadius: 10,
                                fontWeight: 600,
                              }}
                            >
                              {edu.badge}
                            </span>
                          )}
                        </p>
                        {edu.detail && (
                          <p style={{ fontSize: 9, color: "#94A3B8", margin: 0 }}>{edu.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>

        {/* Projets */}
        <div>
          <SectionTitle label={sectionLabelProj} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {cv.projects.map((proj, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #BFDBFE",
                  borderRadius: 6,
                  padding: "10px 10px",
                  backgroundColor: proj.star ? "#EFF6FF" : "#F8FAFC",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0F2148",
                    margin: 0,
                    marginBottom: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {proj.star && <span style={{ color: "#F59E0B" }}>★</span>}
                  {proj.title}
                </p>
                <p style={{ fontSize: 9, color: "#475569", margin: 0, marginBottom: 5, lineHeight: 1.4 }}>
                  {proj.desc}
                </p>
                <p style={{ fontSize: 8, color: "#93C5FD", margin: 0, fontFamily: "monospace" }}>{proj.tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid #BFDBFE",
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 9, color: "#94A3B8", margin: 0 }}>{footerText}</p>
        </div>
      </div>
    </div>
  );
}
