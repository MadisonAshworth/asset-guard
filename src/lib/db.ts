import { createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export const itemSchema = {
  title: "items",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    userId: {
      type: "string",
    },
    title: {
      type: "string",
    },
    content: {
      type: "string",
    },
    type: {
      type: "string",
    },
    completed: {
      type: "boolean",
    },
    deleted: {
      type: "boolean",
    },
    synced: {
      type: "boolean",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "userId", "title"],
};

export async function createDatabase() {
  const db = await createRxDatabase({
    name: "assetguarddb_v2",
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    items: {
      schema: itemSchema,
    },
  });

  return db;
}
