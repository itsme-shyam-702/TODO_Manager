import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true, minlength: 6 },
    role:      { type: String, enum: ["user", "admin"], default: "user" },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// ── PRE hook: hash password before saving ─────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── POST hook: log when a new user is created ─
userSchema.post("save", function (doc) {
  console.log(`New user created: ${doc.email} [${doc.role}]`);
});

// ── Instance method: compare passwords ─────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
