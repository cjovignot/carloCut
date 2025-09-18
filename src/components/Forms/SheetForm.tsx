import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../UI/Button";
import { Plus, X } from "lucide-react";

interface SheetFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const profileTypes = [
  { value: "sill", label: "Sill" },
  { value: "jamb", label: "Jamb" },
  { value: "lintel", label: "Lintel" },
  { value: "custom", label: "Custom" },
];

const materials = [
  "Aluminum",
  "Steel",
  "Stainless Steel",
  "Galvanized Steel",
  "Custom",
];

const colors = [
  "RAL 9016 (Traffic White)",
  "RAL 9005 (Jet Black)",
  "RAL 7016 (Anthracite Grey)",
  "RAL 8017 (Chocolate Brown)",
  "RAL 6005 (Moss Green)",
  "Custom",
];

export function SheetForm({ initialData, onSubmit, onCancel }: SheetFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          profileType: initialData.profileType,
          thickness: initialData.thickness,
          material: initialData.material,
          color: initialData.color,
          length: initialData.length,
          quantity: initialData.quantity,
          dimensions: initialData.dimensions.map((dim: number) => ({
            value: dim,
          })),
        }
      : {
          thickness: 2,
          quantity: 1,
          dimensions: [{ value: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dimensions",
  });

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        dimensions: data.dimensions
          .map((dim: any) => Number(dim.value))
          .filter((d: number) => d > 0),
      };
      await onSubmit(formattedData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Type *
          </label>
          <select
            {...register("profileType", {
              required: "Profile type is required",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select profile type...</option>
            {profileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.profileType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.profileType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thickness (mm) *
          </label>
          <input
            type="number"
            step="0.1"
            {...register("thickness", {
              required: "Thickness is required",
              min: { value: 0.1, message: "Thickness must be positive" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.thickness && (
            <p className="mt-1 text-sm text-red-600">
              {errors.thickness.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Material *
          </label>
          <select
            {...register("material", { required: "Material is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select material...</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          {errors.material && (
            <p className="mt-1 text-sm text-red-600">
              {errors.material.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color *
          </label>
          <select
            {...register("color", { required: "Color is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select color...</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Length (mm) *
          </label>
          <input
            type="number"
            {...register("length", {
              required: "Length is required",
              min: { value: 1, message: "Length must be positive" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.length && (
            <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity *
          </label>
          <input
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Dimensions (mm) *
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: 0 })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Dimension
          </Button>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <input
                type="number"
                {...register(`dimensions.${index}.value`, {
                  required: "Dimension is required",
                  min: { value: 1, message: "Dimension must be positive" },
                })}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter dimension in mm"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Update" : "Create"} Sheet
        </Button>
      </div>
    </form>
  );
}
