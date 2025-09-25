export type Theme = {
  name: string;
  mode: "light" | "dark";
  primary: string; // couleur pivot
};

export const THEMES: Theme[] = [
  {
    name: "Blanc Élégant",
    mode: "light",
    primary: "#1D4ED8", // bleu
  },
  {
    name: "Gris Anthracite",
    mode: "dark",
    primary: "#383E42", // gris foncé
  },
  {
    name: "Bleu Signalisation",
    mode: "light",
    primary: "#004C91",
  },
  {
    name: "Rouge Feu",
    mode: "light",
    primary: "#AF2B1E",
  },
  {
    name: "Beige Vert",
    mode: "light",
    primary: "#CDBA88",
  },
  {
    name: "Vert Nature",
    mode: "light",
    primary: "#4C7C4A",
  },
  {
    name: "Orange Moderne",
    mode: "light",
    primary: "#D97706",
  },
  {
    name: "Violet Royal",
    mode: "dark",
    primary: "#6B21A8",
  },
  {
    name: "Turquoise Élégant",
    mode: "light",
    primary: "#0D9488",
  },
  {
    name: "Rose Douceur",
    mode: "light",
    primary: "#BE185D",
  },
];