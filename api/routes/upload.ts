// routes/upload.ts
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const uploadRouter = express.Router();

// ✅ stockage en mémoire (pas d'écriture sur disque)
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ upload du buffer vers Cloudinary via un stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: "projects" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: error.message });
        }

        res.json({ url: result?.secure_url });
      }
    );

    stream.end(req.file.buffer); // envoie le buffer du fichier dans le stream
  } catch (err: any) {
    console.error("Upload route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default uploadRouter;
