import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../UI/Button";
import { Edit, Trash2 } from "lucide-react";

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
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageURL || null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      client: initialData?.client || "",
      address: initialData?.address || "",
      imageURL: null, // ⚡ toujours null au départ
      date:
        initialData?.date?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      notes: initialData?.notes || "",
    },
  });

  const imageFile = watch("imageURL");

  useEffect(() => {
    if (imageFile && imageFile.length > 0 && imageFile[0] instanceof File) {
      const file = imageFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialData?.imageURL) {
      setPreview(initialData.imageURL); // ⚡ garde l’URL existante si pas de nouveau fichier
    }
  }, [imageFile, initialData]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      let imageURL = initialData?.imageURL || ""; // ⚡ conserve l’existante par défaut

      if (data.imageURL && data.imageURL[0] instanceof File) {
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-2">
      {/* Nom du projet */}
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

      {/* Client */}
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

      {/* Adresse */}
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

      {/* Date */}
      <div>
        <label className="block text-sm font-medium">Date *</label>
        <input
          type="date"
          {...register("date", { required: "Date requise" })}
          className="block p-1 mt-1 border border-gray-300 rounded-md shadow-sm w-fit"
        />
        {errors.date && <p className="text-red-500">{errors.date.message}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          rows={4}
          {...register("notes")}
          className="block w-full p-1 mt-1 border border-gray-300 rounded-md shadow-sm"
          placeholder="Notes optionnelles sur le projet..."
        />
      </div>

      {/* Photo style Notion avec overlay */}
      {/* Photo style JoineryForm */}
<div>
  <label className="block mb-1 text-sm font-medium">Photo</label>
  <div className="relative w-32 h-32 overflow-hidden border border-gray-300 rounded-md cursor-pointer bg-gray-50 group">
    {preview ? (
      <>
        <img
          src={preview}
          alt="Aperçu"
          className="object-cover w-full h-full"
        />
        {/* bouton supprimer */}
        <Button
          size="xs"
          type="button"
          variant="danger"
          onClick={() => {
            setPreview(null);
            // si tu veux aussi vider le champ du form
            reset({ ...watch(), imageURL: null });
          }}
          className="absolute z-20 p-1 rounded top-1 right-1 bg-opacity-80"
          title="Supprimer l'image"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </>
    ) : (
      <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">
        Ajouter une photo
      </div>
    )}

    {/* Overlay */}
    <div className="absolute inset-0 transition-opacity bg-black opacity-0 pointer-events-none bg-opacity-40 group-hover:opacity-100"></div>
    <Edit className="absolute inset-0 w-6 h-6 m-auto text-white transition-opacity opacity-0 pointer-events-none group-hover:opacity-100" />

    {/* Input fichier cliquable */}
    <input
      type="file"
      accept="image/*"
      capture="environment"
      {...register("imageURL")}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
</div>

      {/* Boutons */}
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