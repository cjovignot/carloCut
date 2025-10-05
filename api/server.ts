// server.ts
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
import uploadRouter from "./routes/upload.js";

import connectDB from "./utils/connectDB.js";

dotenv.config();

const app = express();

// ---------------------------
// Trust proxy (doit être avant tout middleware)
// ---------------------------
app.set("trust proxy", 1);

// ---------------------------
// Security & CORS middleware
// ---------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  process.env.VITE_API_URL,
  "https://carlo-cut.vercel.app",
].filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Toujours répondre aux preflight
app.options("*", cors());

// ---------------------------
// Rate limiting (compatible serverless)
// ---------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req: Request) => {
    // Prend l'IP réelle depuis X-Forwarded-For ou req.ip
    const xff = req.headers["x-forwarded-for"];
    if (typeof xff === "string") return xff.split(",")[0].trim();
    return req.ip;
  },
});

// Appliquer uniquement sur les routes API
app.use("/api", limiter);

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
app.use("/api/upload", uploadRouter);
app.use("/api/export", pdfRoutes);

// Healthcheck
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
let cached = false; // Pour éviter de reconnecter MongoDB à chaque requête

export default async function handler(req: any, res: any) {
  try {
    if (!cached) {
      await connectDB();
      cached = true;
      console.log("MongoDB connected (serverless cache).");
    }
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
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
    });
}
