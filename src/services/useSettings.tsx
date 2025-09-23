import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export type RALColor = { code: string; name: string; hex: string };

interface SettingsContextType {
  savedRAL: RALColor | null;
  tempRAL: RALColor | null;
  setTempRAL: (color: RALColor | null) => void;
  saveRAL: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [savedRAL, setSavedRAL] = useState<RALColor | null>(null);
  const [tempRAL, setTempRAL] = useState<RALColor | null>(null);

  // 🔹 Charger depuis localStorage au montage
  useEffect(() => {
    const storedRAL = localStorage.getItem("savedRAL");
    if (storedRAL) {
      try {
        const parsed: RALColor = JSON.parse(storedRAL);
        setSavedRAL(parsed);
        setTempRAL(parsed); // initialise aussi le temp
      } catch (e) {
        console.error("Erreur parsing savedRAL:", e);
      }
    }
  }, []);

  // 🔹 Fonction pour sauvegarder
  const saveRAL = () => {
    if (tempRAL) {
      setSavedRAL(tempRAL);
      localStorage.setItem("savedRAL", JSON.stringify(tempRAL));

      // ✅ Feedback visuel
      toast.success(`Couleur enregistrée : ${tempRAL.code} - ${tempRAL.name}`);
    } else {
      toast.error("Aucune couleur sélectionnée !");
    }
  };

  return (
    <SettingsContext.Provider
      value={{ savedRAL, tempRAL, setTempRAL, saveRAL }}
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