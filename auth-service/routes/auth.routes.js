import {
  registerUser,
  verifyOtp,
  login,
  logout,
  getProfile,
  saveFcmToken,
  getFcmToken,
  changePassword,
  sendOtpForPass,
  resetPasswordWithOtp,
} from "../controllers/auth.controller.js";
import Router from "express";
const router = Router();
import { authUser } from "../middleware/authUser.js";

router.post("/register", registerUser);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.get("/logout", authUser, logout);
router.get("/profile", authUser, getProfile);
router.post("/save-fcm-token", authUser, saveFcmToken);
router.get("/fcm-token/:userId", authUser, getFcmToken);
router.post("/change/password", authUser, changePassword);
router.post("/send/otp", sendOtpForPass);
router.post("/update/password", resetPasswordWithOtp);

export default router;
