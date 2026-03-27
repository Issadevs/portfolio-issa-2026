"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Lang } from "@/hooks/useLang";

interface ProjectsDevProps {
  t: (key: string) => string;
  lang: Lang;
}

type ProjectId = "sfr" | "bookreco" | "petfinder" | "cproject" | "sad" | "metavideosync";

interface ProjectEvaluation {
  dataset: { fr: string; en: string };
  protocol: { fr: string; en: string };
}

interface LocalizedLabel {
  fr: string;
  en: string;
}

const projects: {
  id: ProjectId;
  starred: boolean;
  icon: string;
  stack: string[];
  github?: string;
  snippet: { lang: string; code: string };
  architecture: { fr: string; en: string };
  challenges: { fr: string[]; en: string[] };
  metrics: { label: LocalizedLabel; value: string }[];
  evaluation?: ProjectEvaluation;
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
      {
        label: { fr: "Latence détection", en: "Detection latency" },
        value: "< 2s",
      },
      {
        label: { fr: "Faux positifs réduits", en: "False positives reduced" },
        value: "-40%",
      },
      { label: { fr: "Disponibilité pipeline", en: "Pipeline uptime" }, value: "99.7%" },
    ],
    evaluation: {
      dataset: {
        fr: "Données de production SFR — télémétrie SI interne (confidentiel, non publiable)",
        en: "SFR production data — internal IS telemetry (confidential, not publishable)",
      },
      protocol: {
        fr: "Calibration du seuil IsolationForest sur 3 mois d'historique, validation par réduction des alertes faux positifs",
        en: "IsolationForest threshold calibrated on 3 months of history, validated by false positive alert reduction",
      },
    },
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
      { label: { fr: "Précision @10", en: "Precision @10" }, value: "68%" },
      { label: { fr: "NDCG@10", en: "NDCG@10" }, value: "0.74" },
      { label: { fr: "Livres indexés", en: "Indexed books" }, value: "50k+" },
    ],
    evaluation: {
      dataset: {
        fr: "50 000 livres | Books-Crossing dataset (Kaggle)",
        en: "50,000 books | Books-Crossing dataset (Kaggle)",
      },
      protocol: {
        fr: "Split 80/20, top-k = 10, métriques Precision@10 et NDCG@10 calculées sur le jeu de test",
        en: "80/20 split, top-k = 10, Precision@10 and NDCG@10 computed on the test set",
      },
    },
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
    github: "https://github.com/Issadevs/PetFinder",
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
      { label: { fr: "Temps réponse API", en: "API response time" }, value: "< 80ms" },
      { label: { fr: "Endpoints REST", en: "REST endpoints" }, value: "18" },
      { label: { fr: "Couverture tests", en: "Test coverage" }, value: "76%" },
    ],
    evaluation: {
      dataset: {
        fr: "Dataset interne | base MySQL peuplée manuellement pour les tests",
        en: "Internal dataset | MySQL database manually seeded for testing",
      },
      protocol: {
        fr: "Tests unitaires JUnit 5 + MockMvc, coverage mesuré par JaCoCo (76%)",
        en: "Unit tests JUnit 5 + MockMvc, coverage measured with JaCoCo (76%)",
      },
    },
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
    id: "sad",
    starred: true,
    icon: "🧠",
    stack: ["Python", "TensorFlow/Keras", "CNN", "Scikit-learn", "Jupyter Notebook"],
    github: "https://github.com/Issadevs/SAD-Tumeurs-Cerebrales",
    architecture: {
      fr: "IRM Dataset (Kaggle) → Preprocessing numpy/tf.data → CNN (extraction features) + MLP (classification) → Temperature Scaling (calibration confiance) → Decision Engine (seuils multiples) → Report Generator (rapport par patient)",
      en: "MRI Dataset (Kaggle) → numpy/tf.data Preprocessing → CNN (feature extraction) + MLP (classification) → Temperature Scaling (confidence calibration) → Decision Engine (multi-threshold) → Report Generator (per-patient report)",
    },
    challenges: {
      fr: [
        "Overconfidence des CNNs sur données médicales → calibration par Temperature Scaling pour des probabilités fiables",
        "Déséquilibre des classes (no_tumor dominant) → class weights adaptatifs + data augmentation ciblée",
        "Seuils de décision clinique non arbitraires → calibrés sur courbe ROC avec AUC par classe",
      ],
      en: [
        "CNN overconfidence on medical data → Temperature Scaling calibration for reliable probabilities",
        "Class imbalance (no_tumor dominant) → adaptive class weights + targeted data augmentation",
        "Non-arbitrary clinical decision thresholds → calibrated on ROC curve with per-class AUC",
      ],
    },
    metrics: [
      { label: { fr: "Classes tumorales", en: "Tumor classes" }, value: "4" },
      { label: { fr: "Rapports patients", en: "Patient reports" }, value: "20" },
      { label: { fr: "Calibration", en: "Calibration" }, value: "Temp. Scaling" },
    ],
    evaluation: {
      dataset: {
        fr: "Brain Tumor MRI Dataset — Kaggle (masoudnickparvar) · 4 classes : gliome, méningiome, no_tumor, hypophyse",
        en: "Brain Tumor MRI Dataset — Kaggle (masoudnickparvar) · 4 classes: glioma, meningioma, no_tumor, pituitary",
      },
      protocol: {
        fr: "Split train/test, CNN pré-entraîné fine-tuné, calibration post-hoc, seuils décision clinique à 0.85 / 0.60",
        en: "Train/test split, fine-tuned pre-trained CNN, post-hoc calibration, clinical decision thresholds at 0.85 / 0.60",
      },
    },
    snippet: {
      lang: "python",
      code: `# Moteur de décision à seuils multiples — SAD Tumeurs Cérébrales
import numpy as np

CLASSES = ["glioma", "meningioma", "no_tumor", "pituitary"]

def make_decision(probs: np.ndarray, temperature: float = 1.5) -> dict:
    # Temperature Scaling — réduit l'overconfidence du CNN
    logits = np.log(probs + 1e-8)
    calibrated = np.exp(logits / temperature)
    calibrated /= calibrated.sum()

    confidence = float(calibrated.max())
    prediction = CLASSES[calibrated.argmax()]

    if confidence >= 0.85:
        recommendation = "Diagnostic confirmé — transmission immédiate"
        requires_review = False
    elif confidence >= 0.60:
        recommendation = "Révision recommandée — second avis requis"
        requires_review = True
    else:
        recommendation = "Cas ambigu — expertise spécialisée requise"
        requires_review = True

    return {
        "prediction": prediction,
        "confidence": round(confidence, 3),
        "recommendation": recommendation,
        "requires_review": requires_review,
    }`,
    },
  },
  {
    id: "metavideosync",
    starred: false,
    icon: "📱",
    stack: ["React Native", "Expo", "TypeScript", "Swift", "Kotlin", "Docker", "pnpm"],
    architecture: {
      fr: "App RN Expo (iOS + Android) → Pass 1 : scan métadonnées locales sans réseau (QuickTime tags, album, dossier) → Pass 2 : résolution iCloud ciblée via module natif Swift/Kotlin → Classification META / PENDING / NON_META → Backend API → MinIO storage",
      en: "RN Expo App (iOS + Android) → Pass 1: local metadata scan with no network (QuickTime tags, album, folder) → Pass 2: targeted iCloud resolution via Swift/Kotlin native module → META / PENDING / NON_META classification → Backend API → MinIO storage",
    },
    challenges: {
      fr: [
        "Accès aux tags QuickTime non exposés par React Native → module natif custom en Swift (iOS) et Kotlin (Android)",
        "Minimiser les requêtes réseau : Pass 1 locale et sans réseau, Pass 2 uniquement sur les candidats PENDING",
        "Monorepo pnpm avec workspace types partagés entre mobile, backend et infra",
      ],
      en: [
        "QuickTime tags not exposed by React Native → custom native module in Swift (iOS) and Kotlin (Android)",
        "Minimize network requests: Pass 1 local and network-free, Pass 2 only on PENDING candidates",
        "pnpm monorepo with shared TypeScript types between mobile, backend and infra",
      ],
    },
    metrics: [
      { label: { fr: "Plateformes", en: "Platforms" }, value: "iOS + Android" },
      { label: { fr: "Passes classification", en: "Classification passes" }, value: "2" },
      { label: { fr: "Architecture", en: "Architecture" }, value: "Monorepo" },
    ],
    evaluation: {
      dataset: {
        fr: "Galerie téléphone réelle — vidéos Ray-Ban Meta identifiées par tags QuickTime com.apple.quicktime.make",
        en: "Real phone gallery — Ray-Ban Meta videos identified via QuickTime tag com.apple.quicktime.make",
      },
      protocol: {
        fr: "Tests unitaires sur le classifier TS, tests d'intégration Maestro sur iOS/Android, validation Pass 1 sur corpus local",
        en: "Unit tests on TS classifier, Maestro integration tests on iOS/Android, Pass 1 validation on local corpus",
      },
    },
    snippet: {
      lang: "typescript",
      code: `// Pipeline de classification 2 passes — MetaVideoSync
import { MetaMediaScanner } from "@/native/MetaMediaScanner";
import type { MediaAsset, VideoLabel } from "@metavideosync/types";

async function classifyAsset(asset: MediaAsset): Promise<VideoLabel> {
  // Pass 1 — métadonnées locales, zéro réseau
  const album = asset.albumName?.toLowerCase() ?? "";
  const folder = asset.uri.split("/").slice(-2, -1)[0] ?? "";

  if (album.includes("ray-ban") || folder.includes("meta")) {
    return "META";
  }

  if (!asset.mayBeICloud) return "NON_META";

  // Pass 2 — résolution iCloud ciblée (uniquement si PENDING)
  const qtTags = await MetaMediaScanner.resolveQuickTimeTags(asset.uri);

  const isMeta =
    qtTags?.["com.apple.quicktime.make"] === "Meta" &&
    qtTags?.["com.apple.quicktime.model"]?.includes("Ray-Ban");

  return isMeta ? "META" : "NON_META";
}`,
    },
  },
  {
    id: "cproject",
    starred: false,
    icon: "⚙️",
    stack: ["C pur", "Structures de données", "Algorithmes custom"],
    github: "https://github.com/Issadevs/Projet-IA",
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
      { label: { fr: "Fuites mémoire", en: "Memory leaks" }, value: "0" },
      { label: { fr: "Lignes de code", en: "Lines of code" }, value: "~900" },
      { label: { fr: "Dépendances", en: "Dependencies" }, value: "0" },
    ],
    evaluation: {
      dataset: {
        fr: "Dataset perso | ~50 films/livres encodés manuellement avec vecteurs d'humeur",
        en: "Custom dataset | ~50 movies/books manually encoded with mood vectors",
      },
      protocol: {
        fr: "Validation manuelle des Top-3 recommandations, 0 memory leaks validé par Valgrind",
        en: "Manual Top-3 recommendations validation, 0 memory leaks verified with Valgrind",
      },
    },
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

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{project.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-dev-text font-semibold">
                    {t(`projects.${project.id}.title`)}
                  </h4>
                  <p className="text-dev-muted text-xs font-mono">
                    {t(`projects.${project.id}.category`)}
                  </p>
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dev-border text-dev-muted hover:border-dev-accent hover:text-dev-accent rounded-lg text-xs font-mono transition-colors flex-shrink-0"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
              <p className="text-dev-muted text-sm leading-relaxed">
                {t(`projects.${project.id}.description`)}
              </p>

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

            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <p className="text-dev-accent text-xs font-mono mb-2">
                {lang === "fr" ? "Architecture" : "Architecture"}
              </p>
              <p className="text-dev-muted text-sm font-mono leading-relaxed">
                {project.architecture[lang]}
              </p>
            </div>

            <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
              <p className="text-dev-accent text-xs font-mono mb-3">
                {lang === "fr" ? "Défis et solutions" : "Challenges and solutions"}
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

            {project.evaluation && (
              <div className="bg-dev-surface border border-dev-border rounded-xl p-5">
                <p className="text-dev-accent text-xs font-mono mb-3">
                  {lang === "fr" ? "Jeu de données et protocole" : "Dataset and protocol"}
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-dev-muted font-mono">
                      {lang === "fr" ? "dataset : " : "dataset: "}
                    </span>
                    <span className="text-dev-text">{project.evaluation.dataset[lang]}</span>
                  </div>
                  <div>
                    <span className="text-dev-muted font-mono">
                      {lang === "fr" ? "protocole : " : "protocol: "}
                    </span>
                    <span className="text-dev-text">{project.evaluation.protocol[lang]}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div
                  key={`${project.id}-${m.label.en}`}
                  className="bg-dev-surface border border-dev-border rounded-lg p-3 text-center"
                >
                  <p className="text-dev-accent font-mono font-bold text-lg">
                    {m.value}
                  </p>
                  <p className="text-dev-muted text-xs mt-1">{m.label[lang]}</p>
                </div>
              ))}
            </div>
          </div>

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

function CodeHighlight({ code, lang: language }: { code: string; lang: string }) {
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

    const commentMatch = line.match(/^(\s*)(#.*|\/\/.*|\/\*.*\*\/|<!--.*-->)(.*)$/);
    if (commentMatch) {
      if (commentMatch[1]) tokens.push({ text: commentMatch[1], className: "text-dev-text" });
      tokens.push({ text: commentMatch[2], className: "text-dev-muted italic" });
      if (commentMatch[3]) tokens.push({ text: commentMatch[3], className: "text-dev-text" });
      continue;
    }

    let remaining = line;
    while (remaining.length > 0) {
      const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/);
      if (strMatch) {
        tokens.push({ text: strMatch[1], className: "text-yellow-300" });
        remaining = remaining.slice(strMatch[1].length);
        continue;
      }

      const kwMatch = remaining.match(
        /^(def|class|return|import|from|if|else|elif|for|in|and|or|not|True|False|None|self|const|let|var|function|async|await|new|void|int|float|char|struct|malloc|free|sizeof)\b/
      );
      if (kwMatch) {
        tokens.push({ text: kwMatch[1], className: "text-purple-400" });
        remaining = remaining.slice(kwMatch[1].length);
        continue;
      }

      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        tokens.push({ text: numMatch[1], className: "text-orange-300" });
        remaining = remaining.slice(numMatch[1].length);
        continue;
      }

      const typeMatch = remaining.match(
        /^(IsolationForest|KafkaConsumer|Elasticsearch|TfidfVectorizer|HybridRecommender|UserMood|MediaDB|ScoredMedia)\b/
      );
      if (typeMatch) {
        tokens.push({ text: typeMatch[1], className: "text-dev-accent-2" });
        remaining = remaining.slice(typeMatch[1].length);
        continue;
      }

      const attrMatch = remaining.match(/^(\.[a-zA-Z_]\w*)/);
      if (attrMatch) {
        tokens.push({ text: attrMatch[1], className: "text-blue-300" });
        remaining = remaining.slice(attrMatch[1].length);
        continue;
      }

      tokens.push({ text: remaining[0], className: "text-dev-text" });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}
