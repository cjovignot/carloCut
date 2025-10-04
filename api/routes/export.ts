// // routes/export.ts
// import express from "express";
// import PDFDocument from "pdfkit";
// import fetch from "node-fetch"; // npm i node-fetch@2
// import Project from "../models/Project.js";

// const exportRouter = express.Router();

// exportRouter.get("/:projectId/pdf", async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const project = await Project.findById(projectId)
//       .populate("joineries.sheets")
//       .populate("createdBy");

//     if (!project) return res.status(404).json({ error: "Projet introuvable" });

//     const doc = new PDFDocument({ margin: 30 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename="${project.name}.pdf"`
//     );

//     doc.pipe(res);

//     // --- Titre ---
//     doc.fontSize(20).text(project.name, { underline: true });
//     doc.moveDown();

//     // --- Infos projet ---
//     doc.fontSize(12).text(`Client: ${project.client || "-"}`);
//     if (project.address) doc.text(`Adresse: ${project.address}`);
//     if (project.date)
//       doc.text(`Date: ${new Date(project.date).toLocaleDateString()}`);
//     if (project.notes) doc.text(`Notes: ${project.notes}`);
//     doc.text(`Créé par: ${project.createdBy?.name || "Inconnu"}`);
//     doc.moveDown();

//     // --- Menuiseries ---
//     doc.fontSize(14).text("Menuiseries", { underline: true });
//     doc.moveDown();

//     if (!project.joineries?.length) {
//       doc.text("Aucune menuiserie ajoutée");
//     } else {
//       for (const joinery of project.joineries) {
//         doc.fontSize(12).text(joinery.name, { bold: true });
//         doc.text(`Type: ${joinery.type}`);

//         // Image menuiserie
//         if (joinery.imageURL) {
//           try {
//             const response = await fetch(joinery.imageURL);
//             const buffer = await response.buffer();
//             doc.image(buffer, { fit: [150, 100] }).moveDown(0.5);
//           } catch {
//             doc.text("[Image non disponible]");
//           }
//         }

//         // Tôles
//         if (!joinery.sheets?.length) {
//           doc.text("Aucune tôle ajoutée");
//         } else {
//           for (const sheet of joinery.sheets) {
//             doc
//               .fontSize(11)
//               .text(`Modèle: ${sheet.modelName || sheet.modelId}`);
//             doc.text(`Couleur: ${sheet.color}`);
//             doc.text(`Texturé: ${sheet.textured ? "Oui" : "Non"}`);
//             doc.text(`Quantité: ${sheet.quantity}`);

//             if (sheet.dimensions) {
//               doc.text(
//                 `Dimensions: ${Object.entries(sheet.dimensions)
//                   .map(([k, v]) => `${k}: ${v}mm`)
//                   .join(", ")}`
//               );
//             }

//             // Image de la tôle (si disponible)
//             if (sheet.imageURL) {
//               try {
//                 const sheetResp = await fetch(sheet.imageURL);
//                 const sheetBuffer = await sheetResp.buffer();
//                 doc.image(sheetBuffer, { fit: [120, 80] }).moveDown(0.5);
//               } catch {
//                 doc.text("[Image tôle non disponible]");
//               }
//             }

//             doc.moveDown(0.5);
//           }
//         }

//         doc.moveDown();
//       }
//     }

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Erreur génération PDF" });
//   }
// });

// export default exportRouter;
