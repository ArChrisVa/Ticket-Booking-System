# Ticket Booking Platform — Learning Roadmap (MVP)

An event-driven, microservices ticket-booking backend, built to learn **real-world
backend system design**. Stack: **TypeScript + Node.js**, **PostgreSQL**,
**RabbitMQ**, **Docker Compose**, a hand-built **API Gateway**.

The phases are deliberately ordered: build **one service properly first**, feel each
problem before applying the textbook solution, then stack the next concept.

---

## Phase 0 — Foundations & Local Environment
**Goal:** Run a containerized Node + Postgres app locally.
- Learn: Docker (image vs container), docker-compose, why we containerize.
- Build: monorepo skeleton, `docker-compose.yml` (Postgres + one Node/TS service),
  connect to Postgres and run one query.
- Done when: `docker compose up` gives a Node service that queries Postgres.

## Phase 1 — Events Service (build ONE service properly)
**Goal:** A complete REST service; learn database performance.
- Learn: REST design, layered architecture (route → controller → service → repo),
  SQL, **indexes**, **`EXPLAIN ANALYZE`**.
- Build: `events` + `seats` tables, search endpoints, seed ~100k rows, make a query
  slow, fix it with an index, document before/after timing.
- Big O made concrete: full scan O(n) → index lookup ~O(log n).
- Interview story: "400ms search → EXPLAIN ANALYZE → seq scan → composite index → 4ms."

## Phase 2 — Auth Service & Security
**Goal:** Second service + security foundation.
- Learn: authN vs authZ, JWT, bcrypt, **OWASP Top Ten**.
- Build: register/login/issue JWT, hash passwords, parameterized queries (SQL injection).
- System design: stateless auth lets services verify identity without shared sessions.

## Phase 3 — Booking Service (centerpiece)
**Goal:** Solve the concurrency problem.
- Learn: transactions (ACID), race conditions, pessimistic (`SELECT ... FOR UPDATE`)
  vs optimistic locking.
- Build: reserve seats; first build it naively, reproduce overselling with a concurrent
  load script, then fix with a transaction + row locking.
- Interview story: "Reproduced an overselling race condition, fixed with pessimistic locking."

## Phase 4 — Message Broker & Notification Service (async)
**Goal:** Event-driven architecture, non-blocking design.
- Learn: sync vs async, brokers (producer/consumer/queue), why not block on email.
- Build: add RabbitMQ; Booking publishes `booking.confirmed`, Notification consumes it.
- System design: decoupling + resilience; ties to the Node event loop.

## Phase 5 — API Gateway
**Goal:** Single front door over the services.
- Learn: reverse proxy, centralized cross-cutting concerns, **rate limiting**.
- Build: gateway routes `/auth/*`, `/events/*`, `/bookings/*`; central JWT check; rate limit.
- System design: don't expose internal services; gateway trade-offs (single point of failure).

## Phase 6 — Wire It All Together & Document
**Goal:** One-command run + tell the story.
- Build: full `docker-compose.yml` (gateway, auth, events, booking, notification, Postgres,
  RabbitMQ); strong README with architecture diagram, EXPLAIN ANALYZE results, and a
  "Design Decisions & Trade-offs" section.

---

### Pacing (flexible)
~1–1.5 weeks per phase evenings/weekends → ~6–9 weeks. Slow down on Phase 3.

### Progress
- [ ] Phase 0 — Foundations
- [ ] Phase 1 — Events Service
- [ ] Phase 2 — Auth & Security
- [ ] Phase 3 — Booking (concurrency)
- [ ] Phase 4 — Message Broker
- [ ] Phase 5 — API Gateway
- [ ] Phase 6 — Integration & Docs
