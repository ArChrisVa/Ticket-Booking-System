"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { book, getEventSeats, type Seat } from "@/lib/api";
import { getToken, openAuth } from "@/lib/auth";

const euro = (cents: number) => `€${(cents / 100).toFixed(0)}`;

export default function SeatMap({ eventId }: { eventId: string }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Seat | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setNeedLogin(true);
      setLoading(false);
      return;
    }
    setNeedLogin(false);
    setLoading(true);
    setError(null);
    try {
      setSeats(await getEventSeats(token, eventId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
    // Reload once the user logs in (the header modal fires this).
    window.addEventListener("authchange", load);
    return () => window.removeEventListener("authchange", load);
  }, [load]);

  // Group seats: section -> row_label -> seats (sorted), so the grid is stable.
  const sections = useMemo(() => {
    const bySection: Record<string, Record<string, Seat[]>> = {};
    for (const s of seats) {
      (bySection[s.section] ??= {});
      (bySection[s.section][s.row_label] ??= []).push(s);
    }
    return Object.keys(bySection)
      .sort()
      .map((section) => ({
        section,
        price: bySection[section][Object.keys(bySection[section])[0]][0]?.price_cents ?? 0,
        rows: Object.keys(bySection[section])
          .sort()
          .map((row) => ({
            row,
            seats: bySection[section][row].sort((a, b) => a.seat_number - b.seat_number),
          })),
      }));
  }, [seats]);

  const reserve = async () => {
    if (!selected) return;
    const token = getToken();
    if (!token) {
      openAuth("login");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const b = await book(token, selected.id, eventId);
      // Reflect the booking locally so the seat turns grey immediately.
      setSeats((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, status: "booked" } : s))
      );
      setDone(`✅ Booked ${selected.section}${selected.row_label}-${selected.seat_number} · reservation #${b.id}`);
      setSelected(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (needLogin) {
    return (
      <div className="seatmap-gate">
        <h3>Get tickets</h3>
        <p className="muted">Log in to view the seat map and book a seat.</p>
        <button className="btn" onClick={() => openAuth("login")}>
          Log in to continue
        </button>
      </div>
    );
  }

  if (loading) return <p className="muted">Loading seats…</p>;
  if (error && seats.length === 0)
    return <p className="err">⚠ {error}</p>;
  if (seats.length === 0)
    return <p className="muted">No seats found for this event yet.</p>;

  return (
    <div className="seatmap">
      <div className="stage">STAGE</div>

      {sections.map(({ section, price, rows }) => (
        <div key={section} className="seatmap-section">
          <h4>
            Section {section} <span className="muted small">· {euro(price)}</span>
          </h4>
          {rows.map(({ row, seats: rowSeats }) => (
            <div key={row} className="seatmap-row">
              <span className="seatmap-rowlabel">{row}</span>
              {rowSeats.map((s) => {
                const isSel = selected?.id === s.id;
                const clickable = s.status === "available";
                return (
                  <button
                    key={s.id}
                    className={`seat ${s.status}${isSel ? " selected" : ""}`}
                    disabled={!clickable}
                    title={`${s.section}${s.row_label}-${s.seat_number} · ${s.status} · ${euro(s.price_cents)}`}
                    onClick={() => clickable && setSelected(isSel ? null : s)}
                  >
                    {s.seat_number}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <div className="seatmap-legend">
        <span><i className="sw available" /> Available</span>
        <span><i className="sw reserved" /> Reserved</span>
        <span><i className="sw booked" /> Booked</span>
        <span><i className="sw selected" /> Selected</span>
      </div>

      {done && <p className="ok">{done}</p>}
      {error && <p className="err">⚠ {error}</p>}

      {selected && (
        <div className="reserve-bar">
          <div>
            <b>{selected.section}{selected.row_label}-{selected.seat_number}</b>
            <span className="muted"> · Section {selected.section} · {euro(selected.price_cents)}</span>
          </div>
          <button className="btn" onClick={reserve} disabled={busy}>
            {busy ? "Reserving…" : `Reserve · ${euro(selected.price_cents)}`}
          </button>
        </div>
      )}
    </div>
  );
}
