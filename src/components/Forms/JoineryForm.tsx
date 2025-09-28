import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../UI/Button";

interface JoineryFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function JoineryForm({ onSubmit, onCancel }: JoineryFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "Joinery Order",
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
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-2"
      style={{ backgroundColor: "var(--color-card-bg)" }}
    >
      {/* Destinataire */}
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-navbar-text)" }}
        >
          Destinataire *
        </label>
        <input
          type="email"
          // {...register("recipient", { ... })}
          className="block w-full mt-1 rounded-md shadow-sm focus:ring-2"
          style={{
            borderColor: "var(--color-neutral-dark)",
            color: "var(--color-navbar-text)",
            backgroundColor: "var(--color-app-bg)",
            outlineColor: "var(--color-primary)",
          }}
          placeholder="supplier@example.com"
          value="contact@carlo.fr"
        />
        {errors.recipient && (
          <p className="mt-1 text-sm" style={{ color: "var(--color-error)" }}>
            {errors.recipient.message}
          </p>
        )}
      </div>

      {/* Objet */}
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-navbar-text)" }}
        >
          Objet *
        </label>
        <input
          type="text"
          {...register("subject", { required: "L'objet du mail est requis" })}
          className="block w-full mt-1 rounded-md shadow-sm focus:ring-2"
          style={{
            borderColor: "var(--color-neutral-dark)",
            color: "var(--color-navbar-text)",
            backgroundColor: "var(--color-app-bg)",
            outlineColor: "var(--color-primary)",
          }}
        />
        {errors.subject && (
          <p className="mt-1 text-sm" style={{ color: "var(--color-error)" }}>
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--color-navbar-text)" }}
        >
          Message
        </label>
        <textarea
          rows={4}
          {...register("message")}
          className="block w-full mt-1 rounded-md shadow-sm focus:ring-2"
          style={{
            borderColor: "var(--color-neutral-dark)",
            color: "var(--color-navbar-text)",
            backgroundColor: "var(--color-app-bg)",
            outlineColor: "var(--color-primary)",
          }}
          placeholder="Détails des assemblages et finitions..."
        />
      </div>

      {/* Boutons */}
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
