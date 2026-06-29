// The browser calls same-origin /api/* (no CORS). Next proxies those to the
// gateway, which then reverse-proxies to the auth / events / booking services.
//   /api/events        -> http://localhost:3000/events
//   /api/auth/login    -> http://localhost:3000/auth/login
//   /api/bookings      -> http://localhost:3000/bookings
// Override the target with GATEWAY_URL when deploying.
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GATEWAY = process.env.GATEWAY_URL || "http://localhost:3000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this folder (a stray lockfile in the home dir
  // otherwise confuses Next's root inference).
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${GATEWAY}/:path*` }];
  },
};

export default nextConfig;
