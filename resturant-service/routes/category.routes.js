import { Router } from "express";
import { authUser } from "../middleware/authUser.js";

import {
  createCategory,
  getMyCategory,
  allCategory,
  categoryById,
  toggleCategory,
} from "../controllers/category.controller.js";
const router = Router();
import { upload } from "../middleware/multer.js";
router.post("/create", upload.single("image"), authUser, createCategory);
router.get("/my/category", authUser, getMyCategory);
router.get("/all/category", allCategory);
router.get("/category/:id", categoryById);
router.patch("/toggle/:id", authUser, toggleCategory);

export default router;
