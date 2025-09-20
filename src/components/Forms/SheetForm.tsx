// SheetForm.tsx
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../UI/Button";
import { Plus, X } from "lucide-react";
import LineDrawer, { Segment } from "../Profiles/LineDrawer";
import {
  SheetVisualization,
  generateSheetSVG,
} from "../Sheets/SheetVisualization";

interface SheetFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const profileTypes = [
  { value: "tableau G", label: "Tableau G" },
  { value: "tableau D", label: "Tableau D" },
  { value: "linteau", label: "Linteau" },
  { value: "appui", label: "Appui" },
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
  const [segments, setSegments] = useState<Segment[]>(
    initialData?.segments || []
  );

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          profileType: initialData.profileType,
          color: initialData.color,
          length: initialData.length,
          quantity: initialData.quantity,
          dimensions: initialData.dimensions.map((dim: number) => ({
            value: dim,
          })),
        }
      : {
          profileType: "tableau G",
          quantity: 1,
          dimensions: [{ value: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dimensions",
  });
  const selectedProfileType = watch("profileType");

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const dimensions = data.dimensions
        .map((d: any) => Number(d.value))
        .filter((d) => d > 0);

      const formattedData = {
        profileType: data.profileType,
        color: data.color,
        length: Number(data.length),
        quantity: Number(data.quantity),
        dimensions,
        segments,
      };

      await onSubmit(formattedData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Profile Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Elément <span className="text-red-800">*</span>
        </label>
        <select
          {...register("profileType", { required: "Profile type is required" })}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          defaultValue={initialData?.profileType || ""}
        >
          <option value="" disabled>
            Sélection de l'élément...
          </option>
          {profileTypes.map((profile) => (
            <option key={profile.value} value={profile.value}>
              {profile.label}
            </option>
          ))}
        </select>

        {/* LineDrawer */}
        <LineDrawer
          segments={segments}
          onSegmentsChange={(segs) => {
            setSegments(segs);
            setValue(
              "dimensions",
              segs.map((s) => ({
                value: Math.round(Math.hypot(s.x2 - s.x1, s.y2 - s.y1)),
              }))
            );
          }}
        />

        {errors.profileType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.profileType.message}
          </p>
        )}
      </div>

      {/* Color */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Couleur <span className="text-red-800">*</span>
          </label>
          <select
            {...register("color", { required: "Color is required" })}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Sélection du RAL...</option>
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
            {selectedProfileType?.toLowerCase().includes("tableau")
              ? "Hauteur (mm)"
              : "Longueur (mm)"}
            <span className="text-red-800">*</span>
          </label>
          <input
            type="number"
            {...register("length", {
              required: "Length is required",
              min: { value: 1, message: "Length must be positive" },
            })}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          />
          {errors.length && (
            <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            QTE <span className="text-red-800">*</span>
          </label>
          <input
            type="number"
            {...register("quantity", {
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
            })}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
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
        <div className="flex flex-col items-start justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Dimensions (mm) <span className="text-red-800">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ value: 0 })}
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une dimension
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
                className="flex-1 border-gray-300 rounded-md shadow-sm"
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
