export type Theme = {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  navbar: string;

  textOnPrimary?: string;
  textOnSecondary?: string;
  textOnNavbar?: string;
  cardBg?: string; // couleur de carte
};

export const THEMES: Theme[] = [
  {
    name: "Blanc Élégant",
    primary: "#1D4ED8",
    secondary: "#2563EB",
    background: "#F9FAFB",
    text: "#111827",
    navbar: "#FFFFFF",
  },
  {
    name: "Gris Anthracite",
    primary: "#383E42",
    secondary: "#4B5563",
    background: "#F3F4F6",
    text: "#F9FAFB",
    navbar: "#383E42",
  },
  {
    name: "Bleu Signalisation",
    primary: "#004C91",
    secondary: "#1D4ED8",
    background: "#E0F2FE",
    text: "#111827",
    navbar: "#004C91",
  },
  {
    name: "Rouge Feu",
    primary: "#AF2B1E",
    secondary: "#DC2626",
    background: "#FEF2F2",
    text: "#111827",
    navbar: "#AF2B1E",
  },
  {
    name: "Beige Vert",
    primary: "#CDBA88",
    secondary: "#D4C39F",
    background: "#FEFDF8",
    text: "#111827",
    navbar: "#CDBA88",
  },
  {
    name: "Vert Nature",
    primary: "#4C7C4A",
    secondary: "#6CA26C",
    background: "#EFFAF0",
    text: "#111827",
    navbar: "#4C7C4A",
  },
  {
    name: "Orange Moderne",
    primary: "#D97706",
    secondary: "#F59E0B",
    background: "#FFF7ED",
    text: "#111827",
    navbar: "#D97706",
  },
  {
    name: "Violet Royal",
    primary: "#6B21A8",
    secondary: "#8B5CF6",
    background: "#F5F3FF",
    text: "#111827",
    navbar: "#6B21A8",
  },
  {
    name: "Turquoise Élégant",
    primary: "#0D9488",
    secondary: "#14B8A6",
    background: "#ECFEFF",
    text: "#111827",
    navbar: "#0D9488",
  },
  {
    name: "Rose Douceur",
    primary: "#BE185D",
    secondary: "#EC4899",
    background: "#FFF1F6",
    text: "#111827",
    navbar: "#BE185D",
  },
  // {
  //   name: "iOS",
  //   primary: "#007AFF", // bleu iOS
  //   secondary: "#34C759", // vert iOS
  //   background: "#F2F2F7", // fond clair
  //   text: "#1C1C1E", // texte sombre
  //   navbar: "#FFFFFF", // navbar blanche
  // },
];
