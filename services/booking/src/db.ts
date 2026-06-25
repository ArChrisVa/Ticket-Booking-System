import { Pool } from "pg";

// The booking service's OWN connection pool → its OWN database (booking-postgres).
// Seats + bookings live here, so the seat-reservation transaction and its
// SELECT ... FOR UPDATE lock all happen inside this one database.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
