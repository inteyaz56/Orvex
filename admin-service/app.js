import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const PORT = process.env.PORT;
import cookieParser from "cookie-parser";

const app = express();

import adminRoutes from "./routes/admin.routes.js";

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", adminRoutes);

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "UP",
    service: "Admin-Service",
  });
});

app.listen(PORT, () => {
  console.log(`Admin-Service server is running on http://localhost:${PORT}`);
});
