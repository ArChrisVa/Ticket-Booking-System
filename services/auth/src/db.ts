import { Pool } from "pg";

// The auth service's OWN connection pool, pointing at its OWN database
// (auth-postgres). It shares nothing with the events database — that's the
// database-per-service / low-coupling design.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
