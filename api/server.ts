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
// Vérification variables d'environnement
// ---------------------------
if (!process.env.MONGODB_URI) console.error("MONGODB_URI is not defined!");
if (!process.env.JWT_SECRET)
  console.warn(
    "JWT_SECRET not defined! Using fallback-secret temporarily for development."
  );

// ---------------------------
// Middleware
// ---------------------------
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://ecb-carlo.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

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
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Express error:", err.stack || err);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// ---------------------------
// Serverless handler Vercel
// ---------------------------
export default async function handler(req: any, res: any) {
  console.log("Function invoked:", req.url);

  try {
    await connectDB();
    return app(req, res);
  } catch (err: unknown) {
    console.error("Serverless handler error:", err);
    const error =
      err instanceof Error ? err : new Error("Unknown server error");
    return res.status(500).json({ message: error.message });
  }
}

// ---------------------------
// Local dev
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
      console.error("Failed to connect to MongoDB:", err);
    });
}
