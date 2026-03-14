import { createClient } from "redis";

import dotenv from "dotenv";
dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Error:", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis Connected");
};
