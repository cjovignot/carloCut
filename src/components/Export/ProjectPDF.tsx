// src/components/Export/ProjectPDF.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { sheetModels } from "../../constants/sheetModels";

// Utiliser une font standard sans-serif intégrée
Font.register({
  family: "Helvetica",
  fonts: [{ src: "" }], // vide, car c'est standard
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 2,
  },
  joineryCard: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  sheetCard: {
    marginBottom: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  image: {
    width: 120,
    height: 80,
    objectFit: "cover",
    marginBottom: 4,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
});

interface ProjectPDFProps {
  project: any;
}

export const ProjectPDF: React.FC<ProjectPDFProps> = ({ project }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* --- Titre projet --- */}
        <Text style={styles.title}>{project.name}</Text>

        {/* --- Infos projet --- */}
        <View style={styles.section}>
          {project.client && (
            <Text style={styles.text}>Client: {project.client}</Text>
          )}
          {project.address && (
            <Text style={styles.text}>Adresse: {project.address}</Text>
          )}
          {project.date && (
            <Text style={styles.text}>
              Date: {new Date(project.date).toLocaleDateString()}
            </Text>
          )}
          {project.notes && (
            <Text style={styles.text}>Notes: {project.notes}</Text>
          )}
          <Text style={styles.text}>
            Créé par: {project.createdBy?.name || "Inconnu"}
          </Text>
        </View>

        {/* --- Menuiseries --- */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Menuiseries</Text>

          {project.joineries?.length === 0 && (
            <Text>Aucune menuiserie ajoutée</Text>
          )}

          {project.joineries?.map((joinery: any) => (
            <View key={joinery._id} style={styles.joineryCard}>
              <Text style={styles.subtitle}>{joinery.name}</Text>
              <Text>Type: {joinery.type}</Text>

              {/* Image menuiserie */}
              {joinery.imageURL && (
                <Image src={joinery.imageURL} style={styles.image} />
              )}

              {/* Tôles */}
              {joinery.sheets?.length > 0 ? (
                joinery.sheets.map((sheet: any, idx: number) => {
                  // Cherche le modèle correspondant pour récupérer l'image
                  const model = sheetModels.find((m) => m.id === sheet.modelId);
                  const imageSrc = model
                    ? model.src.replace("../assets/models", "/models")
                    : null;

                  return (
                    <View key={idx} style={styles.sheetCard}>
                      <Text style={{ fontWeight: "bold" }}>
                        {sheet.modelName || sheet.modelId}
                      </Text>

                      {imageSrc && (
                        <Image src={imageSrc} style={styles.image} />
                      )}

                      <View style={styles.flexRow}>
                        <Text>Couleur: {sheet.color}</Text>
                        <Text>Texturé: {sheet.textured ? "Oui" : "Non"}</Text>
                      </View>
                      <Text>Quantité: {sheet.quantity}</Text>
                      <Text>
                        Dimensions:{" "}
                        {sheet.dimensions &&
                          Object.entries(sheet.dimensions)
                            .map(([k, v]) => `${k}: ${v}mm`)
                            .join(", ")}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text>Aucune tôle ajoutée</Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
