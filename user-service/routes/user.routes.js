import {
  createProfile,
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";
import { authUser } from "../middleware/authUser.js";

import Router from "express";
const router = Router();

router.post("/create/profile", authUser, createProfile);
router.get("/profile", authUser, getMyProfile);
router.put("/update/profile", authUser, updateMyProfile);

export default router;
