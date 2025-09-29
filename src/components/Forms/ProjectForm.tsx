import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../UI/Button";

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          name: initialData.name,
          client: initialData.client,
          address: initialData.address,
          date: initialData.date?.split("T")[0],
          notes: initialData.notes,
        }
      : {
          date: new Date().toISOString().split("T")[0],
        },
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Nom du projet *</label>
        <input
          type="text"
          {...register("name", { required: "Nom du projet requis" })}
          className="block w-full p-1 mt-1 border border-[color:var(--border)] rounded-md shadow-sm"
          placeholder="Maison Dupont, Extension salon..."
        />
        {errors.name && <p className="mt-1 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Client *</label>
        <input
          type="text"
          {...register("client", { required: "Nom du client requis" })}
          className="block w-full p-1 mt-1 border border-[color:var(--border)] rounded-md shadow-sm focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          placeholder="Jean Dupont..."
        />
        {errors.client && (
          <p className="mt-1 text-sm text-[color:var(--error)]">
            {errors.client.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--text-secondary)]">
          Adresse *
        </label>
        <input
          type="text"
          {...register("address", { required: "Adresse requise" })}
          className="block w-full p-1 mt-1 border border-[color:var(--border)] rounded-md shadow-sm focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          placeholder="12 rue des Lilas, Rennes..."
        />
        {errors.address && (
          <p className="mt-1 text-sm text-[color:var(--error)]">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-[color:var(--text-secondary)]">
          Date *
        </label>
        <input
          type="date"
          {...register("date", { required: "Date requise" })}
          className="flex w-fit items-center p-1 mx-auto mt-1 border border-[color:var(--border)] rounded-md shadow-sm focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-[color:var(--error)]">
            {errors.date.message}
          </p>
        )}
      </div>

      <div className="">
        <label className="block text-sm font-medium text-[color:var(--text-secondary)]">
          Notes
        </label>
        <textarea
          rows={4}
          {...register("notes")}
          className="block w-full p-1 mt-1 border border-[color:var(--border)] rounded-md shadow-sm focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          placeholder="Notes optionnelles sur le projet..."
        />
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"} le projet
        </Button>
      </div>
    </form>
  );
}
