import { Router } from "express";
import {
  getTodos, getTodoById, createTodo, updateTodo, deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(protect);  // all todo routes require login

router.route("/")
  .get(getTodos)
  .post(upload.single("attachment"), createTodo);

router.route("/:id")
  .get(getTodoById)
  .patch(updateTodo)
  .delete(deleteTodo);

export default router;
