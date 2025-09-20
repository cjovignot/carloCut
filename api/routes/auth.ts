import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// ---------------------------
// Register
// ---------------------------
router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "employee" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(400).json({ message: error.message });
  }
});

// ---------------------------
// Login
// ---------------------------
router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------
// Get current user
// ---------------------------
router.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
  if (!req.user)
    return res.status(401).json({ message: "User not authenticated" });

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
