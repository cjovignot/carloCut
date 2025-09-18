import express from "express";
import nodemailer from "nodemailer";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.NEXT_PUBLIC_SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.NEXT_PUBLIC_SMTP_USER,
      pass: process.env.NEXT_PUBLIC_SMTP_PASS,
    },
  });
};

// Send project PDF via email
router.post(
  "/send-project/:id",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { recipient, subject, message } = req.body;

      if (!recipient || !subject) {
        return res
          .status(400)
          .json({ message: "Recipient and subject are required" });
      }

      const transporter = createTransporter();

      // Generate PDF URL
      const pdfUrl = `${req.protocol}://${req.get("host")}/api/pdf/project/${
        req.params.id
      }`;

      const mailOptions = {
        from:
          process.env.NEXT_PUBLIC_SMTP_FROM ||
          process.env.NEXT_PUBLIC_SMTP_USER,
        to: recipient,
        subject: subject,
        text: message || "Please find attached the sheet metal order.",
        html: `
        <h2>Sheet Metal Order</h2>
        <p>${message || "Please find attached the sheet metal order."}</p>
        <p>You can download the PDF from: <a href="${pdfUrl}">Download Order</a></p>
        <p>Best regards,<br>${req.user.name}</p>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  }
);

// Send joinery PDF via email
router.post(
  "/send-joinery/:projectId/:joineryId",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { recipient, subject, message } = req.body;

      if (!recipient || !subject) {
        return res
          .status(400)
          .json({ message: "Recipient and subject are required" });
      }

      const transporter = createTransporter();

      const pdfUrl = `${req.protocol}://${req.get("host")}/api/pdf/joinery/${
        req.params.projectId
      }/${req.params.joineryId}`;

      const mailOptions = {
        from:
          process.env.NEXT_PUBLIC_SMTP_FROM ||
          process.env.NEXT_PUBLIC_SMTP_USER,
        to: recipient,
        subject: subject,
        text: message || "Please find attached the sheet metal order.",
        html: `
        <h2>Sheet Metal Order</h2>
        <p>${message || "Please find attached the sheet metal order."}</p>
        <p>You can download the PDF from: <a href="${pdfUrl}">Download Order</a></p>
        <p>Best regards,<br>${req.user.name}</p>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  }
);

export default router;
