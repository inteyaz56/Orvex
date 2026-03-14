import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";
import BlacklistedToken from "../models/blacllist.token.model.js";

export const authUser = async (req, res, next) => {
  try {
    let token = req?.cookies?.token || req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const blackListed = await BlacklistedToken.findOne({ token });
    if (blackListed) {
      return res.status(401).json({ message: "Token blacklisted" });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "token not verified" });
    }

    let user = await Auth.findById(decoded.userId);
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
