import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Multer pour recevoir le fichier PDF
const upload = multer({ storage: multer.memoryStorage() });

// Fonction pour créer le transporteur SMTP
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Envoyer PDF projet par email
router.post(
  "/send-project/:id",
  authenticate,
  upload.single("file"),
  async (req: AuthRequest, res) => {
    try {
      const { recipient, subject, message } = req.body;

      if (!recipient || !subject) {
        return res
          .status(400)
          .json({ message: "Recipient and subject are required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "PDF attachment is required" });
      }

      const transporter = createTransport();

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipient,
        subject,
        text: message || "Please find attached the sheet metal order.",
        html: `
          <h2>Emeraude Confort Bois</h2>
          <p>${
            message ||
            "Vous trouverez ci-joint les différentes tôles à réaliser."
          }</p>
          <p>Cordialement,<br>${req.user!.name}</p>
        `,
        attachments: [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
            contentType: req.file.mimetype,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Email sent successfully" });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      console.error("Email sending failed:", err);
      res.status(500).json({
        message: "Failed to send email",
        error: err.message,
        stack: err.stack,
      });
    }
  }
);

export default router;
