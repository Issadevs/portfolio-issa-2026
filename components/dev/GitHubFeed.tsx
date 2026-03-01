"use client";

// Feed d'activité GitHub @issadevs — proxy via /api/github-feed
// Le token GitHub reste côté serveur (GITHUB_TOKEN), jamais exposé au client
// Cache 60s côté serveur — protège du rate limit GitHub en prod

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Lang } from "@/hooks/useLang";

interface FeedItem {
  id: string;
  repo: string;
  message: string;
  type: string;
  date: string;
  url: string;
}

interface ApiResponse {
  items?: FeedItem[];
  error?: string;
}

function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return lang === "fr" ? `il y a ${mins}m` : `${mins}m ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return lang === "fr" ? `il y a ${hours}h` : `${hours}h ago`;
  }
  const days = Math.floor(diff / 86400);
  return lang === "fr" ? `il y a ${days}j` : `${days}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  push: "↑",
  create: "+",
  star: "★",
  default: "·",
};

export default function GitHubFeed({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function fetchFeed() {
    setLoading(true);
    setError(false);
    fetch("/api/github-feed")
      .then((r) => r.json() as Promise<ApiResponse>)
      .then((data) => {
        if (data.error || !data.items) throw new Error(data.error ?? "No items");
        setItems(data.items);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchFeed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-mono text-dev-accent text-sm mb-1">
            {"// github.com/issadevs"}
          </h2>
          <h3 className="text-xl font-bold text-dev-text">
            {lang === "fr" ? "Activité récente" : "Recent activity"}
          </h3>
        </motion.div>

        <div className="bg-dev-surface border border-dev-border rounded-xl overflow-hidden">
          {/* En-tête */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dev-border">
            <div className="flex items-center gap-2">
              <GithubIcon />
              <span className="font-mono text-sm text-dev-text">@issadevs</span>
            </div>
            <a
              href="https://github.com/issadevs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-dev-accent font-mono hover:underline"
            >
              {lang === "fr" ? "Voir le profil →" : "View profile →"}
            </a>
          </div>

          {/* Feed */}
          <div className="divide-y divide-dev-border">
            {loading && (
              <div className="p-6 text-center font-mono text-dev-muted text-sm">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {lang === "fr"
                    ? "Chargement de l'activité..."
                    : "Loading activity..."}
                </motion.span>
              </div>
            )}

            {error && (
              <div className="p-6 text-center font-mono text-dev-muted text-sm">
                <p className="text-red-400">
                  {lang === "fr"
                    ? "// Impossible de charger l'activité GitHub"
                    : "// Unable to load GitHub activity"}
                </p>
                <p className="text-dev-muted text-xs mt-2">
                  {lang === "fr"
                    ? "Réessayez dans quelques minutes"
                    : "Please try again in a few minutes"}
                </p>
                <button
                  onClick={fetchFeed}
                  className="mt-3 px-4 py-1.5 border border-dev-border text-dev-muted text-xs rounded hover:border-dev-accent hover:text-dev-accent transition-colors"
                >
                  {lang === "fr" ? "↺ Réessayer" : "↺ Retry"}
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              items.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-dev-surface-2 transition-colors group"
                >
                  <span className="font-mono text-dev-accent text-sm flex-shrink-0 mt-0.5">
                    {TYPE_ICONS[item.type] ?? TYPE_ICONS.default}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-dev-text text-sm font-mono truncate group-hover:text-dev-accent transition-colors">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-dev-muted text-xs font-mono truncate">
                        {item.repo}
                      </span>
                      <span className="text-dev-border">·</span>
                      <span className="text-dev-muted text-xs font-mono flex-shrink-0">
                        {formatDate(item.date, lang)}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}

            {!loading && !error && items.length === 0 && (
              <div className="p-6 text-center font-mono text-dev-muted text-sm">
                {lang === "fr"
                  ? "Aucune activité publique récente"
                  : "No recent public activity"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-dev-text"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
