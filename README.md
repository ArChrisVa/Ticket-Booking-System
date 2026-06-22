# Ticket Booking Platform

A learning-focused, event-driven microservices backend for booking event tickets.
Built to practice real-world backend system design.

See [ROADMAP.md](ROADMAP.md) for the full plan and progress.

## Stack
- **TypeScript + Node.js** (Express)
- **PostgreSQL**
- **RabbitMQ** (message broker)
- **Docker Compose** for local orchestration
- Hand-built **API Gateway**

## Services
| Service | Port | Status |
|---|---|---|
| `events` | 3001 | Phase 0 — skeleton (queries Postgres) |
| `auth` | 3002 | planned (Phase 2) |
| `booking` | 3003 | planned (Phase 3) |
| `notification` | — | planned (Phase 4) |
| `gateway` | 3000 | planned (Phase 5) |

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required)
- Node 20+ and npm (for running services without Docker / IDE tooling)

## Run (Phase 0)
```bash
docker compose up --build
```
Then check the Events service is alive and talking to Postgres:
```bash
curl http://localhost:3001/health
# {"status":"ok","db_time":"2026-..."}
```
