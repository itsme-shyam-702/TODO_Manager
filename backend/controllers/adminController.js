import User from "../models/User.js";
import Todo from "../models/Todo.js";
import { AppError } from "../utils/AppError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

// GET /api/admin/users
export const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ count: users.length, users });
});

// GET /api/admin/todos
export const getAllTodos = asyncWrapper(async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json({ count: todos.length, todos });
});

// DELETE /api/admin/users/:id
export const deleteUser = asyncWrapper(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new AppError("You cannot delete your own account", 400);
  }
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) throw new AppError("User not found", 404);

  // Also remove their todos
  await Todo.deleteMany({ owner: req.params.id });

  res.json({ message: "User and their todos deleted" });
});
