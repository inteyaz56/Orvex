import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import {
  getAllPendingResturants,
  getAllPendingRiders,
  approveRestaurant,
  approveRider,
} from "../controllers/admin.controller.js";

const router = Router();
router.get("/pending/resturant", authUser, getAllPendingResturants);
router.get("/pending/riders", authUser, getAllPendingRiders);
router.patch("/approve/resturant/:id", authUser, approveRestaurant);
router.patch("/approve/rider/:id", authUser, approveRider);
export default router;
