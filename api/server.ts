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

const allowedOrigins = [
  "http://localhost:5173", // Front local
  "http://localhost:5000", // Backend local
];

const vercelPreviewRegex = /^https:\/\/.*\.vercel\.app$/;

// Middleware pour logger toutes les requêtes et leur Origin
app.use((req, _res, next) => {
  console.log("------ CORS Debug ------");
  console.log("Request URL:", req.url);
  console.log("Request Method:", req.method);
  console.log("Origin header:", req.headers.origin);
  console.log("------------------------");
  next();
});

// Middleware CORS avec origine dynamique
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl, same-origin

      if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
        console.log("✅ CORS allowed for:", origin);
        return callback(null, true);
      }

      console.warn("❌ CORS blocked for:", origin);
      callback(new Error("CORS origin not allowed"));
    },
    credentials: true, // nécessaire pour withCredentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Préflight OPTIONS pour toutes les routes
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
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
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
  res.status(200).json({ message: "Server is running" });
});

// ---------------------------
// Error handling
// ---------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ---------------------------
// Local server (only for development)
// ---------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.VITE_PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

// ✅ Export handler pour Vercel
export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
