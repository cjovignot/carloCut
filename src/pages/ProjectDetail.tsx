// src/components/Forms/JoineryForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../components/UI/Button";
import { Edit, Trash2 } from "lucide-react";

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

type FormValues = {
  name: string;
  type: string;
  imageURL: FileList | null;
};

export function JoineryForm({ initialData, onSubmit, onCancel }: JoineryFormProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData?.imageURL || null);
  const [imageRemoved, setImageRemoved] = useState(false); // si l'utilisateur supprime l'image existante

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
      imageURL: null,
    },
  });

  // Reset form si initialData change
  useEffect(() => {
    reset({
      name: initialData?.name || "",
      type: initialData?.type || "",
      imageURL: null,
    });
    setPreview(initialData?.imageURL || null);
    setImageRemoved(false);
  }, [initialData, reset]);

  // Watch le champ fichier pour générer la preview
  const imageFile = watch("imageURL");
  useEffect(() => {
    if (imageFile && imageFile.length > 0 && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setImageRemoved(false);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      // si aucun nouveau fichier choisi
      if (!initialData?.imageURL) setPreview(null);
    }
  }, [imageFile, initialData]);

  const handleRemoveImage = () => {
    setPreview(null);
    setImageRemoved(true);
    reset((prev) => ({ ...prev, imageURL: null }));
  };

  const onFormSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Par défaut, on conserve l'image existante
      let imageURL: string | undefined = initialData?.imageURL;

      // Si suppression
      if (imageRemoved) imageURL = "";

      // Si nouveau fichier
      if (data.imageURL && data.imageURL.length > 0 && data.imageURL[0] instanceof File) {
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

      const payload: any = {
        name: data.name,
        type: data.type,
      };
      if (imageURL !== undefined) payload.imageURL = imageURL;

      await onSubmit(payload);
    } catch (err) {
      console.error("JoineryForm submit error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium">Menuiserie *</label>
        <input
          type="text"
          {...register("name", { required: "Nom de menuiserie requis" })}
          style={{
            backgroundColor: "var(--color-input-bg)",
            color: "var(--color-input-text)",
          }}
          className="p-1 block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          placeholder="Fenêtre SDB, Porte d'entrée..."
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium">Type *</label>
        <select
          {...register("type", { required: "Type requis" })}
          style={{
            backgroundColor: "var(--color-input-bg)",
            color: "var(--color-input-text)",
          }}
          className="block p-1 w-full mt-1 border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Sélectionner un type</option>
          {joineryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      {/* Photo */}
      <div>
        <label className="block mb-1 text-sm font-medium">Photo</label>
        <div className="relative w-32 h-32 overflow-hidden border border-gray-300 rounded-md cursor-pointer bg-gray-50 group">
          {preview ? (
            <>
              <img src={preview} alt="Aperçu" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 p-1 rounded bg-white bg-opacity-80"
                title="Supprimer l'image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
              Ajouter une photo
            </div>
          )}

          <div className="absolute inset-0 transition-opacity bg-black opacity-0 pointer-events-none bg-opacity-40 group-hover:opacity-100"></div>
          <Edit className="absolute inset-0 w-6 h-6 m-auto text-white transition-opacity opacity-0 pointer-events-none group-hover:opacity-100" />

          <input
            type="file"
            accept="image/*"
            {...register("imageURL")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Boutons */}
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