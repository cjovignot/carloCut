import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

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
};

// 🔹 Détection si couleur claire ou foncée
function isColorLight(hex: string) {
  if (!hex) return true;
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 180;
}

// 🔹 Retourne la couleur de texte lisible sur un fond
function getTextColorForBackground(bgHex: string, lightText = "#FFFFFF", darkText = "#111827") {
  return isColorLight(bgHex) ? darkText : lightText;
}

// 🔹 10 thèmes élégants et modernes
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
];

interface SettingsContextType {
  savedTheme: Theme | null;
  tempTheme: Theme | null;
  setTempTheme: (theme: Theme) => void;
  saveTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [savedTheme, setSavedTheme] = useState<Theme | null>(null);
  const [tempTheme, setTempThemeState] = useState<Theme | null>(null);

  // 🔹 Ajouter automatiquement les couleurs de texte
  const enhanceTheme = (theme: Theme): Theme => ({
    ...theme,
    textOnPrimary: getTextColorForBackground(theme.primary),
    textOnSecondary: getTextColorForBackground(theme.secondary),
    textOnNavbar: getTextColorForBackground(theme.navbar),
  });

  // 🔹 Setter tempTheme avec contraste calculé
  const setTempTheme = (theme: Theme) => setTempThemeState(enhanceTheme(theme));

  useEffect(() => {
    const stored = localStorage.getItem("savedTheme");
    if (stored) {
      try {
        const parsed: Theme = JSON.parse(stored);
        const enhanced = enhanceTheme(parsed);
        setSavedTheme(enhanced);
        setTempThemeState(enhanced);
      } catch {
        const defaultTheme = enhanceTheme(THEMES[0]);
        setSavedTheme(defaultTheme);
        setTempThemeState(defaultTheme);
      }
    } else {
      const defaultTheme = enhanceTheme(THEMES[0]);
      setSavedTheme(defaultTheme);
      setTempThemeState(defaultTheme);
    }
  }, []);

  const saveTheme = () => {
    if (!tempTheme) return toast.error("Aucun thème sélectionné !");
    setSavedTheme(tempTheme);
    localStorage.setItem("savedTheme", JSON.stringify(tempTheme));
    toast.success(`Thème enregistré : ${tempTheme.name}`);
  };

  return (
    <SettingsContext.Provider value={{ savedTheme, tempTheme, setTempTheme, saveTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}

export { getTextColorForBackground };