# Portfolio — Issa KANE

> Ingénieur IA & Data | EFREI Paris Master 1 | Alternance dès février 2026

Portfolio personnel avec deux modes distincts : **CV Mode** (pour les RH) et **Dev Mode** (pour les lead devs), avec switch FR/EN.

---

## Prérequis

- **Node.js** >= 20.9.0
- **npm** >= 10

Le repo fournit un `.nvmrc` pour rester aligné avec la CI :

```bash
nvm use
```

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/issadevs/portfolio-issa-2026
cd portfolio-issa-2026

# 2. Installer les dépendances
# --legacy-peer-deps requis (conflits peer deps framer-motion / react)
npm install --legacy-peer-deps

# 3. Variables d'environnement
# Développement local
cp .env.development.local.example .env.development.local

# Variante simple si tu préfères un seul fichier local
cp .env.local.example .env.local
# Puis éditer le fichier choisi
```

---

## Lancer le projet

> Le binaire `next` global peut être cassé selon l'environnement.
> Utiliser directement le binaire local :

```bash
# Dev (hot reload)
node node_modules/next/dist/bin/next dev

# Build production
node node_modules/next/dist/bin/next build

# Start production (après build)
node node_modules/next/dist/bin/next start
```

Ou via les scripts npm si le binaire global fonctionne :

```bash
npm run dev
npm run build
npm run start
```

---

## Variables d'environnement

Le projet distingue deux contextes :

- `development` : usage local avec `next dev`
- `production` : build/start local de validation ou variables d'environnement de l'hébergeur

Fichiers d'exemple fournis :

- `.env.development.local.example`
- `.env.production.local.example`
- `.env.local.example`

Variables disponibles :

```env
# Public par design (exposées côté client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://issakane.dev
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=false

# Secrets serveur (ne jamais committer)
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=issa.kane@efrei.net
CONTACT_FROM_EMAIL=onboarding@resend.dev

# Optionnel — augmente le rate limit GitHub de 60 à 5 000 req/h
GITHUB_TOKEN=ghp_xxx
GITHUB_USERNAME=issadevs
```

Notes:

- `.env.local`, `.env.development.local` et `.env.production.local` sont ignorés par Git.
- En production, configure ces variables dans Vercel/ton hébergeur au lieu de les versionner.
- `NEXT_PUBLIC_SITE_URL` doit pointer vers `http://localhost:3000` en dev et vers le vrai domaine en prod.
- Si Supabase n'est pas configuré, la homepage continue de fonctionner avec des valeurs par défaut, mais l'admin est désactivée proprement.
- Si Resend n'est pas configuré, le formulaire de contact retourne `503` au lieu de casser la build.
- Si une clé a déjà été partagée publiquement, il faut la **révoquer puis la régénérer**.

---

## Vérification TypeScript

```bash
npm run typecheck
```

## Tests

```bash
npm run test
```

## Tests E2E

```bash
npx playwright install chromium
npm run e2e
```

## Audit sécurité

```bash
npm run audit:security
```

## Vérification complète

```bash
npm run verify
```

---

## Stack technique

| Catégorie  | Technologie             |
|------------|-------------------------|
| Framework  | Next.js 16 App Router   |
| UI runtime | React 19                |
| Typage     | TypeScript strict       |
| Style      | Tailwind CSS            |
| Animations | Framer Motion           |
| WebGL      | Three.js (pur, sans r3f)|
| Shaders    | GLSL natif              |
| i18n       | Custom hook (FR/EN)     |
| Tests      | Vitest + Playwright     |
| Lint       | ESLint 9 flat config    |

---

## Architecture

```
portfolio/
├── app/
│   ├── layout.tsx              # Layout global, metadata, fonts
│   ├── page.tsx                # Page principale — orchestration CV/Dev mode
│   ├── cv/                     # Variante imprimable / partageable du CV
│   ├── admin/                  # Auth magic-link + édition portfolio_settings
│   ├── api/                    # Contact, GitHub feed, callback auth
│   └── globals.css             # Variables CSS, dark mode, scrollbars
│
├── components/
│   ├── cv/                     # Composants CV Mode (light, élégant)
│   │   ├── HeroCV.tsx
│   │   ├── StoryCV.tsx
│   │   ├── ExperienceCV.tsx
│   │   ├── ProjectsCV.tsx
│   │   ├── MotivationCV.tsx
│   │   └── ContactCV.tsx
│   │
│   ├── dev/                    # Composants Dev Mode (dark, dense, terminal)
│   │   ├── WebGLBackground.tsx # Three.js pur + GLSL shaders (sans @react-three/fiber)
│   │   ├── HeroDev.tsx
│   │   ├── Terminal.tsx        # Terminal interactif (Ctrl+K)
│   │   ├── ProjectsDev.tsx
│   │   ├── StackDev.tsx
│   │   ├── GitHubFeed.tsx
│   │   └── PerfBadge.tsx
│   │
│   └── shared/
│       ├── Header.tsx
│       └── GlitchTransition.tsx
│
├── e2e/                        # Parcours Playwright
│
├── hooks/
│   ├── useMode.ts              # Switch CV/Dev + sessionStorage
│   ├── useLang.ts              # FR/EN + localStorage + fade
│   └── useTerminal.ts          # État terminal, historique, autocomplétion
│
├── lib/
│   ├── env/                    # Validation et fallback dev/prod
│   ├── i18n/
│   │   ├── fr.json
│   │   └── en.json
│   ├── monitoring.ts           # Logs serveur structurés
│   ├── profile.ts              # Source de vérité profil/candidat
│   ├── settings.ts             # Singleton portfolio_settings
│   ├── webgl/
│   │   └── shaders.ts          # Vertex + Fragment shaders GLSL
│   └── terminal/
│       └── commands.ts         # Commandes + easter egg "dakar"
│
├── supabase/
│   ├── migrations/             # Schéma SQL versionné
│   └── README.md               # Notes d'exploitation Supabase
│
├── docs/
│   └── DEPLOYMENT.md           # Checklist de mise en ligne
│
├── vitest.config.ts            # Tests unitaires / intégration
├── playwright.config.ts        # Tests e2e
├── eslint.config.mjs           # ESLint flat config
└── .env.local                  # Variables d'environnement (non versionné)
```

---

## Fonctionnalités

### CV Mode (défaut)
- Hero Framer Motion staggered
- Timeline narrative (Sénégal → EFREI → SFR)
- Expériences avec toggle détail
- Projets cards hover
- Section motivation
- Formulaire de contact

### Dev Mode (`< Dev Mode >`)
- Background WebGL — grille GLSL, instanced mesh, 60 fps
- **Terminal** `Ctrl+K` — commandes : `help`, `whoami`, `projects`, `stack`, `xp`, `contact`, `clear`, `exit`
  - Easter egg : `dakar`
  - Historique `↑↓`, autocomplétion `Tab`
- Projets techniques avec snippets réels et métriques
- Stack complète 30+ technos
- GitHub feed @issadevs via API publique
- Badge perf live (FPS, mémoire JS, Lighthouse estimé)

### Switch FR/EN
- Toggle haut droite, persistance `localStorage`, fade subtil

---

## Notes importantes

- `@react-three/fiber` **n'est pas utilisé** — incompatible avec `three@0.183.x`. Le composant `WebGLBackground.tsx` utilise Three.js pur via `useRef` + `useEffect` + `requestAnimationFrame`.
- Three.js doit être importé en **dynamic import avec `ssr: false`** pour éviter les erreurs SSR.
- Framer Motion : toujours importer `type Variants` (sinon erreur TypeScript sur `ease: string`).
- Next 16 n'utilise plus `next lint` : le projet passe désormais par `eslint` en CLI avec `eslint.config.mjs`.
- La CI exécute `lint`, `typecheck`, `tests`, `audit`, `build` et `e2e`.

---

## Supabase

- Le schéma versionné est dans `supabase/migrations/202603220001_portfolio_settings.sql`.
- La table `portfolio_settings` est un singleton forcé avec `id = "default"`.
- Les lectures publiques sont autorisées via RLS.
- Les écritures sont réservées au compte `issa.kane@efrei.net`.
- Voir aussi `supabase/README.md`.

---

## CI

- Le workflow CI est dans `.github/workflows/ci.yml`.
- Il exécute `lint`, `typecheck`, `test`, `build` et `e2e` sur chaque PR et sur `main` / `master`.

---

## SEO & Web App

- `app/robots.ts`
- `app/sitemap.ts`
- `app/manifest.ts`
- `app/opengraph-image.tsx`

Pense à définir `NEXT_PUBLIC_SITE_URL` en production pour générer les bonnes URLs absolues.

---

## Observabilité

- `@vercel/analytics` et `@vercel/speed-insights` sont branchés dans le layout global.
- En dev, laisse `NEXT_PUBLIC_ENABLE_ANALYTICS=false` et `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=false`.
- En production, active-les explicitement ou laisse le fallback prod si tu veux les garder branchés.
- Les routes `/api/contact` et `/api/github-feed` émettent maintenant des logs structurés avec durée, statut et contexte minimal.

---

## Sécurité dépendances

- `npm audit fix` a déjà nettoyé les dépendances transitives corrigeables.
- Il reste actuellement un reliquat `next@14.2.35` signalé par `npm audit`.
- Le correctif npm proposé pour ce point est une migration majeure vers `next@16.2.1`, que je n'ai pas forcée automatiquement.
- En attendant, `next.config.mjs` désactive l'optimizer `next/image` (`images.unoptimized = true`) et le projet n'utilise pas de `rewrites`, ce qui réduit l'exposition pratique de plusieurs advisories `next`.

---

## Déploiement

Checklist minimale :

1. Configurer les variables d'environnement dans Vercel.
2. Révoquer toute clé exposée publiquement puis en générer une nouvelle.
3. Appliquer la migration Supabase.
4. Ajouter le domaine d'email autorisé côté Resend.
5. Vérifier l'URL de redirection Supabase : `/auth/callback?next=/admin`.
6. Lancer `npm run verify` avant chaque mise en production.
7. Lancer `npm run e2e` après `npx playwright install chromium` sur une machine neuve.

---

## Contact

- **Email** : issa.kane@efrei.net
- **GitHub** : [@issadevs](https://github.com/issadevs)
- **LinkedIn** : [@issakane](https://linkedin.com/in/issakane)
