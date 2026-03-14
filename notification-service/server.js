import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user notification room
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);

    console.log(`User joined room: user_${userId}`);
  });

  // rider room
  socket.on("join_rider_room", (riderId) => {
    socket.join(`rider_${riderId}`);

    console.log(`Rider joined room: rider_${riderId}`);
  });

  // order tracking room
  socket.on("join_order_room", (orderId) => {
    socket.join(`order_${orderId}`);

    console.log(`Socket ${socket.id} joined order_${orderId}`);
  });

  // rider location update
  socket.on("rider_location_update", ({ orderId, latitude, longitude }) => {
    if (!orderId) {
      console.log("Invalid rider location update");
      return;
    }

    console.log("Rider location update:", orderId, latitude, longitude);

    io.to(`order_${orderId}`).emit("live_rider_location", {
      latitude,
      longitude,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Notification-Service running on http://localhost:${PORT}`);
});
