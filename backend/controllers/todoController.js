import Todo from "../models/Todo.js";
import { AppError } from "../utils/AppError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { createTodoSchema, updateTodoSchema } from "../schemas/todoSchemas.js";
import { uploadToCloudinary } from "../middleware/upload.js";

// GET /api/todos
export const getTodos = asyncWrapper(async (req, res) => {
  const { priority, isCompleted, search } = req.query;
  const filter = { owner: req.user._id };

  if (priority)    filter.priority    = priority;
  if (isCompleted) filter.isCompleted = isCompleted === "true";
  if (search)      filter.title       = { $regex: search, $options: "i" };

  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  res.json({ count: todos.length, todos });
});

// GET /api/todos/:id
export const getTodoById = asyncWrapper(async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });
  if (!todo) throw new AppError("Todo not found", 404);
  res.json({ todo });
});

// POST /api/todos
export const createTodo = asyncWrapper(async (req, res) => {
  const validatedData = createTodoSchema.parse(req.body);

  // If a file was uploaded, stream it to Cloudinary and get back the URL
  const attachmentUrl = req.file
    ? await uploadToCloudinary(req.file.buffer, "todo-attachments")
    : "";

  const newTodo = await Todo.create({
    ...validatedData,
    attachmentUrl,
    owner: req.user._id,
  });

  res.status(201).json({ todo: newTodo });
});

// PATCH /api/todos/:id
export const updateTodo = asyncWrapper(async (req, res) => {
  const validatedData = updateTodoSchema.parse(req.body);

  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    validatedData,
    { new: true, runValidators: true }
  );

  if (!updatedTodo) throw new AppError("Todo not found", 404);
  res.json({ todo: updatedTodo });
});

// DELETE /api/todos/:id
export const deleteTodo = asyncWrapper(async (req, res) => {
  const deletedTodo = await Todo.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!deletedTodo) throw new AppError("Todo not found", 404);
  res.json({ message: "Todo deleted successfully" });
});
