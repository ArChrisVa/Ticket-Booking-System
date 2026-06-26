import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway" });
});

// Rate limiter OWASP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,            // 100 requests per IP per minute
  standardHeaders: true, 
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down." },
});
app.use(limiter);

// reverse-proxy routing
app.use(
  createProxyMiddleware({ pathFilter: "/auth", target: "http://auth:3002", changeOrigin: true })
);
app.use(
  createProxyMiddleware({ pathFilter: "/events", target: "http://events:3001", changeOrigin: true })
);
app.use(
  createProxyMiddleware({ pathFilter: "/bookings", target: "http://booking:3003", changeOrigin: true })
);

app.listen(PORT, () => {
  console.log(`[gateway] listening on port ${PORT}`);
});
