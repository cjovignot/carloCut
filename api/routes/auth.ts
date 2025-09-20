import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Register user (admin only in production)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "employee" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown error" });
    }
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      console.warn("User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (typeof user.comparePassword !== "function") {
      console.error("comparePassword not defined on User model");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

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
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

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
