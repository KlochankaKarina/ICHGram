import express from "express";
import { authMiddleware } from "../middlewares/authMidleware.js";
import { getPosts, createPost, deletePost, getPostsByUsername, getFeedPosts, getExplorePosts, toggleLike } from "../controllers/postController.js";
import { upload } from "../middlewares/uploadMidleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.post("/", authMiddleware, upload.single("image"), createPost);
router.delete("/", authMiddleware, deletePost)
router.patch("/:postId/like", authMiddleware, toggleLike)
router.get("/feed", authMiddleware, getFeedPosts)
router.get("/explore", authMiddleware, getExplorePosts)
router.get("/user/:username", authMiddleware, getPostsByUsername)

export default router;