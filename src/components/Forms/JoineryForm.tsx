import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../UI/Button";

interface JoineryFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const joineryTypes = [
  { value: "fenetre", label: "Fenêtre" },
  { value: "porte", label: "Porte" },
  { value: "baie", label: "Baie" },
];

export function JoineryForm({
  initialData,
  onSubmit,
  onCancel,
}: JoineryFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
        }
      : {},
  });

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Nom */}
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          Menuiserie *
        </label>
        <input
          type="text"
          {...register("name", { required: "Nom de menuiserie requis" })}
          className="block w-full mt-1 rounded-md shadow-sm focus:ring-2"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-background)",
            outlineColor: "var(--color-primary)",
          }}
          placeholder="Fenêtre SDB, Porte d'entrée..."
        />
        {errors.name && (
          <p className="mt-1 text-sm" style={{ color: "var(--color-error)" }}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Type */}
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-text)" }}
        >
          Type *
        </label>
        <select
          {...register("type", { required: "Type is required" })}
          className="block w-full mt-1 rounded-md shadow-sm focus:ring-2"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-background)",
            outlineColor: "var(--color-primary)",
          }}
        >
          <option value="">Sélectionner un type</option>
          {joineryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm" style={{ color: "var(--color-error)" }}>
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"} la menuiserie
        </Button>
      </div>
    </form>
  );
}
