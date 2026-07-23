import { Router } from "express";
import { login, register, searchUsers } from "../controllers/authController.js";

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/users/search', searchUsers)
export default router
