import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "../api/routes/auth.js";
import projectRoutes from "../api/routes/projects.js";
import joineryRoutes from "../api/routes/joineries.js";
import sheetRoutes from "../api/routes/sheets.js";
import pdfRoutes from "../api/routes/pdf.js";
import emailRoutes from "../api/routes/email.js";

dotenv.config();

const app = express();

// ---------------------------
// Security & CORS middleware
// ---------------------------
app.use(helmet());

// Origines autorisées (local + prod custom domain + previews vercel)
const allowedOrigins = [
  "http://localhost:5173", // front local
  "http://localhost:5000", // back local
  "https://ecb-carlo.app", // domaine custom
];

const vercelPreviewRegex =
  /^https:\/\/carlo-[a-z0-9]+-cjovignots-projects\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl, etc.
      if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }
      console.warn("❌ Blocked CORS origin:", origin);
      return callback(new Error("CORS origin not allowed"), false);
    },
    credentials: true, // important pour les cookies / withCredentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// OPTIONS preflight
app.options("*", cors());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// MongoDB connection (Serverless safe)
// ---------------------------
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error("MONGODB_URI not defined");
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

// ---------------------------
// Routes
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/joineries", joineryRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/email", emailRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

// ---------------------------
// Error handling
// ---------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Error handler:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ---------------------------
// Local server (only for development)
// ---------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.VITE_PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  });
}

// ---------------------------
// Vercel handler (Serverless)
// ---------------------------
const handler = async (req: any, res: any) => {
  console.log("🔵 Vercel handler called:", req.url);
  await connectDB();
  return app(req, res);
};

export default handler;
