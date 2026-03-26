import "server-only";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";
import { db } from "./index";

export async function runMigrations(): Promise<void> {
  if (!db) {
    console.warn("[db] DATABASE_URL manquant — migrations ignorées");
    return;
  }

  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.info("[db] Migrations appliquées");
  } catch (err) {
    console.error(
      "[db] Erreur migration:",
      err instanceof Error ? err.message : String(err)
    );
  }
}
