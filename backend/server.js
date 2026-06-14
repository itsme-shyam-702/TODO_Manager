import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

import aiRoutes from "./routes/aiRoutes.js";  // at the top

                  // with other app.use() lines

dotenv.config();


const app = express();

// ── Security & Logging ───────────────────────
app.use(helmet());
app.use(morgan("dev"));

// ── CORS ─────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,
  message: { message: "Too many requests, please slow down." },
});
app.use("/api", limiter);

// ── Body Parser ───────────────────────────────
app.use(express.json());

// ── Routes (app.router pattern) ───────────────
app.use("/api/auth",  authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);    

// ── Health check ──────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Global Error Handler ──────────────────────
app.use(errorHandler);



// ── Start ─────────────────────────────────────
connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
