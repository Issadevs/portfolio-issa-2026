// instrumentation.ts — s'exécute une fois au démarrage du serveur Next.js
// Vérifie et applique les migrations Drizzle (crée la table si elle n'existe pas)

export async function register() {
  // Uniquement en runtime Node.js (pas Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./lib/db/migrate");
    await runMigrations();
  }
}
