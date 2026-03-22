# Deployment

## 0. Runtime

- Utiliser `Node.js 20.x` minimum (`20.9.0+`).
- Le repo fournit `.nvmrc`, donc `nvm use` suffit en local.

## 1. Variables d'environnement

Configurer au minimum :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`
- `GITHUB_TOKEN` (optionnel)
- `GITHUB_USERNAME` (optionnel)

## 2. Supabase

Appliquer la migration :

```bash
supabase db push
```

Ou exécuter le SQL de `supabase/migrations/202603220001_portfolio_settings.sql`.

## 3. Resend

- Vérifier le domaine d'envoi.
- Régénérer toute clé déjà exposée.
- Ne jamais versionner la clé API.

## 4. Admin

- Vérifier que le compte `issa.kane@efrei.net` existe côté Supabase Auth.
- Vérifier l'URL de redirection magic link :

```text
https://ton-domaine.com/auth/callback?next=/admin
```

## 5. Validation avant mise en prod

```bash
npm run verify
npm run audit:security
npx playwright install chromium
npm run e2e
```

## 6. Vérifications après déploiement

- `/` charge correctement
- `/cv` s'imprime correctement
- `/api/github-feed` répond
- le formulaire de contact retourne `200` ou `503` explicite si Resend n'est pas configuré
- `/admin` répond sans crash
- les analytics restent désactivées tant que `NEXT_PUBLIC_ENABLE_ANALYTICS` et `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS` sont à `false`
