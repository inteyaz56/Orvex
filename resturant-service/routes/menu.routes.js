import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import {
  addMenu,
  getMyMenu,
  getMenuByResturant,
  searchMenuItems,
  getMenuByCategory,
  toggleMenu,
  deleteMenu,
  getMenu,
  getMenuById,
  validateMenus,
} from "../controllers/menu.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/create", upload.single("image"), authUser, addMenu),
  router.get("/my/menu", authUser, getMyMenu);
router.get("/menu/search", searchMenuItems);
router.get("/menu", getMenu);
router.get("/resturant/menu/:id", getMenuByResturant);
router.get("/menu/:id", getMenuById);
router.post("/validate", authUser, validateMenus);
router.get("/category/:categoryId", getMenuByCategory);
router.patch("/toggle/:menuId", authUser, toggleMenu);
router.delete("/delete/:menuId", authUser, deleteMenu);

export default router;
