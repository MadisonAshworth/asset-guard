import { useEffect, useState } from "react";
import { getItems, markAsSynced } from "@/services/items";
import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/database";
import { getRole } from "@/services/profile";

export function useSync() {
  console.log("useSync running");

  const [online, setOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  async function pullFromCloud() {
    try {
      const db = await getDatabase();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const role = await getRole();

      const query =
        role === "admin"
          ? supabase.from("items").select("*")
          : supabase.from("items").select("*").eq("user_id", user.id);

      const { data, error } = await query;

      if (error) {
        console.error("PULL ERROR:", error);
        return;
      }

      if (!data) return;

      for (const item of data) {
        const existing = await db.items.findOne(item.id).exec();

        if (!existing) {
          await db.items.insert({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            content: item.content ?? "",
            type: item.type,
            completed: item.completed ?? false,
            deleted: item.deleted ?? false,
            synced: true,
            updatedAt: new Date(item.updated_at).getTime(),
          });
        } else {
          await existing.patch({
            title: item.title,
            content: item.content ?? "",
            type: item.type,
            completed: item.completed ?? false,
            deleted: item.deleted ?? false,
            synced: true,
            updatedAt: new Date(item.updated_at).getTime(),
          });
        }
      }

      console.log("Pull complete");
    } catch (err) {
      console.error("Pull failed:", err);
    }
  }

  async function pushToCloud() {
    try {
      console.log("pushToCloud started");
      const items = await getItems();
      console.table(items);
      const unsynced = items.filter((item) => !item.synced);
      console.log("UNSYNCED:", unsynced);

      for (const item of unsynced) {
        console.log("Uploading:", item);

        const { error } = await supabase.from("items").upsert({
          id: item.id,
          user_id: item.userId,
          title: item.title,
          content: item.content,
          type: item.type,
          completed: item.completed,
          deleted: item.deleted,
          updated_at: new Date(item.updatedAt).toISOString(),
        });

        if (error) {
          console.error("SUPABASE ERROR:", error);
        } else {
          console.log("Upload successful:", item.id);

          await markAsSynced(item.id);
          window.dispatchEvent(new Event("items-updated"));
        }
      }
    } catch (err) {
      console.error("pushToCloud FAILED:", err);
    }
  }

  useEffect(() => {
    console.log("useEffect Started");

    const handleOnline = () => {
      console.log("FORCED SYNC");
      setOnline(true);
      pullFromCloud().then(() => {
        pushToCloud();
      });
      console.log("Online");
    };

    const handleOffline = () => {
      setOnline(false);
      console.log("Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) {
      console.log("navigator.onLine = true");
      pushToCloud();
    }

    const interval = setInterval(() => {
      if (navigator.onLine) {
        console.log("navigator.onLine = true");
        pullFromCloud().then(() => {
          pushToCloud();
        });
      }
    }, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return online;
}
