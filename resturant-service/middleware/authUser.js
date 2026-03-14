import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      authId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.log(error);
  }
};
