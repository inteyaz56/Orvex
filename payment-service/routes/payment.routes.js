import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/crate.payment.js";
import { authUser } from "../middleware/authUser.js";
const router = Router();

router.post("/create-order", authUser, createOrder);
router.post("/verify-payment", authUser, verifyPayment);
export default router;
