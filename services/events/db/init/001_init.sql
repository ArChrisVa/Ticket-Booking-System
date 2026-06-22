-- Phase 1 schema for the Events service.
--
-- This file is mounted into the Postgres container's /docker-entrypoint-initdb.d
-- directory, so Postgres runs it automatically the first time the database is
-- created (i.e. when the data volume is empty). To re-apply after editing:
--   docker compose down -v   # drops the volume
--   docker compose up --build
--
-- We are intentionally writing raw SQL (no ORM) to learn schema design, indexes,
-- and query planning directly.

-- ---------------------------------------------------------------------------
-- events: the "big" table. We will seed this to ~100k rows and search it by
-- city + category + event_date. Those three columns are the ones the Phase 1
-- index story is built around.
-- ---------------------------------------------------------------------------
CREATE TABLE events (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text        NOT NULL,
    category    text        NOT NULL,   -- filter column (concert/sports/theatre/...)
    city        text        NOT NULL,   -- filter column
    venue       text        NOT NULL,   -- display only
    event_date  timestamptz NOT NULL,   -- filter + sort column
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- seats: child of events (one event has many seats). Phase 3 will fight over
-- the `status` column when we tackle the overselling race condition.
-- ---------------------------------------------------------------------------
CREATE TABLE seats (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id     bigint NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    section      text   NOT NULL,
    row_label    text   NOT NULL,       -- "row" is awkward in SQL; spell it out
    seat_number  int    NOT NULL,
    price_cents  int    NOT NULL CHECK (price_cents >= 0),  -- money as integer cents, never float
    status       text   NOT NULL DEFAULT 'available'
                 CHECK (status IN ('available', 'reserved', 'booked')),
    -- the same physical seat can't exist twice for one event
    UNIQUE (event_id, section, row_label, seat_number)
);

-- Foreign keys are NOT auto-indexed in Postgres. Looking up "all seats for an
-- event" would otherwise scan the whole seats table, so we add this explicitly.
CREATE INDEX idx_seats_event_id ON seats (event_id);

-- NOTE: we deliberately do NOT add an index on events(city, category, event_date)
-- yet. Phase 1's lesson is to first FEEL the slow sequential scan on 100k rows,
-- prove it with EXPLAIN ANALYZE, and only then add the composite index.
