import express from "express";
import { startConsumer } from "./consumer";

const app = express();
const PORT = Number(process.env.PORT) || 3004;

// A tiny health endpoint so we can tell the service is alive.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "notification" });
});

app.listen(PORT, () => {
  console.log(`[notification] listening on port ${PORT}`);
});

// Start consuming booking.confirmed events from RabbitMQ.
startConsumer().catch((e) => console.error("[notification] consumer failed", e));
