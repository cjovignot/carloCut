import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";
import { AuthRequest } from "../../shared/types/auth.js";

const router = express.Router();

/**
 * ---------------------------
 * REGISTER USER (accessible à tous)
 * ---------------------------
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role = "employee" } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Crée un nouvel utilisateur
    const user = new User({ name, email, phone, password, role });
    await user.save();

    // Génère un token JWT pour la session
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(400).json({ message });
  }
});

/**
 * ---------------------------
 * LOGIN USER
 * ---------------------------
 */
// router.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     if (typeof user.comparePassword !== "function") {
//       return res.status(500).json({ message: "Server misconfiguration" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || "fallback-secret",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Unknown error";
//     console.error("Login error:", message);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", details: message });
//   }
// });

/**
 * ---------------------------
 * GET CURRENT USER (auth required)
 * ---------------------------
 */
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
