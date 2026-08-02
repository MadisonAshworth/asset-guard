"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/";
        return;
      }

      setEmail("");
      setPassword("");
    };

    checkUser();
  }, []);

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      setEmail("");
      setPassword("");

      window.location.href = "/";
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">AssetGuard</h1>

        <p className="login-subtitle">Sign in to continue</p>

        <div className="login-form">
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button onClick={login} className="btn-primary">
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
