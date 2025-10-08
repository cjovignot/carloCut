import express from "express";
import PDFDocument from "pdfkit";
import axios from "axios";
import fs from "fs";
import path from "path";
import Project from "../../shared/types/project.js";
import { sheetModels, sheetTypes } from "../../src/constants/sheetModels.js";
import { IJoinery } from "../../shared/types/joinery.js";

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
    function checkAndAddPage(
      doc: PDFKit.PDFDocument,
      y: number,
      blockHeight: number
    ): number {
      const pageBottom = doc.page.height - doc.page.margins.bottom;
      if (y + blockHeight > pageBottom) {
        doc.addPage();
        return doc.page.margins.top;
      }
      return y;
    }

    // Réinitialise y automatiquement après ajout de page
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

    // Espace minimum sous l'en-tête
    const headerBottom = 100;
    if (doc.y < headerBottom) {
      doc.y = headerBottom;
    } else {
      doc.moveDown(2);
    }
    y = doc.y;

    // --- Titre projet ---
    doc
      .fontSize(22)
      .fillColor("#000000")
      .text(project.name || "Projet", { align: "center" });
    doc.moveDown(2);
    y = doc.y;

    // --- Infos générales ---
    const totalSheets = project.joineries?.reduce(
      (acc: number, j: IJoinery) => acc + (j.sheets?.length || 0),
      0
    );

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
          // Récupérer le modèle et type lisible
          const sheetModel = sheetModels.find((m) => m.id === s.modelId);
          const typeEntry = sheetModel
            ? Object.values(sheetTypes).find(
                (t) => t.value === sheetModel.profileType
              )
            : null;
          const profileLabel = typeEntry ? typeEntry.label : "Type inconnu";

          // Préparer le tableau de détails
          const infoTable = [
            { label: "Type", value: profileLabel },
            { label: "RAL", value: s.color },
            { label: "Texturé", value: s.textured ? "Oui" : "Non" },
            { label: "Quantité", value: s.quantity },
          ];
          if (s.dimensions) {
            Object.entries(s.dimensions).forEach(([k, v]) =>
              infoTable.push({ label: k, value: `${v}mm` })
            );
          }
          const rowHeightInfo = 20;
          const tableHeight = infoTable.length * rowHeightInfo;

          // Calcul hauteur totale du bloc (nom + image + tableau + padding)
          const nameHeight = doc.heightOfString(`${j.name} (${j.type})`, {
            width: tableWidth,
          });
          const paddingBlock = 20;
          const blockHeight =
            nameHeight + imgHeight + tableHeight + paddingBlock;

          // Vérifier si le bloc tient dans l'espace restant
          y = checkAndAddPage(doc, y, blockHeight);

          // Dessiner nom menuiserie
          doc
            .font("Helvetica-Bold")
            .fontSize(14)
            .fillColor("#000")
            .text(`${j.name} (${j.type})`, margin, y);
          y += nameHeight + 10;

          // Dessiner image
          if (sheetModel?.src) {
            try {
              const response = await axios.get(sheetModel.src, {
                responseType: "arraybuffer",
              });
              const imgBuffer = Buffer.from(response.data, "binary");
              doc.image(imgBuffer, margin, y, { fit: [imgWidth, imgHeight] });
            } catch {
              doc.fontSize(12).text("(Image non disponible)", margin, y, {
                width: imgWidth,
                align: "center",
              });
            }
          } else {
            doc.fontSize(12).text("(Image non disponible)", margin, y, {
              width: imgWidth,
              align: "center",
            });
          }

          // Dessiner tableau à côté de l'image
          let infoY = y;
          const col2X = margin + imgWidth + colSpacing;
          const colWidth2 = tableWidth - imgWidth - colSpacing;
          const labelWidth2 = 0.4 * colWidth2;
          const valueWidth2 = 0.6 * colWidth2 - paddingRight;

          infoTable.forEach((row, index) => {
            const bgColor = index % 2 === 0 ? "#f7f7f7" : "#fff";
            doc
              .roundedRect(col2X - 5, infoY - 2, colWidth2, rowHeightInfo, 0)
              .fillOpacity(1)
              .fill(bgColor);

            const lineHeight = Math.max(
              doc.heightOfString(row.label, { width: labelWidth2 }),
              doc.heightOfString(row.value, { width: valueWidth2 })
            );
            const offsetY = (rowHeightInfo - lineHeight) / 2;

            doc
              .font("Helvetica-Bold")
              .fontSize(12)
              .fillColor("#333")
              .text(row.label, col2X, infoY + offsetY, {
                width: labelWidth2,
                align: "left",
              });
            doc
              .font("Helvetica")
              .fontSize(12)
              .fillColor("#000")
              .text(row.value, col2X + labelWidth2, infoY + offsetY, {
                width: valueWidth2,
                align: "right",
              });

            infoY += rowHeightInfo;
          });

          // Cadre autour de la tôle
          const tableBottom = infoY + 10;
          doc
            .rect(margin - 5, y - 5, tableWidth, tableBottom - y)
            .strokeColor("#ccc")
            .lineWidth(1)
            .stroke();

          y = tableBottom + 10; // mettre à jour y pour le bloc suivant
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
