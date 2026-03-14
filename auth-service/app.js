import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT;

//RabbitMq
import { connectRabbitMQ } from "./service/publisher.js";

//DB
import { connectRedis } from "./service/redis.js";
import { connectDB } from "./db/db.js";
connectRedis();
connectDB();
connectRabbitMQ();
//Routes
import authRoute from "./routes/auth.routes.js";

//Middleware
app.use(
  cors({
    origin: "https://orvex.onrender.com",
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoute);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "auth-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`auth-service server is running on http://localhost:${PORT}`);
});
