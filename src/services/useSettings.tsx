import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { THEMES, Theme } from "./themes";

interface SettingsContextType {
  savedTheme: Theme | null;
  tempTheme: Theme | null;
  setTempTheme: (theme: Theme) => void;
  saveTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

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
      } catch {
        setSavedTheme(THEMES[0]);
        setTempTheme(THEMES[0]);
      }
    } else {
      setSavedTheme(THEMES[0]);
      setTempTheme(THEMES[0]);
    }
  }, []);

  const saveTheme = () => {
    if (!tempTheme) return toast.error("Aucun thème sélectionné !");
    setSavedTheme(tempTheme);
    localStorage.setItem("savedTheme", JSON.stringify(tempTheme));
    toast.success(`Thème enregistré : ${tempTheme.name}`);
  };
  console.log(tempTheme);

  return (
    <SettingsContext.Provider
      value={{ savedTheme, tempTheme, setTempTheme, saveTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
