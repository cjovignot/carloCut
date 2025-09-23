import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/UI/Button";
import { useAuth } from "../services/useAuth";
import { useSettings } from "../services/useSettings";

// ✅ Import toast
import { toast } from "react-toastify";

import { RAL_CLASSIC } from "../constants/ral_classic_colors";
import { Listbox } from "@headlessui/react";

export function Settings() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { navbarColor, setNavbarColor } = useSettings();
  const [selectedRAL, setSelectedRAL] = useState(
    RAL_CLASSIC.find((c) => c.hex === navbarColor) || null
  );

  const handleSave = () => {
    if (!selectedRAL) {
      toast.error("Veuillez sélectionner une couleur ⚠️", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setNavbarColor(selectedRAL.hex);
    toast.success("Réglages enregistrés ✅", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center mb-8 space-x-3">
        <ArrowLeft className="w-5 h-5 text-gray-500" />
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
      </div>

      {/* Section choix couleur navbar */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Couleur de la barre de navigation
        </h2>

        <Listbox
          value={selectedRAL?.code || ""}
          onChange={(code) => {
            const color = RAL_CLASSIC.find((c) => c.code === code) || null;
            setSelectedRAL(color);
          }}
        >
          {({ open }) => {
            const selectedColor = selectedRAL;
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
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}