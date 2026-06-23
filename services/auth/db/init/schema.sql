-- Phase 2 schema for the Auth service. Lives in the auth service's OWN database
-- (auth-postgres), separate from the events database — database-per-service.

CREATE TABLE users (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           text        NOT NULL UNIQUE,
    password_hash   text        NOT NULL,
    role            text        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at      timestamptz NOT NULL DEFAULT now()
);