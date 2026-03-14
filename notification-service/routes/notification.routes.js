import { Router } from "express";
import {
  getMyNoitifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
} from "../controllers/notification.controller.js";
import { authUser } from "../middleware/authUser.js";
const router = Router();

router.get("/my-notifications", authUser, getMyNoitifications);
router.get("/unread-count", authUser, getUnreadCount);
router.put("/mark-as-read/:id", authUser, markAsRead);
router.put("/mark-all-as-read", authUser, markAllAsRead);
router.delete("/delete/:id", authUser, deleteNotification);
router.delete("/delete-all", authUser, deleteAll);

export default router;
