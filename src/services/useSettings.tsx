import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface RALColor {
  code: string;
  name: string;
  hex: string;
}

interface SettingsContextType {
  selectedRAL: RALColor | null;
  setSelectedRAL: (ral: RALColor) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [selectedRAL, setSelectedRALState] = useState<RALColor | null>(null);

  // Charger depuis localStorage au montage
  useEffect(() => {
    const storedRAL = localStorage.getItem("selectedRAL");
    if (storedRAL) {
      setSelectedRALState(JSON.parse(storedRAL));
    } else {
      // Valeur par défaut si rien en storage
      setSelectedRALState({ code: "DEFAULT", name: "Blanc", hex: "#FFFFFF" });
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  const setSelectedRAL = (ral: RALColor) => {
    setSelectedRALState(ral);
    localStorage.setItem("selectedRAL", JSON.stringify(ral));
  };

  return (
    <SettingsContext.Provider value={{ selectedRAL, setSelectedRAL }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings doit être utilisé à l’intérieur d’un SettingsProvider");
  }
  return context;
}