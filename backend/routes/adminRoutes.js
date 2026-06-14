import { Router } from "express";
import { getAllUsers, getAllTodos, deleteUser } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);   // every admin route needs both

router.get("/users",         getAllUsers);
router.get("/todos",         getAllTodos);
router.delete("/users/:id",  deleteUser);

export default router;
