import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("user-service db connected");
  } catch (error) {
    console.log(error);
  }
};
