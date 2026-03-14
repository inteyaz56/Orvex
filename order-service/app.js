import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT;
const app = express();

//Routes
import orderRoutes from "./routes/order.routes.js";

//DB

import { connectDB } from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startOrderConsumer } from "./consumer/order.consumer.js";

connectDB();
await connectRabbitMQ();
await startOrderConsumer();

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

app.use("/", orderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Order-Service",
  });
});

app.listen(PORT, () => {
  console.log(`order-service server is running on http://localhost:${PORT}`);
});
