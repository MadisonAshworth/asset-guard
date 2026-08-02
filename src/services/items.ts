import { getDatabase } from "@/lib/database";
import { Item } from "@/types/item";
import { supabase } from "@/lib/supabase";

export async function getItems() {
  const db = await getDatabase();
  const docs = await db.items.find().exec();
  return docs.map((doc) => doc.toJSON());
}

export async function markAsSynced(id: string) {
  const db = await getDatabase();
  const doc = await db.items.findOne(id).exec();

  if (!doc) return;

  console.log("SYNC DOC:", doc.toJSON());

  try {
    await doc.patch({
      synced: true,
    });

    console.log("PATCH SUCCESS");
  } catch (err) {
    console.error("PATCH FAILED:", err);
  }
}

export async function createItem(
  title: string,
  content: string,
  type: "note" | "task",
) {
  const db = await getDatabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not logged in");
  }
  await db.items.insert({
    id: crypto.randomUUID(),
    userId: user.id,
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
  if (!doc) {
    return;
  }
  try {
    await doc.patch({
      ...updates,
      synced: false,
      updatedAt: Date.now(),
    });
    const updatedDoc = await db.items.findOne(id).exec();
    console.log("UPDATED DOC:", updatedDoc?.toJSON());
  } catch (err) {
    console.error("PATCH FAILED:", err);
  }
}

export async function deleteItem(id: string) {
  const db = await getDatabase();
  const doc = await db.items.findOne(id).exec();
  if (!doc) return;
  await doc.remove();
}
