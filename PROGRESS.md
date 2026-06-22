# Progress Log

A running log so any session can pick up exactly where the last one stopped.
High-level phase status lives in [ROADMAP.md](ROADMAP.md); this file is the
fine-grained "what did we just do / what's next" scratchpad.

## Current position
- **Phase:** 1 — Events Service
- **Step:** 2 of 7 — repo layer (USER writing it)
- **Status:** schema done, DB seeded (100k events / 60k seats), Navicat connected
  on port 5433. Next: user writes repo queries, Claude reviews.

## Phase 1 — step plan
1. [x] Schema: `events` + `seats` tables + migration mechanism
2. [x] Repo layer — insertEvent, getEventById, findEvents (dynamic optional filters,
       parameterized). User wrote it; reviewed & verified.
3. [ ] Service layer (business logic)
4. [ ] Controller + routes (REST endpoints, search)
5. [x] Seed ~100k rows (done early — services/events/db/seed.sql: 100k events + 60k seats)
6. [ ] Reproduce a slow query, run `EXPLAIN ANALYZE`
7. [ ] Add composite index, document before/after timing

## Environment notes / gotchas
- Workflow: USER writes the application code (repo/service/controller), Claude
  reviews. Do NOT write their app code. Data/seed/infra is fine to provide.
- Host has a NATIVE PostgreSQL 18 (service postgresql-x64-18) on port 5432, so
  the container publishes on **host port 5433** -> 5432 internally. Connect host
  tools (Navicat/psql) to localhost:5433, user `app`, pass `app`, db `tickets`.
  The events service is unaffected (uses internal `postgres:5432`).
- Planned STRETCH phase (user's idea): a frontend admin panel to create events
  via the API. Slot after the backend MVP; keep backend focus first.

## Log
- 2026-06-22 — Resumed after losing session history. Confirmed Phase 0 complete
  (docker-compose + events `/health`). Starting Phase 1, step-by-step teaching mode.
- 2026-06-22 — Step 1 done: wrote `services/events/db/init/001_init.sql` (events +
  seats tables, FK cascade, status/price CHECKs, unique seat constraint, index on
  seats(event_id) only — NO events search index yet, on purpose). Mounted init dir
  into Postgres via docker-compose. Verified tables + `/health` ok.
  Gotcha hit & fixed: a leftover `serious_sht-*` project held ports 5432/3001;
  stopped them. A half-created postgres container had no network — fixed with
  `docker compose down` (kept volume) + `up`.
- 2026-06-22 — Seeded DB via services/events/db/seed.sql (100k events, 60k seats;
  ~2s). Switched workflow: user writes app code, Claude reviews. Discovered native
  PostgreSQL 18 on host port 5432 (caused Navicat auth failures + earlier port
  conflicts); remapped container to host 5433. Navicat connects on 5433.
