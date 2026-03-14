import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import {
  createOrder,
  getMyOrder,
  getResturantOrder,
  getRiderOrders,
  GetOrderById,
  changeOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
const router = Router();

router.post("/create", authUser, createOrder);
router.get("/my/order", authUser, getMyOrder);
router.get("/resturant/order", authUser, getResturantOrder);
router.get("/rider/orders", authUser, getRiderOrders);
router.get("/order/:orderId", authUser, GetOrderById);
router.put("/change/status", authUser, changeOrderStatus);
router.get("/cancel/:orderId", authUser, cancelOrder);

export default router;
