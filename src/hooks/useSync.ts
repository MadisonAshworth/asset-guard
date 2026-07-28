import { useEffect, useState } from "react";
import { getItems, markAsSynced } from "@/services/items";
import { supabase } from "@/lib/supabase";

export function useSync() {
  console.log("useSync running");

  const [online, setOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

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
      pushToCloud();
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
        pushToCloud();
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
