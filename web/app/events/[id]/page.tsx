"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { book, getEvent, type EventItem } from "@/lib/api";
import { getToken, openAuth } from "@/lib/auth";

export default function EventDetail() {
  const params = useParams();
  const id = String(params.id);

  const [ev, setEv] = useState<EventItem | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [seatId, setSeatId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [bookErr, setBookErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(setEv)
      .catch((e) => setLoadErr((e as Error).message));
  }, [id]);

  const doBook = async (e: FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      openAuth("login"); // must be logged in to book
      return;
    }
    setBusy(true);
    setResult(null);
    setBookErr(null);
    try {
      const b = await book(token, seatId, id);
      setResult(
        `✅ Booked! Reservation #${b.id} · seat ${b.seat_id}. A confirmation email is on its way.`
      );
    } catch (e) {
      setBookErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loadErr && !ev) {
    return (
      <main className="container">
        <Link href="/" className="back">
          ← All events
        </Link>
        <p className="err">⚠ {loadErr}</p>
      </main>
    );
  }

  if (!ev) {
    return (
      <main className="container">
        <p className="muted">Loading…</p>
      </main>
    );
  }

  return (
    <main className="container detail">
      <Link href="/" className="back">
        ← All events
      </Link>

      <div className="detail-grid">
        <div className="detail-img">🎟️</div>

        <div>
          <span className="card-cat">{ev.category}</span>
          <h1 className="detail-title">{ev.name}</h1>
          <p className="detail-meta">📍 {ev.venue}, {ev.city}</p>
          <p className="detail-meta">🗓️ {new Date(ev.event_date).toLocaleString()}</p>

          <div className="book-box">
            <h3>Get tickets</h3>
            <p className="muted small">
              Enter a seat ID to reserve it. (A visual seat map needs a “list seats”
              endpoint — that’s the next backend step.)
            </p>
            <form onSubmit={doBook}>
              <input
                inputMode="numeric"
                placeholder="Seat ID (e.g. 1)"
                value={seatId}
                onChange={(e) => setSeatId(e.target.value)}
                required
              />
              <button className="btn full" disabled={busy}>
                {busy ? "Reserving…" : "Reserve seat"}
              </button>
            </form>
            {result && <p className="ok">{result}</p>}
            {bookErr && <p className="err">⚠ {bookErr}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
