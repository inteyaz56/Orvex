import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT;
const app = express();

//Routes
import notificationRoutes from "./routes/notification.routes.js";
//DB connection
import { connectDB } from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startNotificationConsumer } from "./consumer/consumer.js";

//DB
connectDB();
await connectRabbitMQ();
await startNotificationConsumer();

//Middleware
app.use(cors({ origin: "https://orvex.onrender.com" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Notification service is healthy",
    status: "UP",
    service: "Notification Service",
  });
});
export default app;
