import { Pool } from "pg";

// A connection pool reuses a small set of DB connections across requests instead of
// opening a new one each time (opening a TCP+auth connection is expensive). The pool
// is created once and shared by the whole service.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
