import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT;
const app = express();

import paymentRoutes from "./routes/payment.routes.js";

import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startOrderConsumer } from "./consumer/order.consumer.js";
await connectRabbitMQ();
await startOrderConsumer();

//Middlewares
app.use(
  cors({
    origin: [
      "https://orvex.onrender.com",
      "https://orvex-one.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", paymentRoutes);

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Payment-Service",
  });
});

app.listen(PORT, () => {
  console.log(`Payment-Service server is running on http://localhost:${PORT} `);
});
