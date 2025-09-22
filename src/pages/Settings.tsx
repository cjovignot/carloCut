import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/UI/Button";
import { useAuth } from "../services/useAuth";
import { useSettings } from "../services/useSettings";

// Exemple de palette RAL minimaliste (tu peux l’étendre)
const RAL_COLORS = [
  { code: "RAL 1000", name: "Beige vert", hex: "#CDBA88" },
  { code: "RAL 3000", name: "Rouge feu", hex: "#AF2B1E" },
  { code: "RAL 5005", name: "Bleu signalisation", hex: "#004C91" },
  { code: "RAL 7016", name: "Gris anthracite", hex: "#383E42" },
  { code: "RAL 9010", name: "Blanc pur", hex: "#FFFFFF" },
];

export function Settings() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { navbarColor, setNavbarColor } = useSettings();
  const [selected, setSelected] = useState(navbarColor);

  const handleSave = () => {
    setNavbarColor(selected);
  };

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center mb-8 space-x-3">
        <ArrowLeft className="w-5 h-5 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900">Réglages</h1>
      </div>

      {/* Section choix couleur navbar */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Couleur de la barre de navigation
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {RAL_COLORS.map((color) => (
            <button
              key={color.code}
              onClick={() => setSelected(color.hex)}
              className={`flex flex-col items-center justify-center p-4 border rounded-md transition ${
                selected === color.hex
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              <span
                className={`text-xs font-medium ${
                  color.hex === "#FFFFFF" ? "text-gray-800" : "text-white"
                }`}
              >
                {color.code}
              </span>
              <span
                className={`text-[10px] ${
                  color.hex === "#FFFFFF" ? "text-gray-600" : "text-gray-200"
                }`}
              >
                {color.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}