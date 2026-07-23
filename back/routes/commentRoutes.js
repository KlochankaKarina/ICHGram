import { Router } from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { createComment, getPostComments } from "../controllers/commentController.js";

const router = Router()
router.post('/:postId', authMiddleware, createComment)
router.get('/:postId', authMiddleware, getPostComments)

export default router
