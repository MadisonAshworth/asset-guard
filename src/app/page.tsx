"use client";

import { useEffect, useState } from "react";
import { createItem, getItems, deleteItem, updateItem } from "@/services/items";
import { Item } from "@/types/item";
import { useSync } from "@/hooks/useSync";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { getRole } from "@/services/profile";

export default function Home() {
  const isOnline = useSync();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"note" | "task">("note");
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [role, setRole] = useState<string | null>(null);

  async function loadItems() {
    const data = await getItems();
    setItems(data);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function handleAdd() {
    if (!title.trim()) return;
    await createItem(title, content, type);
    setTitle("");
    setContent("");
    setType("note");
    await loadItems();
    window.dispatchEvent(new Event("online"));
  }

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUser(user);

      const userRole = await getRole();
      setRole(userRole);
      await loadItems();
    };

    init();
  }, []);

  if (!user) {
    return (
      <main className="p-8">
        <p>Loading...</p>
      </main>
    );
  }

  const visibleItems =
    role === "admin"
      ? items
      : user
        ? items.filter((item) => item.userId === user.id)
        : [];

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AssetGuard</h1>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
          <p className="text-sm font-medium">Role: {role ?? "Loading..."}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p
        className={`mb-6 font-medium ${isOnline ? "text-green-600" : "text-red-600"}`}
      >
        {" "}
        {isOnline ? "🟢 Online" : "🔴 Offline"}
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border p-2 rounded"
          rows={4}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "note" | "task")}
          className="border p-2 rounded"
        >
          <option value="note">Note</option>
          <option value="task">Task</option>
        </select>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {item.type === "task" && (
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={async (e) => {
                        await updateItem(item.id, {
                          completed: e.target.checked,
                        });

                        await loadItems();
                      }}
                    />
                  )}

                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {item.type}
                  </span>

                  <h3
                    className={`font-bold ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-600">{item.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {" "}
                  {item.synced ? "☁️ Synced" : "⏳ Local Only"}
                </p>
              </div>

              <button
                onClick={async () => {
                  await deleteItem(item.id);
                  await loadItems();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
