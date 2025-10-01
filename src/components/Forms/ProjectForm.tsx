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
          imageURL: initialData.imageURL,
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
      let imageURL = "";

      // Upload image si sélectionnée
      if (data.imageURL && data.imageURL[0]) {
        const formData = new FormData();
        formData.append("file", data.imageURL[0]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");

        imageURL = json.url;
      }

      // Crée le payload final
      const payload = {
        name: data.name,
        client: data.client,
        address: data.address,
        date: data.date,
        notes: data.notes,
        imageURL,
      };

      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-2"
      encType="multipart/form-data"
    >
      <div>
        <label className="block text-sm font-medium">Nom du projet *</label>
        <input
          type="text"
          {...register("name", { required: "Nom du projet requis" })}
          className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm"
          placeholder="Maison Dupont, Extension salon..."
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Client *</label>
        <input
          type="text"
          {...register("client", { required: "Nom du client requis" })}
          className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm"
          placeholder="Jean Dupont..."
        />
        {errors.client && (
          <p className="text-red-500">{errors.client.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Adresse *</label>
        <input
          type="text"
          {...register("address", { required: "Adresse requise" })}
          className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm"
          placeholder="12 rue des Lilas, Rennes..."
        />
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Date *</label>
        <input
          type="date"
          {...register("date", { required: "Date requise" })}
          className="block p-1 mt-1 border border-gray-300 rounded-md shadow-sm w-fit"
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          rows={4}
          {...register("notes")}
          className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm"
          placeholder="Notes optionnelles sur le projet..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Photo</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          {...register("imageURL")}
          className="block w-full mt-1 text-sm"
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
