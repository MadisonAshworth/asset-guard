import { getDatabase } from "@/lib/database";
import { Item } from "@/types/item";

export async function getItems() {
  const db = await getDatabase();
  const docs = await db.items.find().exec();
  return docs.map((doc) => doc.toJSON());
}

export async function markAsSynced(id: string) {
  const db = await getDatabase();
  const doc = await db.items.findOne(id).exec();

  if (!doc) return;

  await doc.patch({
    synced: true,
  });
}

export async function createItem(
  title: string,
  content: string,
  type: "note" | "task",
) {
  const db = await getDatabase();

  await db.items.insert({
    id: crypto.randomUUID(),
    title,
    content,
    type,
    completed: false,
    deleted: false,
    synced: false,
    updatedAt: Date.now(),
  });
}

export async function updateItem(id: string, updates: Partial<Item>) {
  const db = await getDatabase();
  const doc = await db.items.findOne(id).exec();
  if (!doc) return;
  await doc.patch({
    ...updates,
    synced: false,
    updatedAt: Date.now(),
  });
}

export async function deleteItem(id: string) {
  const db = await getDatabase();
  const doc = await db.items.findOne(id).exec();
  if (!doc) return;
  await doc.remove();
}
