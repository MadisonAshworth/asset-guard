import { createDatabase } from "./db";

let dbPromise: ReturnType<typeof createDatabase> | null = null;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }

  return dbPromise;
}
