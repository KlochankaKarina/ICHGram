import { Router } from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { getNotifications} from "../controllers/notificationController.js"

const router = Router();
router.get("/", authMiddleware, getNotifications)
export default router;