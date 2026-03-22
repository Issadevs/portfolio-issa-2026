# Supabase

## Contenu

- `migrations/202603220001_portfolio_settings.sql`
  - crée la table `public.portfolio_settings`
  - force le mode singleton avec `id = 'default'`
  - ajoute les contraintes métier
  - active RLS
  - autorise la lecture publique
  - réserve l'écriture au compte `issa.kane@efrei.net`

## Application

Depuis Supabase CLI :

```bash
supabase db push
```

Ou dans l'éditeur SQL Supabase, en collant le contenu de la migration.

## Notes

- Le code Next.js suppose une seule ligne avec `id = 'default'`.
- Si tu avais déjà une ancienne table avec plusieurs lignes, il faut nettoyer les doublons avant d'appliquer cette logique.
