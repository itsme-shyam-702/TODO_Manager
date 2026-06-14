import { Router } from "express";
import { register, login, getProfile, updateAvatar } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/register", register);
router.post("/login",    login);
router.get( "/profile",  protect, getProfile);
router.patch("/avatar",  protect, upload.single("avatar"), updateAvatar);

export default router;
