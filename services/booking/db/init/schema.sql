-- Phase 3 schema for the Booking service. Lives in the booking service's OWN
-- database (booking-postgres), separate from events and auth — database-per-service.
--
-- Applied automatically on a fresh volume via /docker-entrypoint-initdb.d.
-- Re-apply after edits:  docker compose down -v && docker compose up -d

-- ---------------------------------------------------------------------------
-- seats: the inventory the booking service owns and reserves. The `status`
-- column is the one the overselling race fights over (Phase 3 centerpiece).
--
-- NOTE: event_id is a PLAIN bigint, NOT a foreign key. The `events` table lives
-- in a DIFFERENT database (the events service), and you can't FK across
-- databases. Cross-service references are by id value only; the DB cannot
-- enforce that the event exists — that's the application's job.
-- ---------------------------------------------------------------------------
CREATE TABLE seats (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id     bigint NOT NULL,                 -- references events service; NO cross-DB FK
    section      text   NOT NULL,
    row_label    text   NOT NULL,
    seat_number  int    NOT NULL,
    price_cents  int    NOT NULL CHECK (price_cents >= 0),
    status       text   NOT NULL DEFAULT 'available'
                 CHECK (status IN ('available', 'reserved', 'booked')),
    -- the same physical seat can't exist twice for one event
    UNIQUE (event_id, section, row_label, seat_number)
);

-- Fast "all seats for an event" lookups (the typical booking query).
CREATE INDEX idx_seats_event_id ON seats (event_id);

-- ---------------------------------------------------------------------------
-- bookings: a reservation record — who booked which seat.
--
-- user_id is a PLAIN bigint (references the auth service's users table, which
-- lives in another database → no cross-DB FK).
-- seat_id IS a real foreign key, because `seats` is in THIS same database —
-- within-database FKs are allowed and enforced.
-- ---------------------------------------------------------------------------
CREATE TABLE bookings (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     bigint NOT NULL,                          -- references auth service; NO cross-DB FK
    seat_id     bigint NOT NULL REFERENCES seats(id),     -- same DB → real FK is fine
    event_id    bigint NOT NULL,                          -- references events service; plain value
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- A seat can only be booked once: enforce it at the DB level as a safety net,
-- on top of the application's locking. (Defense in depth.)
CREATE UNIQUE INDEX idx_bookings_seat_unique ON bookings (seat_id);
