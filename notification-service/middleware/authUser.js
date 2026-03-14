import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      authId: decoded.userId,
      role: decoded.role,
    };
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
  }
};
