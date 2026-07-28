"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <main className="p-8">
      <h1>Login</h1>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={login}>Login</button>
    </main>
  );
}
