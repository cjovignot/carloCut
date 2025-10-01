// routes/upload.ts
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

const uploadRouter = express.Router();
const upload = multer({ dest: "uploads/" }); // dossier temporaire

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // upload sur Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "projects", // dossier Cloudinary
    });

    // supprime le fichier temporaire
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default uploadRouter;
