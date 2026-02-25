# Portfolio — Issa KANE

> Ingénieur IA & Data | EFREI Paris Master 1 | Alternance dès février 2026

Portfolio personnel avec deux modes distincts : **CV Mode** (pour les RH) et **Dev Mode** (pour les lead devs), avec switch FR/EN.

---

## Prérequis

- **Node.js** >= 18
- **npm** >= 9

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/issadevs/portfolio-issa-2026
cd portfolio-issa-2026

# 2. Installer les dépendances
# --legacy-peer-deps requis (conflits peer deps framer-motion / react)
npm install --legacy-peer-deps

# 3. Variables d'environnement (optionnel)
cp .env.local.example .env.local
# Puis éditer .env.local
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

Créer un fichier `.env.local` à la racine :

```env
# Optionnel — augmente le rate limit GitHub de 60 à 5 000 req/h
GITHUB_TOKEN=ghp_xxx

# Optionnel — URL de production pour les OG tags
NEXT_PUBLIC_SITE_URL=https://issakane.dev
```

---

## Vérification TypeScript

```bash
node node_modules/typescript/lib/_tsc.js --noEmit
```

---

## Stack technique

| Catégorie  | Technologie             |
|------------|-------------------------|
| Framework  | Next.js 14 App Router   |
| Typage     | TypeScript strict       |
| Style      | Tailwind CSS            |
| Animations | Framer Motion           |
| WebGL      | Three.js (pur, sans r3f)|
| Shaders    | GLSL natif              |
| i18n       | Custom hook (FR/EN)     |

---

## Architecture

```
portfolio/
├── app/
│   ├── layout.tsx              # Layout global, metadata, fonts
│   ├── page.tsx                # Page principale — orchestration CV/Dev mode
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
├── hooks/
│   ├── useMode.ts              # Switch CV/Dev + sessionStorage
│   ├── useLang.ts              # FR/EN + localStorage + fade
│   └── useTerminal.ts          # État terminal, historique, autocomplétion
│
├── lib/
│   ├── i18n/
│   │   ├── fr.json
│   │   └── en.json
│   ├── webgl/
│   │   └── shaders.ts          # Vertex + Fragment shaders GLSL
│   └── terminal/
│       └── commands.ts         # Commandes + easter egg "dakar"
│
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

---

## Contact

- **Email** : issa.kane@efrei.net
- **GitHub** : [@issadevs](https://github.com/issadevs)
- **LinkedIn** : [@issakane](https://linkedin.com/in/issakane)
