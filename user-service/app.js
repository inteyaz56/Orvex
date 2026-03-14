import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT;

//Routes
import uesrRoutes from "./routes/user.routes.js";
import addressRoutes from "./routes/address.routes.js";

//DB
import { connectDB } from "./db/mongo.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startUserConsumer } from "./consumer/user.consumer.js";

connectDB();
await connectRabbitMQ();
await startUserConsumer();

//Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes

app.use("/", uesrRoutes);
app.use("/address", addressRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "USER-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`user-service server is running on http://localhost:${PORT}`);
});
