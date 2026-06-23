import express from "express";
import { pool } from "./db";
import authRouter from "./routes/users";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(express.json());
app.use("/auth", authRouter);

// Liveness + DB connectivity check. Proves the auth service can reach its DB.
app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", service: "auth", db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[auth] listening on port ${PORT}`);
});
