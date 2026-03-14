import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createProxyMiddleware } from "http-proxy-middleware";
const app = express();
import cors from "cors";
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "https://orvex.onrender.com",
  }),
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/users",
  createProxyMiddleware({
    target: process.env.USER_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/resturants",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
  }),
);

app.use(
  "/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/payments",

  createProxyMiddleware({
    target: process.env.PAYMENT_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/riders",

  createProxyMiddleware({
    target: process.env.RIDER_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVER,
    changeOrigin: true,
  }),
);

app.use(
  "/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVER,
    changeOrigin: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "gateway-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`Gateway server is running on http://localhost:${PORT}`);
});
