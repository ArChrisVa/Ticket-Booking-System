# web — storefront (Next.js)

An Eventbrite-style front end for the ticket-booking platform. It talks to the
**API gateway** (`:3000`) only — never to internal services directly.

## How it connects (no CORS)
The browser calls same-origin `/api/*`. Next.js proxies those to the gateway
(see [`next.config.mjs`](./next.config.mjs)):

```
/api/events     -> http://localhost:3000/events
/api/auth/login -> http://localhost:3000/auth/login
/api/bookings   -> http://localhost:3000/bookings
```

## Run it (dev)
1. Start the backend from the repo root: `docker compose up --build`
2. In this folder:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3030

Override the backend target with `GATEWAY_URL` (e.g. when deployed).

## What works today
- **Browse / search events** → `GET /events`
- **Register + login** (JWT stored in localStorage) → `/auth/register`, `/auth/login`
- **Reserve a seat** (by seat ID) → `POST /bookings`

## Known backend follow-ups (to make it richer)
- A **list-seats endpoint** (`GET /seats?event_id=`) → enables a real seat map
  instead of typing a seat ID.
- **`LIMIT`/pagination** on `GET /events` → the UI currently caps display at 60
  but the API still returns every row.
