// SheetForm.tsx
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ProfileOption } from "../Profiles/ProfileOption";
import { Button } from "../UI/Button";
import { Plus, X } from "lucide-react";
import { ProfileGenerator } from "../Profiles/ProfileGenerator.tsx";
import LineDrawer from "../Profiles/LineDrawer.tsx";

interface SheetFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const profileTypes = [
  { value: "tableau", label: "Tableau" },
  { value: "linteau", label: "Linteau" },
  { value: "appui", label: "Appui" },
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
    watch,
    setValue,
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
          profileType: "sill",
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
      {/* Profile Type with visual thumbnails */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Profile Type *
        </label>
        <div className="flex flex-wrap gap-2">
          {/* <ProfileGenerator /> */}
          <LineDrawer />
          {/* {profileTypes.map((profile) => (
            <ProfileOption
              key={profile.value}
              type={profile.value}
              selected={watch("profileType") === profile.value}
              onSelect={() => setValue("profileType", profile.value)}
            />
          ))} */}
        </div>
        {errors.profileType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.profileType.message}
          </p>
        )}
      </div>

      {/* Thickness */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.thickness && (
            <p className="mt-1 text-sm text-red-600">
              {errors.thickness.message}
            </p>
          )}
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Material *
          </label>
          <select
            {...register("material", { required: "Material is required" })}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color *
          </label>
          <select
            {...register("color", { required: "Color is required" })}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

      {/* Length & Quantity */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

      {/* Form actions */}
      <div className="flex justify-end pt-4 space-x-3">
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
