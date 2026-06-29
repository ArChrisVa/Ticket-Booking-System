import Link from "next/link";
import type { EventItem } from "@/lib/api";

const ICONS: Record<string, string> = {
  concert: "🎸",
  music: "🎵",
  sports: "⚽",
  theatre: "🎭",
  theater: "🎭",
  comedy: "😂",
  festival: "🎉",
  conference: "🎤",
};

function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

export default function EventCard({ ev }: { ev: EventItem }) {
  const icon = ICONS[ev.category?.toLowerCase()] ?? "🎟️";
  return (
    <Link href={`/events/${ev.id}`} className="card">
      <div className="card-img">{icon}</div>
      <div className="card-body">
        <div className="card-date">{fmtDate(ev.event_date)}</div>
        <div className="card-title">{ev.name}</div>
        <div className="card-venue">
          {ev.venue} · {ev.city}
        </div>
        <span className="card-cat">{ev.category}</span>
      </div>
    </Link>
  );
}
