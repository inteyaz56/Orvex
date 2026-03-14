import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

export const uploadOnCloudinary = async (filepath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!filepath) return null;
    const uploadResut = await cloudinary.uploader.upload(filepath);
    fs.unlinkSync(filepath);
    return uploadResut.secure_url;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(filepath);
  }
};
