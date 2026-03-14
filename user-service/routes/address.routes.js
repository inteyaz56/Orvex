import {
  addAddress,
  getAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { authUser } from "../middleware/authUser.js";
import { Router } from "express";
const router = Router();

router.post("/add", authUser, addAddress);
router.get("/my/address", authUser, getAddress);
router.delete("/delete/:id", authUser, deleteAddress);

export default router;
