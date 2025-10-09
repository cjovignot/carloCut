import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "admin" | "employee";
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxLength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err instanceof Error ? err : new Error("Password hashing failed"));
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Solution robuste pour serverless/ESM
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
