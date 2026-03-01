"use client";

// Section Contact CV Mode — formulaire connecté à /api/contact (Resend)
// Anti-spam : honeypot (champ website caché) + rate limit côté serveur

import { motion } from "framer-motion";
import { useState } from "react";
import type { PortfolioSettings } from "@/lib/settings";
import type { Lang } from "@/hooks/useLang";

interface ContactCVProps {
  t: (key: string) => string;
  settings: PortfolioSettings;
  lang: Lang;
}

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactCV({ t, settings }: ContactCVProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    website: "", // honeypot — invisible aux humains, rempli par les bots
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          website: formData.website,
        }),
      });

      if (res.status === 429) {
        setErrorMsg(t("contact.form.error_rate_limit"));
        setStatus("error");
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setErrorMsg(data.error ?? t("contact.form.error_generic"));
        setStatus("error");
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      setStatus("sent");
      setFormData({ name: "", email: "", company: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setErrorMsg(t("contact.form.error_generic"));
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-cv-text mb-2">
            {t("contact.title")}
          </h2>
          <p className="text-cv-muted">{t("contact.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-10">
          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <InfoItem icon="📍" label={settings.location} />
            <InfoItem
              icon="✉️"
              label="issa.kane@efrei.net"
              href="mailto:issa.kane@efrei.net"
            />
            <InfoItem
              icon="📞"
              label="06 52 52 72 14"
              href="tel:+33652527214"
            />

            {/* Liens sociaux */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com/issadevs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-cv-border rounded-lg text-sm text-cv-muted hover:text-cv-text hover:border-cv-accent/40 transition-colors"
              >
                <GithubIcon />
                @issadevs
              </a>
              <a
                href="https://linkedin.com/in/issakane"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-cv-border rounded-lg text-sm text-cv-muted hover:text-cv-text hover:border-cv-accent/40 transition-colors"
              >
                <LinkedinIcon />
                @issakane
              </a>
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Honeypot — caché visuellement, ignoré par les vrais utilisateurs */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                height: 0,
                width: 0,
                overflow: "hidden",
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t("contact.form.name")}
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                required
              />
              <InputField
                label={t("contact.form.company")}
                value={formData.company}
                onChange={(v) => setFormData({ ...formData, company: v })}
              />
            </div>
            <InputField
              label={t("contact.form.email")}
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              required
            />
            <div>
              <label className="block text-cv-muted text-xs mb-1.5">
                {t("contact.form.message")}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows={4}
                placeholder={t("contact.form.placeholder_message")}
                className="w-full px-3 py-2.5 border border-cv-border rounded-lg text-sm text-cv-text bg-cv-surface focus:outline-none focus:border-cv-accent resize-none placeholder:text-cv-muted/50"
              />
            </div>

            {/* Feedback d'erreur */}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {errorMsg}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="w-full py-3 bg-cv-accent text-white rounded-lg text-sm font-medium hover:bg-cv-accent-light transition-colors disabled:opacity-60"
              whileTap={{ scale: 0.98 }}
            >
              {status === "sending"
                ? t("contact.form.sending")
                : status === "sent"
                  ? `✓ ${t("contact.form.success")}`
                  : t("contact.form.send")}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 text-sm">
      <span>{icon}</span>
      <span className="text-cv-text">{label}</span>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="hover:text-cv-accent transition-colors block">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-cv-muted text-xs mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2.5 border border-cv-border rounded-lg text-sm text-cv-text bg-cv-surface focus:outline-none focus:border-cv-accent placeholder:text-cv-muted/50"
      />
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
