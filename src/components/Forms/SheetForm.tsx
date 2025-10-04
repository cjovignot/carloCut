import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { sheetModels, sheetTypes } from "../../constants/sheetModels";
import { RAL_CLASSIC, RALColor } from "../../constants/ral_classic_colors";
import { Button } from "../UI/Button";
import { Divider } from "../UI/Divider";

interface SheetFormValues {
  profileType: "appui" | "tableau D" | "tableau G" | "linteau";
  model: string;
  color: string; // code RAL
  textured: boolean;
  quantity: number;
  dimensions: Record<string, number>;
}

interface SheetFormProps {
  initialData?: SheetFormValues;
  onSubmit: (data: SheetFormValues) => Promise<void>;
  onCancel: () => void;
}

// Composant dropdown pour RAL
function RALSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedColor = RAL_CLASSIC.find((c) => c.code === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="flex items-center justify-between w-full p-2 border rounded-md"
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: "var(--color-input-bg)",
          color: "var(--color-input-text)",
        }}
      >
        <div className="flex items-center gap-2">
          {selectedColor && (
            <span
              className="w-4 h-4 border rounded-full"
              style={{ backgroundColor: selectedColor.hex }}
            />
          )}
          <span>
            {selectedColor
              ? `${selectedColor.code} - ${selectedColor.name}`
              : "Sélectionner une couleur"}
          </span>
        </div>
        <ChevronDown style={{ color: "var(--color-accent)" }} />
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 overflow-auto bg-white border rounded-md shadow-lg max-h-40">
          {RAL_CLASSIC.map((c) => (
            <li
              key={c.code}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
            >
              <span
                className="w-4 h-4 border rounded-full"
                style={{ backgroundColor: c.hex }}
              />
              <span>{c.code}</span>
              <span className="text-gray-500">- {c.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SheetForm({ initialData, onSubmit, onCancel }: SheetFormProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    SheetFormValues["profileType"] | ""
  >("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [color, setColor] = useState("");
  const [textured, setTextured] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  // Préremplissage en édition
  useEffect(() => {
    if (initialData) {
      setSelectedType(initialData.profileType);
      setSelectedModel(initialData.model);
      setColor(initialData.color || "");
      setTextured(initialData.textured || false);
      setQuantity(initialData.quantity?.toString() || "1");

      if (initialData.dimensions) {
        const dims: Record<string, string> = {};
        for (const key in initialData.dimensions) {
          dims[key] = initialData.dimensions[key]?.toString() || "";
        }
        setFormValues(dims);
      }
    }
  }, [initialData]);

  const model = sheetModels.find((m) => m.id === selectedModel);

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !selectedModel) {
      alert("Veuillez sélectionner un type et un modèle.");
      return;
    }

    // Vérifier la couleur RAL
    if (!RAL_CLASSIC.some((c) => c.code === color)) {
      alert("Veuillez sélectionner une couleur RAL valide.");
      return;
    }

    setLoading(true);
    try {
      const payload: SheetFormValues = {
        profileType: selectedType,
        model: selectedModel,
        color,
        textured,
        quantity: Number(quantity) || 1,
        dimensions: Object.fromEntries(
          Object.entries(formValues)
            .filter(([k]) => isNaN(Number(k))) // ⚡ on garde seulement les clés non-numériques
            .map(([k, v]) => [k, Number(v) || 0])
        ),
      };
      console.log(
        "Payload envoyé au backend:",
        JSON.stringify(payload, null, 2)
      );

      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  // Champs dynamiques pour dimensions
  const infoFields = model
    ? model.fields.map((fieldKey, idx) => ({
        label: fieldKey,
        value: formValues[fieldKey] || "",
        showDivider: idx !== model.fields.length - 1,
      }))
    : [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
      {/* Type */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value as SheetFormValues["profileType"]);
            setSelectedModel(null);
          }}
          className="w-full p-2 text-sm border rounded-md"
        >
          <option value="">Sélectionne un type</option>
          {Object.values(sheetTypes).map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Modèles */}
      {selectedType && (
        <div className="flex w-full gap-2 pb-2 overflow-x-auto">
          {sheetModels
            .filter((m) => m.profileType === selectedType)
            .map((m) => (
              <div
                key={m.id}
                className={`flex-shrink-0 w-[90%] sm:w-80 border rounded-md p-2 cursor-pointer transition ${
                  selectedModel === m.id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedModel(m.id)}
              >
                <img
                  src={m.src}
                  alt={m.name}
                  className="object-contain w-full h-auto mx-auto"
                />
                <p className="mt-1 text-xs text-center">{m.name}</p>
              </div>
            ))}
        </div>
      )}

      {/* Couleur & Texturé */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">RAL</label>
          <RALSelect value={color} onChange={setColor} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={textured}
            onChange={(e) => setTextured(e.target.checked)}
            className="w-4 h-4 rounded-md"
          />
          <label>Texturé</label>
        </div>
      </div>

      {/* Longueur & Quantité */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Quantité</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-1 rounded-md"
            style={{
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-input-text)",
            }}
            min={1}
          />
        </div>
      </div>

      {/* Dimensions dynamiques */}
      {infoFields.length > 0 && (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          {infoFields.map((field, idx) => (
            <div key={idx} className="contents">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--color-page-title)" }}
              >
                <span>{field.label}</span>
              </div>
              <div className="flex items-center justify-end pr-2">
                <input
                  type="number"
                  step="1"
                  value={field.value}
                  placeholder="Valeur en mm"
                  onChange={(e) =>
                    handleInputChange(
                      field.label,
                      Math.floor(Number(e.target.value)).toString()
                    )
                  }
                  className="w-full p-1 mr-2 text-sm text-right border-none focus:outline-none"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-input-text)",
                  }}
                />
                mm
              </div>
              {field.showDivider && <Divider />}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="success" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"} la tôle
        </Button>
      </div>
    </form>
  );
}
