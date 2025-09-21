import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../UI/Button";

interface EmailFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function EmailForm({ onSubmit, onCancel }: EmailFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "Sheet Metal Order",
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Destinataire *
        </label>
        <input
          type="email"
          // {...register("recipient", {
          //   required: "Le destinataire est requis",
          //   pattern: {
          //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          //     message: "Adresse email invalide",
          //   },
          // })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="supplier@example.com"
          value="contact@carlo.fr"
        />
        {errors.recipient && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recipient.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Objet *
        </label>
        <input
          type="text"
          {...register("subject", { required: "L'objet du mail est requis" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          rows={4}
          {...register("message")}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Vous trouverez ci-joint les différentes tôles à fabriquer..."
        />
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          Envoyer
        </Button>
      </div>
    </form>
  );
}
