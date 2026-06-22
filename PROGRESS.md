# Progress Log

A running log so any session can pick up exactly where the last one stopped.
High-level phase status lives in [ROADMAP.md](ROADMAP.md); this file is the
fine-grained "what did we just do / what's next" scratchpad.

## Current position
- **Phase:** 1 — Events Service
- **Step:** 2 of 7 — repo layer (raw parameterized SQL)
- **Status:** schema done & verified; next is the data-access layer

## Phase 1 — step plan
1. [x] Schema: `events` + `seats` tables + migration mechanism
2. [ ] Repo layer (raw SQL, parameterized queries)
3. [ ] Service layer (business logic)
4. [ ] Controller + routes (REST endpoints, search)
5. [ ] Seed ~100k rows
6. [ ] Reproduce a slow query, run `EXPLAIN ANALYZE`
7. [ ] Add composite index, document before/after timing

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
