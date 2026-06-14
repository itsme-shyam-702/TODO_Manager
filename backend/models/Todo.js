import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    priority:    { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate:     { type: Date },
    attachmentUrl: { type: String, default: "" },
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ── PRE hook: auto-populate owner on every find ──
todoSchema.pre(/^find/, function (next) {
  this.populate("owner", "name email");
  next();
});

// ── POST hook: log after delete ───────────────
todoSchema.post("findOneAndDelete", function (doc) {
  if (doc) console.log(`Todo deleted: "${doc.title}" by owner ${doc.owner}`);
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
