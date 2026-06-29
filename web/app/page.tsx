"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { listEvents, type EventItem } from "@/lib/api";
import EventCard from "@/components/EventCard";

const MAX_SHOWN = 60; // the API has no LIMIT yet, so we cap what we render

export default function Home() {
  const [all, setAll] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  async function load(params: { city?: string; category?: string } = {}) {
    setLoading(true);
    setError(null);
    try {
      setAll(await listEvents(params));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Build the category pills from the data we actually got back.
  const categories = useMemo(
    () => Array.from(new Set(all.map((e) => e.category).filter(Boolean))).slice(0, 8),
    [all]
  );

  const shown = all.slice(0, MAX_SHOWN);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setCat(null);
    load(city ? { city } : {});
  };

  const pickCategory = (c: string | null) => {
    setCat(c);
    load({ city: city || undefined, category: c || undefined });
  };

  return (
    <main>
      <section className="hero">
        <h1>Find your next event</h1>
        <p>Concerts, sports, theatre and more — booked in seconds.</p>
        <form className="search" onSubmit={onSearch}>
          <input
            placeholder="Search by city…  (e.g. Athens)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn">Search</button>
        </form>
      </section>

      <section className="container">
        <div className="pills">
          <button className={!cat ? "pill on" : "pill"} onClick={() => pickCategory(null)}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={cat === c ? "pill on" : "pill"}
              onClick={() => pickCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="muted">Loading events…</p>}
        {error && (
          <p className="err">⚠ {error} — is the gateway running on :3000? (docker compose up)</p>
        )}

        {!loading && !error && (
          <>
            <p className="muted">
              {all.length} event{all.length === 1 ? "" : "s"} found
              {all.length > MAX_SHOWN ? ` · showing first ${MAX_SHOWN}` : ""}
            </p>
            {shown.length === 0 ? (
              <p className="muted">No events match. Try clearing the search.</p>
            ) : (
              <div className="grid">
                {shown.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
