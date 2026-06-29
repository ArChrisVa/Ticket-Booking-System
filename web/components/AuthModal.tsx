"use client";

import { type FormEvent, useEffect, useState } from "react";
import { login, register } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const m = (e as CustomEvent).detail as "login" | "register";
      setMode(m || "login");
      setErr(null);
      setOpen(true);
    };
    window.addEventListener("open-auth", onOpen);
    return () => window.removeEventListener("open-auth", onOpen);
  }, []);

  if (!open) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      // Register returns the user (no token), so we log in right after to get one.
      if (mode === "register") await register(email, password);
      const { token } = await login(email, password);
      setSession(token, email);
      setOpen(false);
      setEmail("");
      setPassword("");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-tabs">
          <button className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
            Log in
          </button>
          <button className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>
            Sign up
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {err && <p className="err">⚠ {err}</p>}
          <button className="btn full" disabled={busy}>
            {busy ? "…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
