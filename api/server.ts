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
import { createServerlessHandler } from "express-vercel-adapter";

dotenv.config();

const app = express();

// ---------------------------
// Security & CORS middleware
// ---------------------------
app.use(helmet());

// Origines autorisées depuis .env
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.VITE_API_URL, // ton backend déployé (si défini)
  "https://ecb-carlo.app",  // ton domaine prod
].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin) return callback(null, true); // Postman / curl

    // whitelist explicite
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // autoriser toutes les branches preview de vercel
    if (/\.vercel\.app$/.test(origin)) {
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
const handler = createServerlessHandler(app, async () => {
  await connectDB();
});

export default handler;

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
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
    });
}