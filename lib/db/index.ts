import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL?.trim();

// `db` est null si DATABASE_URL n'est pas défini (dev sans DB locale, CI build)
// Les fonctions consommatrices doivent gérer le cas null et retourner des valeurs par défaut.
export const db = url
  ? drizzle(postgres(url, { prepare: false, max: 1 }), { schema })
  : null;
