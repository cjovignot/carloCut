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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Name *
        </label>
        <input
          type="text"
          {...register("name", { required: "Project name is required" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client *
        </label>
        <input
          type="text"
          {...register("client", { required: "Client name is required" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.client && (
          <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <input
          type="text"
          {...register("address", { required: "Address is required" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date *
        </label>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          rows={4}
          {...register("notes")}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Optional project notes..."
        />
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Update" : "Create"} Project
        </Button>
      </div>
    </form>
  );
}
