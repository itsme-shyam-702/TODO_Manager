import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import User from "../models/User.js";

// Verifies JWT and attaches req.user
export const protect = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.userId).select("-password");
  if (!currentUser) throw new AppError("User no longer exists", 401);

  req.user = currentUser;
  next();
});

// Must be used AFTER protect
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new AppError("Admin access required", 403);
  }
  next();
};
