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
  const [darkMode, setDarkMode] = useState(false);
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
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
  useEffect(() => {
    const handleItemsUpdated = async () => {
      await loadItems();
    };

    window.addEventListener("items-updated", handleItemsUpdated);

    return () => {
      window.removeEventListener("items-updated", handleItemsUpdated);
    };
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
        <div className="user-panel">
          <div className="user-info">
            <p>Logged in as: {user.email}</p>
            <p>
              <span className={role === "admin" ? "role-admin" : "role-user"}>
                {role}
              </span>
            </p>
          </div>

          <div className="user-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-primary"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button onClick={logout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
      <p className={isOnline ? "status-online" : "status-offline"}>
        {isOnline ? "🟢 Online" : "🔴 Offline"}
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="form-control"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="form-control"
          rows={4}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "note" | "task")}
          className="form-control"
        >
          <option value="note">Note</option>
          <option value="task">Task</option>
        </select>

        <button onClick={handleAdd} className="btn-primary hover:bg-blue-600">
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <div key={item.id} className="card">
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

                  <span
                    className={
                      item.type === "note" ? "item-type-note" : "item-type-task"
                    }
                  >
                    {item.type}
                  </span>

                  <h3
                    className={`font-bold ${
                      item.completed ? "line-through opacity-50" : ""
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <p className="item-content">{item.content}</p>

                <p className="item-status">
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
