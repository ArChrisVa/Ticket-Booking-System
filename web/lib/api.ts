// Thin client for the backend, reached through Next's /api proxy (see next.config.mjs).

export type EventItem = {
  id: number;
  name: string;
  category: string;
  city: string;
  venue: string;
  event_date: string;
  created_at?: string;
};

export type Booking = {
  id: number;
  user_id: number;
  seat_id: number;
  event_id: number;
  created_at: string;
};

export type SeatStatus = "available" | "reserved" | "booked";

export type Seat = {
  id: number;
  event_id: number;
  section: string;
  row_label: string;
  seat_number: number;
  price_cents: number;
  status: SeatStatus;
};

async function req(path: string, init?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...init,
    // headers LAST so the merged set (Content-Type + any Authorization) wins,
    // instead of being clobbered by init's own headers.
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export function listEvents(
  params: { city?: string; category?: string; event_date?: string } = {}
): Promise<EventItem[]> {
  const q = new URLSearchParams();
  if (params.city) q.set("city", params.city);
  if (params.category) q.set("category", params.category);
  if (params.event_date) q.set("event_date", params.event_date);
  const qs = q.toString();
  return req(`/events${qs ? `?${qs}` : ""}`);
}

export function getEvent(id: string | number): Promise<EventItem> {
  return req(`/events/${id}`);
}

export function register(email: string, password: string) {
  return req(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string): Promise<{ token: string }> {
  return req(`/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function book(
  token: string,
  seat_id: string | number,
  event_id: string | number
): Promise<Booking> {
  return req(`/bookings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ seat_id, event_id }),
  });
}

// The booking service requires a token to view seats (requireAuth on the GET).
export function getEventSeats(
  token: string,
  eventId: string | number
): Promise<Seat[]> {
  return req(`/bookings/seats/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
