import express from "express";
import { pool } from "./db";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Liveness + DB connectivity check. Proves the service can reach Postgres.
app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", service: "events", db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[events] listening on port ${PORT}`);
});
