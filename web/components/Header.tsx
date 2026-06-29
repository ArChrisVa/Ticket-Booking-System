"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getEmail, openAuth } from "@/lib/auth";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setEmail(getEmail());
    sync();
    window.addEventListener("authchange", sync);
    return () => window.removeEventListener("authchange", sync);
  }, []);

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <Link href="/" className="logo">🎟️ ticketbox</Link>
        <nav className="hdr-actions">
          {email ? (
            <>
              <span className="hdr-email">{email}</span>
              <button className="btn ghost" onClick={clearSession}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="btn ghost" onClick={() => openAuth("login")}>
                Log in
              </button>
              <button className="btn" onClick={() => openAuth("register")}>
                Sign up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
