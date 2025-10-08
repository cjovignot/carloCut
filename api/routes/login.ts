import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * ---------------------------
 * LOGIN USER
 * ---------------------------
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (typeof user.comparePassword !== "function") {
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const isMatch = await user.comparePassword(password);
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
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Login error:", message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: message });
  }
});

export default router;
