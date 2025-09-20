import express, { Request, Response } from "express";
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

import connectDB from "./utils/connectDB";

dotenv.config();

const app = express();

// ---------------------------
// Security & CORS middleware
// ---------------------------
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://ecb-carlo.app", // ton custom domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true, // essentiel pour withCredentials
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
app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// ---------------------------
// Serverless handler (Vercel)
// ---------------------------
export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("Serverless handler error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
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
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error("Unknown error");
      console.error("Failed to connect to MongoDB:", error);
    });
}
