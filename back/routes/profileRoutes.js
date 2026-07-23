import express from "express";
import {
  getProfile,
  updateProfile,
  getProfileByUsername,
  toggleFollow
} from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { upload } from "../middlewares/uploadMidleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.patch("/", authMiddleware, upload.single("avatar"), updateProfile);
router.get("/:username", authMiddleware, getProfileByUsername)
router.patch("/:username/follow", authMiddleware, toggleFollow)
export default router;