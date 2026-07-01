import express from "express";
import { pool } from "./db";
import bookingRouter from "./routes/booking";
import { initMessaging } from "./messaging";
import { startConsumer } from "./broker/consumer";

const app = express();
const PORT = Number(process.env.PORT) || 3003;

app.use(express.json());
app.use("/bookings", bookingRouter);

// Liveness + DB connectivity check. Proves the booking service can reach its DB.
app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ status: "ok", service: "booking", db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "error", message: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[booking] listening on port ${PORT}`);
});

initMessaging().catch((e) => console.error("[booking] messaging init failed", e));
startConsumer().catch((e) => console.error("[event] consumer failed", e));
