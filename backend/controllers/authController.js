import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { generateToken } from "../utils/generateToken.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { uploadToCloudinary } from "../middleware/upload.js";

// POST /api/auth/register
export const register = asyncWrapper(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) throw new AppError("Email already registered", 409);

  const newUser = await User.create(validatedData);

  const token = generateToken(newUser._id, newUser.role);

  res.status(201).json({
    token,
    user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
});

// POST /api/auth/login
export const login = asyncWrapper(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const foundUser = await User.findOne({ email });
  if (!foundUser) throw new AppError("Invalid email or password", 401);

  const passwordsMatch = await foundUser.matchPassword(password);
  if (!passwordsMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(foundUser._id, foundUser.role);

  res.json({
    token,
    user: { id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role },
  });
});

// GET /api/auth/profile  (protected)
export const getProfile = asyncWrapper(async (req, res) => {
  res.json({ user: req.user });
});

// PATCH /api/auth/avatar  (protected + multer)
export const updateAvatar = asyncWrapper(async (req, res) => {
  if (!req.file) throw new AppError("No file uploaded", 400);

  // Upload the buffer from memory to Cloudinary, get back the URL
  const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: cloudinaryUrl },
    { new: true }
  ).select("-password");

  res.json({ user: updatedUser });
});
