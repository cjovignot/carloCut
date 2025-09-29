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
      <div>
        <label className="block text-sm font-medium">
          Menuiserie *
        </label>
        <input
          type="text"
          {...register("name", { required: "Nom de menuiserie requis" })}
          style={{backgroundColor: "var(--color-input-bg)", color: "var(--color-input-text)"}}
          className="p-1 block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          placeholder="Fenêtre SDB, Porte d'entrée..."
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Type *
        </label>
        <select
          {...register("type", { required: "Type is required" })}
          style={{backgroundColor: "var(--color-input-bg)", color: "var(--color-input-text)"}}
          className="block p-1 w-full mt-1 border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Sélectionner un type</option>
          {joineryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="success" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"} la menuiserie
        </Button>
      </div>
    </form>
  );
}
