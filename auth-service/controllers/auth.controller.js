import Auth from "../models/auth.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redisClient } from "../service/redis.js";
import { sendOtp, sendOtpForPassWord } from "../service/sendOtp.js";
import { genToken } from "../utils/genToken.js";
import BlacklistedToken from "../models/blacllist.token.model.js";
import jwt from "jsonwebtoken";
import { publishUserCreated } from "../service/publisher.js";

export const registerUser = async (req, res) => {
  try {
    let { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "email and password and role are required !" });
    }

    let userExist = await Auth.findOne({ email });

    if (userExist) {
      return res.status(401).json({ message: "Email already exist " });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await redisClient.setEx(`otp:${email}`, 300, otp);
    await redisClient.setEx(
      `register:${email}`,
      300,
      JSON.stringify({ email, password, role }),
    );
    await sendOtp(email, otp);
    res.status(200).json(otp);
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = await redisClient.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const userData = await redisClient.get(`register:${email}`);

  if (!userData) {
    return res.status(400).json({ message: "Registration session expired" });
  }

  const { password, role } = JSON.parse(userData);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Auth.create({
    email,
    role,
    password: hashedPassword,
    isVerified: true,
  });

  publishUserCreated({
    authId: user._id,
    email: user.email,
    role: user.role,
  });
  await redisClient.del(`otp:${email}`);
  await redisClient.del(`register:${email}`);

  res.status(201).json({ user, message: "Account created successfully" });
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }
    let user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Not verified" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    let token = await genToken(user._id, user.role);
    console.log("Login user ID:", user._id);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token);

    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

export const saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    await Auth.findByIdAndUpdate(userId, {
      fcmToken: token,
    });

    res.status(200).json({
      success: true,
      message: "FCM token saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving token",
    });
  }
};

export const getFcmToken = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Auth.findById(userId).select("fcmToken");

    res.status(200).json({
      success: true,
      token: user?.fcmToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching token",
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    let { oldPassword, newPassword, confirmPassword } = req.body;

    let email = req.user.email;
    console.log("This iss email", email);
    let user = await Auth.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Enterd Wrong Password" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);

    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password must be different from old password",
      });
    }

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    await Auth.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { returnDocument: "after" },
    );
    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOtpForPass = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await redisClient.setEx(`otp:${email}`, 300, otp); // 5 min

    await sendOtpForPassWord(email, otp);

    return res
      .status(200)
      .json({ message: "OTP sent successfully to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const storedOtp = await redisClient.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await redisClient.del(`otp:${email}`);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
