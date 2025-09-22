import React, { createContext, useContext, useState, ReactNode } from "react";

interface RALColor {
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
  const [selectedRAL, setSelectedRAL] = useState<RALColor | null>({
    code: "RAL 9016",
    name: "Blanc pur",
    hex: "#FFFFFF",
  });

  return (
    <SettingsContext.Provider value={{ selectedRAL, setSelectedRAL }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings doit être utilisé dans un SettingsProvider");
  }
  return context;
}