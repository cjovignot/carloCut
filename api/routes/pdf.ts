import express from "express";
import PDFDocument from "pdfkit";
import Project from "../models/Project";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Generate PDF for entire project
router.get("/project/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${project.name}-order.pdf"`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Add content to PDF
    addProjectHeader(doc, project);

    project.joineries.forEach((joinery, index) => {
      if (index > 0) doc.addPage();
      addJoineryContent(doc, joinery, index + 1);
    });

    doc.end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Generate PDF for single joinery
router.get(
  "/joinery/:projectId/:joineryId",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const joinery = project.joineries.id(req.params.joineryId);
      if (!joinery) {
        return res.status(404).json({ message: "Joinery not found" });
      }

      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${joinery.name}-order.pdf"`
      );

      doc.pipe(res);

      addProjectHeader(doc, project);
      addJoineryContent(doc, joinery, 1);

      doc.end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

function addProjectHeader(doc: PDFKit.PDFDocument, project: any) {
  doc.fontSize(20).text("Sheet Metal Order", 50, 50);
  doc
    .fontSize(14)
    .text(`Project: ${project.name}`, 50, 90)
    .text(`Client: ${project.client}`, 50, 110)
    .text(`Address: ${project.address}`, 50, 130)
    .text(`Date: ${project.date.toDateString()}`, 50, 150);

  if (project.notes) {
    doc.text(`Notes: ${project.notes}`, 50, 170);
  }
}

function addJoineryContent(
  doc: PDFKit.PDFDocument,
  joinery: any,
  number: number
) {
  const startY = 220;

  doc
    .fontSize(16)
    .text(`${number}. ${joinery.name} (${joinery.type})`, 50, startY);

  let currentY = startY + 40;

  joinery.sheets.forEach((sheet: any, index: number) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }

    doc
      .fontSize(12)
      .text(`Sheet ${index + 1}:`, 70, currentY)
      .text(`Profile: ${sheet.profileType}`, 90, currentY + 20)
      .text(`Material: ${sheet.material}`, 90, currentY + 35)
      .text(`Color: ${sheet.color}`, 90, currentY + 50)
      .text(`Thickness: ${sheet.thickness}mm`, 90, currentY + 65)
      .text(`Length: ${sheet.length}mm`, 90, currentY + 80)
      .text(`Quantity: ${sheet.quantity}`, 90, currentY + 95)
      .text(
        `Dimensions: ${sheet.dimensions.join(" x ")}mm`,
        90,
        currentY + 110
      );

    // Add simple diagram placeholder
    doc.rect(300, currentY + 20, 200, 100).stroke();
    doc.fontSize(10).text("Technical Diagram", 350, currentY + 65);

    currentY += 150;
  });
}

export default router;
