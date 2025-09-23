import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ quiet: true });
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("tiny"));

const PORT = process.env.GATEWAY_PORT || 8000;
const USERS_TARGET = process.env.USERS_URL || "http://localhost:8001";
const TUITIONS_TARGET = process.env.TUITIONS_URL || "http://localhost:8002";
const PAYMENTS_TARGET = process.env.PAYMENTS_URL || "http://localhost:8003";

app.get("/health", (_, res) => res.json({ ok: true, service: "gateway" }));

app.use(
  "/api/users",
  createProxyMiddleware({
    target: USERS_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
  })
);
app.use(
  "/api/tuitions",
  createProxyMiddleware({
    target: TUITIONS_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/api/tuitions": "" },
  })
);
app.use(
  "/api/payments",
  createProxyMiddleware({
    target: PAYMENTS_TARGET,
    changeOrigin: true,
    pathRewrite: { "^/api/payments": "" },
  })
);

app.listen(PORT, () => console.log(`API Gateway on ${PORT}`));
