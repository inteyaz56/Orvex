import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT;
const app = express();

import riderRoutes from "./routes/rider.routes.js";

//DB
import { connectDB } from "./config/db.js";

import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startRiderConsumer } from "./consumer/rider.consumer.js";

connectDB();
await connectRabbitMQ();
await startRiderConsumer();

//Miiddlewares
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

app.use("/", riderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Rider-Service",
  });
});

app.listen(PORT, () => {
  console.log(`Rider-Service server is running on http://localhost:${PORT}`);
});
