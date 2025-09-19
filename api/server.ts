import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "../server/routes/auth";
import projectRoutes from "../server/routes/projects";
import joineryRoutes from "../server/routes/joineries";
import sheetRoutes from "../server/routes/sheets";
import pdfRoutes from "../server/routes/pdf";
import emailRoutes from "../server/routes/email";

dotenv.config();

const app = express();

// ---------------------------
// Security & CORS middleware
// ---------------------------
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173", // frontend dev local
  "https://carlo-cut.vercel.app", // frontend prod
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, curl, serverless
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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

// ---------------------------
// Export handler for Vercel
// ---------------------------
export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
