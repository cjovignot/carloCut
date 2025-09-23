import { ArrowLeft } from "lucide-react";
import { Button } from "../components/UI/Button";
import { useSettings } from "../services/useSettings";

// ✅ Import toast
import { toast } from "react-toastify";

import { RAL_CLASSIC } from "../constants/ral_classic_colors";
import { Listbox } from "@headlessui/react";

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
    toast.success("Réglages enregistrés ✅", {
      position: "top-right",
      autoClose: 3000,
    });
  };


  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center mb-8 space-x-3">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      {/* Section choix couleur navbar */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Couleur de la barre de navigation
        </h2>

        <Listbox
          value={tempRAL?.code || ""}
          onChange={(code) => {
            const color = RAL_CLASSIC.find((c) => c.code === code) || null;
            setTempRAL(color); // ✅ change direct la navbar
          }}
        >
          {({ open }) => {
            const selectedColor = RAL_CLASSIC.find(
              (c) => c.code === tempRAL?.code
            );
            return (
              <>
                <Listbox.Button className="flex items-center w-full gap-2 p-2 text-left border rounded-md">
                  {selectedColor && (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedColor.hex }}
                    ></span>
                  )}
                  {selectedColor
                    ? `${selectedColor.code} - ${selectedColor.name}`
                    : "Sélectionner un RAL"}
                </Listbox.Button>

                <Listbox.Options className="z-10 mt-1 overflow-auto bg-white border rounded-md max-h-60">
                  {RAL_CLASSIC.map((color) => (
                    <Listbox.Option
                      key={color.code}
                      value={color.code}
                      className={({ active }) =>
                        `flex items-center gap-2 p-2 cursor-pointer ${
                          active ? "bg-gray-100" : ""
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          ></span>
                          <span>
                            {color.code} - {color.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </>
            );
          }}
        </Listbox>

        <div className="mt-6">
          <Button onClick={saveRAL}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}
