import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const genToken = async (userId, role) => {
  let token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
