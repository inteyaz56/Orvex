import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import {
  createRider,
  myProfile,
  changeStatus,
  getPendingRiders,
  getAllRiders,
  getRiderById,
  approveRider,
  updateLocation,
  getAvailableRiders,
  acceptOrder,
  rejectOrder,
  completeOrder,
  updateProfile,
  getAvailableOrders,
} from "../controllers/rider.controller.js";
import { upload } from "../middleware/mutler.js";
const router = Router();

router.post("/create", authUser, createRider);
router.get("/me", authUser, myProfile);
router.patch("/update", upload.single("profilePic"), authUser, updateProfile);
router.get("/all/riders", authUser, getAllRiders);
router.get("/pending/riders", authUser, getPendingRiders);
router.get("/rider/:id", getRiderById);
router.patch("/approve/:id", authUser, approveRider);
router.patch("/status", authUser, changeStatus);
router.post("/location", authUser, updateLocation);
router.get("/available", authUser, getAvailableRiders);
router.get("/orders", authUser, getAvailableOrders);
router.patch("/accept", authUser, acceptOrder);
router.patch("/reject", authUser, rejectOrder);
router.patch("/complete", authUser, completeOrder);

export default router;
