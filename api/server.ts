import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import joineryRoutes from "./routes/joineries.js";
import sheetRoutes from "./routes/sheets.js";
import pdfRoutes from "./routes/pdf.js";
import emailRoutes from "./routes/email.js";

import connectDB from "./utils/connectDB.js";

dotenv.config();

const app = express();

// ---------------------------
// Security & CORS middleware
// ---------------------------
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173", // frontend local
  "http://localhost:5000", // API directe
  process.env.VITE_API_URL, // backend déployé (Vercel)
  "https://ecb-carlo.app", // domaine prod
  "https://carlo-cut-git-preview-cjovignots-projects.vercel.app", // preview Vercel
].filter(Boolean);

// fonction utilitaire
function isOriginAllowed(origin?: string): boolean {
  if (!origin) return false;

  // Toujours autoriser en local
  if (origin.startsWith("http://localhost")) return true;

  // En production : stricte whitelist
  if (process.env.VERCEL_ENV === "production") {
    return allowedOrigins.includes(origin);
  }

  // En preview/dev : autoriser tous les *.vercel.app
  if (origin.endsWith(".vercel.app")) return true;

  return false;
}

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin) return callback(null, true); // Postman / curl

    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ---------------------------
// Rate limiting
// ---------------------------
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// ---------------------------
// Body parsing
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err instanceof Error ? err : new Error("Unknown error");
  console.error(error.stack);
  res.status(500).json({ message: error.message });
});

// ---------------------------
// Serverless handler (Vercel)
// ---------------------------
let dbReady: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!dbReady) {
      dbReady = connectDB();
    }
    await dbReady;

    return app(req, res);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Server error");
    console.error("Serverless handler error:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ---------------------------
// Local dev server
// ---------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("Allowed origins:", allowedOrigins);
        console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
    });
}