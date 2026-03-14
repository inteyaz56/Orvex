import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT;

//DB
import { connectDB } from "./db/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startResturantConsumer } from "./consumer/resturant.consumer.js";

//Routes
import resturantRoutes from "./routes/resturant.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import menuRoutes from "./routes/menu.routes.js";

//DB
connectDB();
await connectRabbitMQ();
await startResturantConsumer();

//Miidlewares

app.use(
  cors({
    origin: "https://orvex-one.vercel.app",
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

app.use("/", resturantRoutes);
app.use("/category", categoryRoutes);
app.use("/menu", menuRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "resturant-service",
  });
});

app.listen(PORT, () => {
  console.log(
    `resturant-service server is running on http://localhost:${PORT}`,
  );
});
