"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEvent, type EventItem } from "@/lib/api";
import SeatMap from "@/components/SeatMap";

export default function EventDetail() {
  const params = useParams();
  const id = String(params.id);

  const [ev, setEv] = useState<EventItem | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    getEvent(id)
      .then(setEv)
      .catch((e) => setLoadErr((e as Error).message));
  }, [id]);

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
        </div>
      </div>

      <div className="book-box">
        <SeatMap eventId={id} />
      </div>
    </main>
  );
}
