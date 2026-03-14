import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { upload } from "../middleware/multer.js";
import {
  createResturant,
  getMyResturant,
  AllRestaurants,
  getAllRestaurants,
  getPendingResturants,
  searchRestaurant,
  updateResturant,
  updateBanner,
  approveRestaurant,
  toggleResturant,
  getResturanById,
  getResturantByAuthId,
} from "../controllers/resturant.controller.js";

const router = Router();

router.post("/create", authUser, createResturant);
router.get("/my/resturant", authUser, getMyResturant);
router.get("/all", AllRestaurants);
router.get("/all/resturants", getAllRestaurants);
router.get("/pending/resturants", authUser, getPendingResturants);
router.get("/resturant/search", searchRestaurant);
router.get("/resturant/authId", authUser, getResturantByAuthId);
router.get("/resturant/:id", getResturanById);
router.patch("/approve/resturant/:id", authUser, approveRestaurant);
router.put("/update", upload.single("banner"), authUser, updateResturant);
router.put("/banner", upload.single("banner"), authUser, updateBanner);
router.patch("/toggle", authUser, toggleResturant);
export default router;
