import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { THEMES, Theme } from "./themes";

interface SettingsContextType {
  savedTheme: Theme;
  tempTheme: Theme;
  setTempTheme: (theme: Theme) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const defaultTheme = THEMES[0];

  const [savedTheme, setSavedTheme] = useState<Theme>(defaultTheme);
  const [tempTheme, setTempTheme] = useState<Theme>(defaultTheme);

  // Charger depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedTheme");
    if (stored) {
      try {
        const parsed: Theme = JSON.parse(stored);
        if (parsed?.primary && parsed?.mode) {
          setSavedTheme(parsed);
          setTempTheme(parsed);
        } else {
          setSavedTheme(defaultTheme);
          setTempTheme(defaultTheme);
        }
      } catch {
        setSavedTheme(defaultTheme);
        setTempTheme(defaultTheme);
      }
    }
  }, []);

  // Sauvegarder le thème choisi
  const saveTheme = () => {
    if (!tempTheme) return toast.error("⚠️ Aucun thème sélectionné !");
    setSavedTheme(tempTheme);
    localStorage.setItem("savedTheme", JSON.stringify(tempTheme));
    toast.success(`🎨 Thème enregistré : ${tempTheme.name}`);
  };

  // Réinitialiser au thème par défaut
  const resetTheme = () => {
    setSavedTheme(defaultTheme);
    setTempTheme(defaultTheme);
    localStorage.setItem("savedTheme", JSON.stringify(defaultTheme));
    toast.info("🔄 Thème réinitialisé");
  };

  return (
    <SettingsContext.Provider
      value={{ savedTheme, tempTheme, setTempTheme, saveTheme, resetTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}