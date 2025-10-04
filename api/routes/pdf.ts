import express from "express";
import PDFDocument from "pdfkit";
import Project from "../models/Project.js"; // <-- adapte selon ton chemin

const router = express.Router();

// Génération du PDF pour un projet
router.get("/:id/pdf", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("joineries.sheets"); // adapte selon ton schéma

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // --- LOG pour debug ---
    console.log("=== Project RAW ===");
    console.log(project);

    // Créer le document PDF
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Définir les headers pour le téléchargement
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${project.name || "projet"}.pdf"`
    );

    // Pipeliner le flux vers la réponse
    doc.pipe(res);

    // --- Contenu du PDF ---
    doc.fontSize(20).text(project.name, { align: "center" });
    doc.moveDown();

    if (project.client) doc.fontSize(12).text(`Client : ${project.client}`);
    if (project.address) doc.text(`Adresse : ${project.address}`);
    if (project.date)
      doc.text(`Date : ${new Date(project.date).toLocaleDateString()}`);
    if (project.notes) doc.text(`Notes : ${project.notes}`);
    doc.text(`Créé par : ${project.createdBy?.name || "Inconnu"}`);
    doc.moveDown();

    doc.fontSize(16).text("Menuiseries", { underline: true });
    doc.moveDown();

    if (!project.joineries?.length) {
      doc.text("Aucune menuiserie ajoutée");
    } else {
      project.joineries.forEach((j: any, idx: number) => {
        doc.fontSize(14).text(`${idx + 1}. ${j.name} (${j.type})`);
        if (j.imageURL) {
          try {
            doc.image(j.imageURL, { fit: [150, 100] });
          } catch {
            doc.text("(Image non disponible)");
          }
        }
        if (j.sheets?.length) {
          j.sheets.forEach((s: any) => {
            doc.fontSize(12).text(` - Modèle : ${s.modelName || s.modelId}`);
            doc.text(`   Couleur : ${s.color}`);
            doc.text(`   Texturé : ${s.textured ? "Oui" : "Non"}`);
            doc.text(`   Quantité : ${s.quantity}`);
            if (s.dimensions) {
              const dims = Object.entries(s.dimensions)
                .map(([k, v]) => `${k}: ${v}mm`)
                .join(", ");
              doc.text(`   Dimensions : ${dims}`);
            }
            doc.moveDown(0.5);
          });
        } else {
          doc.text("   Aucune tôle ajoutée");
        }
        doc.moveDown();
      });
    }

    // Finaliser
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur génération PDF" });
  }
});

export default router;
