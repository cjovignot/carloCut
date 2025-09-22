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
  "http://localhost:5173", // toujours autorisé pour ton frontend en local
  "http://localhost:5000", // si tu tapes l’API directement
  process.env.VITE_API_URL, // backend déployé (Vercel)
  "https://carlo-cut.vercel.app", // ton domaine prod
].filter(Boolean); // enlève les undefined

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

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Body parsing
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
export default async function handler(req: any, res: any) {
  try {
    await connectDB();
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
