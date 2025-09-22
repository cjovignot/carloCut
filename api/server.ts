// api/server.ts
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
// Allowed origins (gardés depuis ton .env si besoin)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.VITE_API_URL,
  "https://ecb-carlo.app",
].filter(Boolean);

function isOriginAllowed(origin?: string) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  if (/\.vercel\.app$/.test(origin)) return true; // autorise tous les *.vercel.app
  return false;
}

// ---------------------------
// Debug : log des origins arrivants (utile pour vérifier ce que voit le serveur)
app.use((req, _res, next) => {
  console.log("[CORS DEBUG] origin:", req.headers.origin, "method:", req.method, "url:", req.url);
  next();
});

// ---------------------------
// Manual CORS preflight handler - DOIT être exécuté très tôt
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;

  if (origin && isOriginAllowed(origin)) {
    // IMPORTANT : echoer l'origine exacte (ne PAS mettre '*') si tu veux utiliser credentials
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  if (req.method === "OPTIONS") {
    // réponse rapide pour le preflight
    return res.status(204).end();
  }
  next();
});

// ---------------------------
// Security & other middlewares
app.use(helmet());

// fallback to cors package (keeps behaviour consistent)
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin)) return callback(null, true);
    console.warn(`CORS blocked for origin (corsOptions): ${origin}`);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/joineries", joineryRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/email", emailRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

// Error handling
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err instanceof Error ? err : new Error("Unknown error");
  console.error(error.stack);
  res.status(500).json({ message: error.message });
});

// ---------------------------
// Serverless handler (Vercel) - connect DB once
let dbReady: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!dbReady) dbReady = connectDB();
    await dbReady;

    return app(req, res);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Server error");
    console.error("Serverless handler error:", error);
    return res.status(500).json({ message: error.message });
  }
}

// Local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("Allowed origins:", allowedOrigins);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
    });
}