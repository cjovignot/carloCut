import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export type Theme = {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  navbar: string;
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
  const [tempTheme, setTempTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("savedTheme");
    if (stored) {
      try {
        const parsed: Theme = JSON.parse(stored);
        setSavedTheme(parsed);
        setTempTheme(parsed);
      } catch (e) {
        console.error("Erreur parsing savedTheme:", e);
        setSavedTheme(THEMES[0]);
        setTempTheme(THEMES[0]);
      }
    } else {
      setSavedTheme(THEMES[0]);
      setTempTheme(THEMES[0]);
    }
  }, []);

  const saveTheme = () => {
    if (tempTheme) {
      setSavedTheme(tempTheme);
      localStorage.setItem("savedTheme", JSON.stringify(tempTheme));
      toast.success(`Thème enregistré : ${tempTheme.name}`);
    } else {
      toast.error("Aucun thème sélectionné !");
    }
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