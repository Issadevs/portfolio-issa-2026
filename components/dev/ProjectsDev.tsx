"use client";

// Projets Dev Mode : version technique détaillée avec snippets de code
// Choix : Shiki pour la coloration syntaxique côté serveur (injecté via dangerouslySetInnerHTML)
// Les snippets sont hardcodés ici pour éviter une dépendance filesystem côté client

import { motion } from "framer-motion";
import { useState } from "react";
import type { Lang } from "@/hooks/useLang";

interface ProjectsDevProps {
  t: (key: string) => string;
  lang: Lang;
}

type ProjectId = "sfr" | "bookreco" | "petfinder" | "cproject";

const projects: {
  id: ProjectId;
  starred: boolean;
  icon: string;
  stack: string[];
  snippet: { lang: string; code: string };
  architecture: { fr: string; en: string };
  challenges: { fr: string[]; en: string[] };
  metrics: { label: string; value: string }[];
}[] = [
  {
    id: "sfr",
    starred: true,
    icon: "🏢",
    stack: ["Python", "Flask", "Kafka", "Elasticsearch", "Prometheus", "Scikit-learn"],
    architecture: {
      fr: "Flask REST API → Kafka Producer → Kafka Broker → Consumer → Elasticsearch index → Scikit-learn anomaly model → Prometheus metrics → Grafana dashboard",
      en: "Flask REST API → Kafka Producer → Kafka Broker → Consumer → Elasticsearch index → Scikit-learn anomaly model → Prometheus metrics → Grafana dashboard",
    },
    challenges: {
      fr: [
        "Gestion du backpressure Kafka en cas de pic de messages — résolu par un consumer group avec lag monitoring",
        "Faux positifs du modèle ML sur données saisonnières — ajout de features temporelles (heure, jour semaine)",
        "Latence Elasticsearch sur index > 10M docs — optimisation via ILM policy et index rollover",
      ],
      en: [
        "Kafka backpressure during message spikes — solved with consumer group lag monitoring",
        "ML false positives on seasonal data — added temporal features (hour, weekday)",
        "Elasticsearch latency on indexes > 10M docs — optimized with ILM policy and index rollover",
      ],
    },
    metrics: [
      { label: "Latence détection", value: "< 2s" },
      { label: "Faux positifs réduits", value: "-40%" },
      { label: "Uptime pipeline", value: "99.7%" },
    ],
    snippet: {
      lang: "python",
      code: `# Détection d'anomalies en temps réel — pipeline SFR
from kafka import KafkaConsumer
from elasticsearch import Elasticsearch
from sklearn.ensemble import IsolationForest
import json, prometheus_client as prom

ANOMALY_COUNTER = prom.Counter("si_anomalies_total", "Anomalies détectées")

def consume_and_detect(topic: str, model: IsolationForest, es: Elasticsearch):
    consumer = KafkaConsumer(topic, value_deserializer=lambda m: json.loads(m))

    for msg in consumer:
        features = extract_features(msg.value)  # Vectorisation
        score = model.decision_function([features])[0]

        if score < -0.2:  # Seuil calibré sur données historiques
            ANOMALY_COUNTER.inc()
            es.index(index="si-anomalies", document={
                "timestamp": msg.timestamp,
                "score": score,
                "raw": msg.value,
            })`,
    },
  },
  {
    id: "bookreco",
    starred: false,
    icon: "📚",
    stack: ["Python", "Pandas", "Scikit-learn", "NLP", "TF-IDF", "Filtrage collaboratif"],
    architecture: {
      fr: "Dataset (titres + descriptions) → Preprocessing NLP → TF-IDF Vectorizer → Cosine similarity (content-based) + User-Item Matrix → SVD (collaborative) → Score hybride → Top-N recommandations",
      en: "Dataset (titles + descriptions) → NLP Preprocessing → TF-IDF Vectorizer → Cosine similarity (content-based) + User-Item Matrix → SVD (collaborative) → Hybrid score → Top-N recommendations",
    },
    challenges: {
      fr: [
        "Cold start problem : nouvel utilisateur sans historique → fallback sur content-based pur",
        "Scalabilité de la matrice user-item (sparse) → utilisation de scipy.sparse",
        "Sélection du poids hybride α — évalué par NDCG@10 sur test set",
      ],
      en: [
        "Cold start problem: new user with no history → pure content-based fallback",
        "Scalability of user-item matrix (sparse) → scipy.sparse usage",
        "Hybrid weight α selection — evaluated by NDCG@10 on test set",
      ],
    },
    metrics: [
      { label: "Précision @10", value: "68%" },
      { label: "NDCG@10", value: "0.74" },
      { label: "Livres indexés", value: "50k+" },
    ],
    snippet: {
      lang: "python",
      code: `# Approche hybride : content-based + collaborative filtering
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
import numpy as np

class HybridRecommender:
    def __init__(self, alpha: float = 0.6):
        self.alpha = alpha  # Poids content-based vs collaborative
        self.tfidf = TfidfVectorizer(ngram_range=(1, 2), max_features=10_000)

    def fit(self, books_df, ratings_matrix):
        # Content-based : TF-IDF sur descriptions
        self.tfidf_matrix = self.tfidf.fit_transform(books_df["description"])

        # Collaborative : SVD sur matrice user-item
        U, sigma, Vt = svds(ratings_matrix, k=50)
        self.predicted_ratings = U @ np.diag(sigma) @ Vt

    def recommend(self, user_id: int, book_id: int, n: int = 10):
        cb_score = cosine_similarity(
            self.tfidf_matrix[book_id], self.tfidf_matrix
        ).flatten()
        cf_score = self.predicted_ratings[user_id]

        hybrid = self.alpha * cb_score + (1 - self.alpha) * cf_score
        return np.argsort(hybrid)[::-1][:n]`,
    },
  },
  {
    id: "petfinder",
    starred: false,
    icon: "🐾",
    stack: ["Spring Boot", "MyBatis", "Vue.js", "MySQL"],
    architecture: {
      fr: "Vue.js SPA → Axios → Spring Boot REST controllers → MyBatis mappers → MySQL. Auth JWT via Spring Security. Recherche multicritères : requêtes MyBatis dynamiques avec conditions optionnelles.",
      en: "Vue.js SPA → Axios → Spring Boot REST controllers → MyBatis mappers → MySQL. JWT auth via Spring Security. Multi-criteria search: dynamic MyBatis queries with optional conditions.",
    },
    challenges: {
      fr: [
        "Requêtes de recherche multicritères dynamiques — résolues avec MyBatis dynamic SQL (<if> tags)",
        "Performance sur listing paginé — index composite sur (species, age, city)",
        "CORS configuration Spring Boot ↔ Vue.js dev server",
      ],
      en: [
        "Dynamic multi-criteria search queries — solved with MyBatis dynamic SQL (<if> tags)",
        "Performance on paginated listing — composite index on (species, age, city)",
        "CORS configuration Spring Boot ↔ Vue.js dev server",
      ],
    },
    metrics: [
      { label: "Temps réponse API", value: "< 80ms" },
      { label: "Endpoints REST", value: "18" },
      { label: "Coverage tests", value: "76%" },
    ],
    snippet: {
      lang: "xml",
      code: `<!-- MyBatis dynamic SQL — recherche multicritères -->
<select id="searchAnimals" resultType="Animal">
  SELECT * FROM animals
  <where>
    <if test="species != null">
      AND species = #{species}
    </if>
    <if test="ageMax != null">
      AND age &lt;= #{ageMax}
    </if>
    <if test="city != null and city != ''">
      AND city LIKE CONCAT('%', #{city}, '%')
    </if>
    <if test="available != null">
      AND is_available = #{available}
    </if>
  </where>
  ORDER BY created_at DESC
  LIMIT #{limit} OFFSET #{offset}
</select>`,
    },
  },
  {
    id: "cproject",
    starred: false,
    icon: "⚙️",
    stack: ["C pur", "Structures de données", "Algorithmes custom"],
    architecture: {
      fr: "Input utilisateur → Analyse de sentiment (scoring de mots-clés) → Vecteur d'humeur → Algorithme de matching cosinus (implémentation manuelle) → Top-3 suggestions. Mémoire gérée manuellement avec free() explicites.",
      en: "User input → Sentiment analysis (keyword scoring) → Mood vector → Manual cosine matching algorithm → Top-3 suggestions. Memory fully managed with explicit free() calls.",
    },
    challenges: {
      fr: [
        "Absence de stdlib de haut niveau — implémentation de hashmap en C avec linked list",
        "Gestion des memory leaks — Valgrind utilisé pour tracer chaque malloc/free",
        "Normalisation du vecteur d'humeur sans sqrt() flottant — approximation Quake III inverse sqrt",
      ],
      en: [
        "No high-level stdlib — implemented hashmap in C with linked list",
        "Memory leak management — Valgrind used to trace every malloc/free",
        "Mood vector normalization without float sqrt() — Quake III inverse sqrt approximation",
      ],
    },
    metrics: [
      { label: "Memory leaks", value: "0" },
      { label: "Lignes de code", value: "~900" },
      { label: "Dépendances", value: "0" },
    ],
    snippet: {
      lang: "c",
      code: `/* Cosinus similarity entre vecteur humeur et profil média — pur C */
float cosine_similarity(float *a, float *b, int n) {
    float dot = 0.0f, norm_a = 0.0f, norm_b = 0.0f;

    for (int i = 0; i < n; i++) {
        dot    += a[i] * b[i];
        norm_a += a[i] * a[i];
        norm_b += b[i] * b[i];
    }

    /* Inverse sqrt approx (Quake III) pour éviter sqrt() coûteux */
    float inv_norm = q_rsqrt(norm_a * norm_b);
    return dot * inv_norm;
}

/* Recommandation Top-N — O(n log n) avec qsort */
void recommend(UserMood *mood, MediaDB *db, int n) {
    ScoredMedia *scores = malloc(db->count * sizeof(ScoredMedia));
    for (int i = 0; i < db->count; i++) {
        scores[i].media = &db->items[i];
        scores[i].score = cosine_similarity(
            mood->vector, db->items[i].mood_profile, MOOD_DIM
        );
    }
    qsort(scores, db->count, sizeof(ScoredMedia), compare_desc);
    for (int i = 0; i < n && i < db->count; i++)
        print_media(scores[i].media);
    free(scores);
}`,
    },
  },
];

export default function ProjectsDev({ t, lang }: ProjectsDevProps) {
  const [active, setActive] = useState<ProjectId>("sfr");
  const project = projects.find((p) => p.id === active)!;

  return (
    <section id="dev-projects" className="py-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-mono text-dev-accent text-sm mb-1">
            {lang === "fr" ? "// Projets techniques" : "// Technical projects"}
          </h2>
          <h3 className="text-2xl font-bold text-dev-text">
            {t("projects.title")}
          </h3>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs border transition-all ${
                active === p.id
                  ? "border-dev-accent text-dev-accent bg-dev-accent/10"
                  : "border-dev-border text-dev-muted hover:border-dev-accent/40 hover:text-dev-text"
              }`}
            >
              {p.starred && <span className="text-yellow-400">★</span>}
              {p.icon} {p.id}
            </button>
          ))}
        </div>

        {/* Contenu projet */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Colonne gauche : infos */}
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{project.icon}</span>
                <div>
                  <h4 className="text-dev-text font-semibold">
                    {t(`projects.${project.id}.title`)}
                  </h4>
                  <p className="text-dev-muted text-xs font-mono">
                    {t(`projects.${project.id}.category`)}
                  </p>
                </div>
              </div>
              <p className="text-dev-muted text-sm leading-relaxed">
                {t(`projects.${project.id}.description`)}
              </p>

              {/* Stack badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 border border-dev-border text-dev-muted rounded font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <p className="text-dev-accent text-xs font-mono mb-2">
                {"// Architecture"}
              </p>
              <p className="text-dev-muted text-sm font-mono leading-relaxed">
                {project.architecture[lang]}
              </p>
            </div>

            {/* Challenges */}
            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <p className="text-dev-accent text-xs font-mono mb-3">
                {lang === "fr" ? "// Défis & Solutions" : "// Challenges & Solutions"}
              </p>
              <ul className="space-y-2">
                {project.challenges[lang].map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-dev-muted">
                    <span className="text-dev-accent mt-0.5 flex-shrink-0">→</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-dev-surface border border-dev-border rounded-lg p-3 text-center"
                >
                  <p className="text-dev-accent font-mono font-bold text-lg">
                    {m.value}
                  </p>
                  <p className="text-dev-muted text-xs mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite : snippet de code */}
          <div className="bg-dev-surface border border-dev-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-dev-border bg-dev-surface-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-dev-muted text-xs font-mono">
                snippet.{project.snippet.lang}
              </span>
              <span className="ml-auto text-dev-muted text-xs">
                {lang === "fr" ? "Extrait de code réel" : "Real code excerpt"}
              </span>
            </div>
            <pre className="p-4 sm:p-5 overflow-x-auto text-xs font-mono leading-relaxed">
              <CodeHighlight
                code={project.snippet.code}
                lang={project.snippet.lang}
              />
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Coloration syntaxique légère sans Shiki côté client (évite le bundle client lourd)
// Shiki est utilisé pour les cas où le code est prérendu côté serveur
function CodeHighlight({ code, lang: language }: { code: string; lang: string }) {
  // Tokenisation simple avec regex pour les cas clients
  const tokens = tokenize(code, language);
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={token.className}>
          {token.text}
        </span>
      ))}
    </>
  );
}

interface Token {
  text: string;
  className: string;
}

function tokenize(code: string, _lang: string): Token[] {
  const tokens: Token[] = [];
  const lines = code.split("\n");

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (li > 0) tokens.push({ text: "\n", className: "" });

    // Commentaires
    const commentMatch = line.match(/^(\s*)(#.*|\/\/.*|\/\*.*\*\/|<!--.*-->)(.*)$/);
    if (commentMatch) {
      if (commentMatch[1]) tokens.push({ text: commentMatch[1], className: "text-dev-text" });
      tokens.push({ text: commentMatch[2], className: "text-dev-muted italic" });
      if (commentMatch[3]) tokens.push({ text: commentMatch[3], className: "text-dev-text" });
      continue;
    }

    // Traitement token par token avec regex
    let remaining = line;
    while (remaining.length > 0) {
      // Strings
      const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/);
      if (strMatch) {
        tokens.push({ text: strMatch[1], className: "text-yellow-300" });
        remaining = remaining.slice(strMatch[1].length);
        continue;
      }

      // Keywords
      const kwMatch = remaining.match(
        /^(def|class|return|import|from|if|else|elif|for|in|and|or|not|True|False|None|self|const|let|var|function|async|await|new|void|int|float|char|struct|malloc|free|sizeof)\b/
      );
      if (kwMatch) {
        tokens.push({ text: kwMatch[1], className: "text-purple-400" });
        remaining = remaining.slice(kwMatch[1].length);
        continue;
      }

      // Numbers
      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        tokens.push({ text: numMatch[1], className: "text-orange-300" });
        remaining = remaining.slice(numMatch[1].length);
        continue;
      }

      // Types / built-ins
      const typeMatch = remaining.match(
        /^(IsolationForest|KafkaConsumer|Elasticsearch|TfidfVectorizer|HybridRecommender|UserMood|MediaDB|ScoredMedia)\b/
      );
      if (typeMatch) {
        tokens.push({ text: typeMatch[1], className: "text-dev-accent-2" });
        remaining = remaining.slice(typeMatch[1].length);
        continue;
      }

      // Attributs / méthodes
      const attrMatch = remaining.match(/^(\.[a-zA-Z_]\w*)/);
      if (attrMatch) {
        tokens.push({ text: attrMatch[1], className: "text-blue-300" });
        remaining = remaining.slice(attrMatch[1].length);
        continue;
      }

      // Default — caractère par caractère
      tokens.push({ text: remaining[0], className: "text-dev-text" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}
