import express from "express";
import PDFDocument from "pdfkit";
import axios from "axios";
import fs from "fs";
import path from "path";
import Project from "../models/Project.js";
import { sheetModels, sheetTypes } from "../../src/constants/sheetModels.js";

const router = express.Router();

router.post("/:id/pdf", async (req, res) => {
  try {
    const { userPhone } = req.body;

    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name phone")
      .populate("joineries.sheets");

    if (!project) return res.status(404).json({ error: "Projet non trouvé" });

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${project.name || "projet"}.pdf"`
    );
    doc.pipe(res);

    // --- Fonction utilitaire pour gérer les sauts de page dynamiques ---
    function checkPageSpace(doc, currentY, blockBottomY) {
      const pageBottom = doc.page.height - doc.page.margins.bottom;
      if (blockBottomY > pageBottom) {
        doc.addPage();
        return doc.page.margins.top; // on recommence en haut de la nouvelle page
      }
      return currentY;
    }

    // --- Réinitialisation automatique de y sur ajout de page manuel ---
    let y = doc.y;
    doc.on("pageAdded", () => {
      y = doc.page.margins.top;
    });

    // --- En-tête ---
    const logoPath = path.join(process.cwd(), "public/pwa-512x512.png");
    try {
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 30, { width: 60 });
      } else {
        doc.fontSize(10).text("(Logo non disponible)", 40, 30);
      }
    } catch {
      doc.fontSize(10).text("(Logo non disponible)", 40, 30);
    }

    // Date export au format DD/MM/YYYY
    const exportDate = new Date();
    const formattedDate = `${String(exportDate.getDate()).padStart(
      2,
      "0"
    )}/${String(exportDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${exportDate.getFullYear()}`;

    doc.fontSize(12).fillColor("#333333").text(formattedDate, 0, 40, {
      align: "right",
    });

    doc.y += 20;

    // --- Titre projet ---
    doc
      .fontSize(22)
      .fillColor("#000000")
      .text(project.name || "Projet", { align: "center" });
    doc.moveDown(2);

    // --- Infos générales ---
    const totalSheets = project.joineries?.reduce((acc, j) => {
      return acc + (j.sheets?.length || 0);
    }, 0);

    const generalInfo = [
      { label: "Nom du projet", value: project.name },
      { label: "Client", value: project.client },
      { label: "Adresse", value: project.address },
      { label: "Notes", value: project.notes },
      {
        label: "QTE Tôles",
        value: `${totalSheets} tôle${totalSheets > 1 ? "s" : ""}`,
      },
      { label: "Créé par", value: project.createdBy?.name || "Inconnu" },
      { label: "Contact", value: "0" + userPhone || "Non renseigné" },
    ];

    const margin = doc.page.margins.left;
    const pageWidth = doc.page.width;
    const tableWidth = pageWidth - 2 * margin;
    const rowHeight = 24;
    const paddingRight = 12;
    const labelWidth = 0.4 * tableWidth;
    const valueWidth = 0.6 * tableWidth - paddingRight;

    // Titre section
    doc
      .fontSize(14)
      .fillColor("#444444")
      .font("Helvetica-Bold")
      .text("Informations générales", margin, y);
    y += 20;

    doc
      .moveTo(margin, y - 5)
      .lineTo(margin + tableWidth, y - 5)
      .strokeColor("#cccccc")
      .lineWidth(1)
      .stroke();
    y = doc.y + 10;

    generalInfo.forEach((info, index) => {
      const bgColor = index % 2 === 0 ? "#f7f7f7" : "#ffffff";

      doc
        .roundedRect(margin - 5, y - 2, tableWidth, rowHeight, 0)
        .fillOpacity(1)
        .fill(bgColor);

      const labelHeight = doc.heightOfString(info.label, { width: labelWidth });
      const valueHeight = doc.heightOfString(info.value, { width: valueWidth });
      const lineHeight = Math.max(labelHeight, valueHeight);
      const offsetY = (rowHeight - lineHeight) / 2;

      doc
        .font("Helvetica-Bold")
        .fillColor("#333333")
        .text(info.label, margin, y + offsetY, {
          width: labelWidth,
          align: "left",
        });

      doc
        .font("Helvetica")
        .fillColor("#000000")
        .text(info.value, margin + labelWidth, y + offsetY, {
          width: valueWidth,
          align: "right",
        });

      y += rowHeight;
    });

    y = doc.y + 40;

    // --- Menuiseries ---
    doc
      .fontSize(14)
      .fillColor("#444444")
      .font("Helvetica-Bold")
      .text("Menuiseries et tôles", margin, y);
    y += 20;

    doc
      .moveTo(margin, y - 5)
      .lineTo(margin + tableWidth, y - 5)
      .strokeColor("#cccccc")
      .lineWidth(1)
      .stroke();
    y = doc.y + 10;

    if (!project.joineries?.length) {
      doc.fontSize(12).text("Aucune menuiserie ajoutée", margin, y);
    } else {
      const imgWidth = 230;
      const imgHeight = 140;
      const colSpacing = 20;

      for (const j of project.joineries) {
        if (!j.sheets?.length) {
          doc.fontSize(12).text("Aucune tôle ajoutée", margin, y);
          y += 20;
          continue;
        }

        for (const s of j.sheets) {
          // --- Récupération du modèle et du label ---
          let imgBuffer = null;
          let profileLabel = "Type inconnu";

          const sheetModel = sheetModels.find((m) => m.id === s.modelId);
          if (sheetModel) {
            const typeEntry = Object.values(sheetTypes).find(
              (t) => t.value === sheetModel.profileType
            );
            profileLabel = typeEntry ? typeEntry.label : sheetModel.profileType;

            if (sheetModel.src) {
              try {
                const response = await axios.get(sheetModel.src, {
                  responseType: "arraybuffer",
                });
                imgBuffer = Buffer.from(response.data, "binary");
              } catch {
                imgBuffer = null;
              }
            }
          }

          // Nom de la menuiserie
          doc
            .fontSize(14)
            .fillColor("#000000")
            .font("Helvetica-Bold")
            .text(`${j.name} (${j.type})`, margin, y, { align: "left" });
          y = doc.y + 10;

          const col1X = margin;
          const col2X = col1X + imgWidth + colSpacing;
          const colWidth2 = tableWidth - imgWidth - colSpacing;

          if (imgBuffer) {
            doc.image(imgBuffer, col1X, y, { fit: [imgWidth, imgHeight] });
          } else {
            doc.fontSize(12).text("(Image non disponible)", col1X, y, {
              width: imgWidth,
              align: "center",
            });
          }

          let infoY = y;
          const infoTable = [
            { label: "Type", value: profileLabel },
            { label: "RAL", value: s.color },
            { label: "Texturé", value: s.textured ? "Oui" : "Non" },
            { label: "Quantité", value: s.quantity },
          ];

          if (s.dimensions) {
            Object.entries(s.dimensions).forEach(([k, v]) => {
              infoTable.push({ label: k, value: `${v}mm` });
            });
          }

          const rowHeightInfo = 20;
          const labelWidth2 = 0.4 * colWidth2;
          const valueWidth2 = 0.6 * colWidth2 - paddingRight;

          infoTable.forEach((row, index) => {
            const bgColor = index % 2 === 0 ? "#f7f7f7" : "#ffffff";

            doc
              .roundedRect(col2X - 5, infoY - 2, colWidth2, rowHeightInfo, 0)
              .fillOpacity(1)
              .fill(bgColor);

            const labelHeight = doc.heightOfString(row.label, {
              width: labelWidth2,
            });
            const valueHeight = doc.heightOfString(row.value, {
              width: valueWidth2,
            });
            const lineHeight = Math.max(labelHeight, valueHeight);
            const offsetY = (rowHeightInfo - lineHeight) / 2;

            doc
              .font("Helvetica-Bold")
              .fillColor("#333333")
              .fontSize(12)
              .text(row.label, col2X, infoY + offsetY, {
                width: labelWidth2,
                align: "left",
              });

            doc
              .font("Helvetica")
              .fillColor("#000000")
              .fontSize(12)
              .text(row.value, col2X + labelWidth2, infoY + offsetY, {
                width: valueWidth2,
                align: "right",
              });

            infoY += rowHeightInfo;
          });

          // Fin du bloc de tôle
          const tableBottom = infoY + 10;

          // Vérifie si le bloc dépasse la page AVANT de tracer
          const newY = checkPageSpace(doc, y, tableBottom);
          if (newY !== y) {
            // on a ajouté une page : redessiner proprement le bloc sur la nouvelle
            y = newY;
            infoY = y;

            if (imgBuffer) {
              doc.image(imgBuffer, col1X, y, { fit: [imgWidth, imgHeight] });
            } else {
              doc.fontSize(12).text("(Image non disponible)", col1X, y, {
                width: imgWidth,
                align: "center",
              });
            }

            infoTable.forEach((row, index) => {
              const bgColor = index % 2 === 0 ? "#f7f7f7" : "#ffffff";
              doc
                .roundedRect(col2X - 5, infoY - 2, colWidth2, rowHeightInfo, 0)
                .fillOpacity(1)
                .fill(bgColor);

              const labelHeight = doc.heightOfString(row.label, {
                width: labelWidth2,
              });
              const valueHeight = doc.heightOfString(row.value, {
                width: valueWidth2,
              });
              const lineHeight = Math.max(labelHeight, valueHeight);
              const offsetY = (rowHeightInfo - lineHeight) / 2;

              doc
                .font("Helvetica-Bold")
                .fillColor("#333333")
                .fontSize(12)
                .text(row.label, col2X, infoY + offsetY, {
                  width: labelWidth2,
                  align: "left",
                });

              doc
                .font("Helvetica")
                .fillColor("#000000")
                .fontSize(12)
                .text(row.value, col2X + labelWidth2, infoY + offsetY, {
                  width: valueWidth2,
                  align: "right",
                });

              infoY += rowHeightInfo;
            });
          }

          // Cadre autour de la tôle
          doc
            .rect(col1X - 5, y - 5, tableWidth, infoY + 10 - y)
            .strokeColor("#cccccc")
            .lineWidth(1)
            .stroke();

          y = infoY + 20;
        }
      }
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur génération PDF" });
  }
});

export default router;