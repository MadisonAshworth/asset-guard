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
  const [editingId, setEditingId] = useState<string | null>(null);

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

    if (editingId) {
      await updateItem(editingId, {
        title,
        content,
        type,
      });
      setEditingId(null);
    } else {
      await createItem(title, content, type);
    }
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
      <h1 className="page-title">AssetGuard</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="user-panel">
          <div className="user-info">
            <p className="user-email">Logged in as: {user.email}</p>
            <p className="role-label">
              <span className={role === "admin" ? "role-admin" : "role-user"}>
                {role}
              </span>
            </p>
          </div>

          <div className="user-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn-primary button-text"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button onClick={logout} className="btn-danger btn-text">
              Logout
            </button>
          </div>
        </div>
      </div>
      <p
        className={`status-text ${
          isOnline ? "status-online" : "status-offline"
        }`}
      >
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

        <button
          onClick={handleAdd}
          className="btn-primary button-text hover:bg-blue-600"
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </div>

      <div className="space-y-3">
        {visibleItems.map((item) => (
          <div key={item.id} className="card">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={
                      item.type === "note" ? "item-type-note" : "item-type-task"
                    }
                  >
                    {item.type}
                  </span>

                  <h3
                    className={`item-title ${
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

              <div className="flex gap-2">
                {item.userId === user.id && (
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setTitle(item.title);
                      setContent(item.content);
                      setType(item.type);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="btn-primary button-text"
                  >
                    Edit
                  </button>
                )}

                {(role === "admin" || item.userId === user.id) && (
                  <button
                    onClick={async () => {
                      await deleteItem(item.id);
                      await loadItems();
                    }}
                    className="btn-danger button-text"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
