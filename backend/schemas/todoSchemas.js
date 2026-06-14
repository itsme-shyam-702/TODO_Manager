import { z } from "zod";

export const createTodoSchema = z.object({
  title:       z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority:    z.enum(["low", "medium", "high"]).default("medium"),
  dueDate:     z.string().datetime().optional(),
});

export const updateTodoSchema = z.object({
  title:       z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  priority:    z.enum(["low", "medium", "high"]).optional(),
  isCompleted: z.boolean().optional(),
  dueDate:     z.string().datetime().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field required for update" }
);
