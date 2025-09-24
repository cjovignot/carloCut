import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../UI/Button";
import { Plus, X } from "lucide-react";
import LineDrawer, { Segment } from "../Profiles/LineDrawer";
import { Listbox } from "@headlessui/react";

import { RAL_CLASSIC } from "../../constants/ral_classic_colors";
import { RAL_DESIGN } from "../../constants/ral_design_colors";

interface SheetFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const profileTypes = ["tableau G", "tableau D", "linteau", "appui"];

export function SheetForm({ initialData, onSubmit, onCancel }: SheetFormProps) {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<Segment[]>(
    initialData?.segments || []
  );
  const [ralType, setRalType] = useState<"classic" | "design">("classic");

  const colors = ralType === "classic" ? RAL_CLASSIC : RAL_DESIGN;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData
      ? {
          profileType: initialData.profileType,
          widthAppui: initialData.widthAppui,
          textured: initialData.textured,
          color: initialData.color,
          length: initialData.length,
          quantity: initialData.quantity,
          dimensions: initialData.dimensions.map((d: number) => ({ value: d })),
        }
      : {
          profileType: "tableau G",
          widthAppui: 0,
          textured: false,
          color: "",
          length: 0,
          quantity: 1,
          dimensions: [{ value: 0 }],
        },
  });

  const { fields, remove } = useFieldArray({
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

      const payload = {
        ...data,
        segments,
        dimensions,
        textured: !!data.textured,
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Profile Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
          Élément *
        </label>
        <select
          {...register("profileType", {
            required: "Le type de profil est obligatoire",
          })}
          className="block w-full mt-1 border border-[color:var(--border)] rounded-md shadow-sm focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)] bg-[color:var(--background)] text-[color:var(--text-primary)]"
        >
          <option value="" disabled>
            Sélection de l'élément...
          </option>
          {profileTypes.map((profile) => (
            <option key={profile} value={profile}>
              {profile}
            </option>
          ))}
        </select>
        {errors.profileType && (
          <p className="mt-1 text-sm text-[color:var(--error)]">
            {errors.profileType.message}
          </p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
          RAL *
        </label>

        {/* RAL Type Buttons */}
        <div className="flex my-2 space-x-2">
          <Button
            type="button"
            variant={ralType === "classic" ? "primary" : "outline"}
            onClick={() => setRalType("classic")}
          >
            Classic
          </Button>
          <Button
            type="button"
            variant={ralType === "design" ? "primary" : "outline"}
            onClick={() => setRalType("design")}
          >
            Design
          </Button>
        </div>

        {/* Listbox RAL */}
        <Listbox
          value={watch("color")}
          onChange={(val) => setValue("color", val)}
        >
          {() => {
            const selectedColor = colors.find((c) => c.code === watch("color"));
            return (
              <>
                <Listbox.Button className="flex items-center w-full gap-2 p-2 text-left border rounded-md border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--text-primary)]">
                  {selectedColor && (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                  )}
                  {selectedColor
                    ? `${selectedColor.code} - ${selectedColor.name}`
                    : "Sélectionner un RAL"}
                </Listbox.Button>
                <Listbox.Options className="z-10 mt-1 overflow-auto border rounded-md max-h-60 bg-[color:var(--background)] border-[color:var(--border)] text-[color:var(--text-primary)]">
                  {colors.map((color) => (
                    <Listbox.Option
                      key={color.code}
                      value={color.code}
                      className={({ active }) =>
                        `flex items-center gap-2 p-2 cursor-pointer ${
                          active ? "bg-[color:var(--primary)]/10" : ""
                        }`
                      }
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>
                        {color.code} - {color.name}
                      </span>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </>
            );
          }}
        </Listbox>
      </div>

      {/* Length & Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
            {selectedProfileType?.toLowerCase().includes("tableau")
              ? "Hauteur (mm)"
              : "Longueur (mm)"}{" "}
            *
          </label>
          <input
            type="number"
            {...register("length", { required: true, min: 1 })}
            className="block w-full border rounded-md border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--text-primary)] focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
            QTE *
          </label>
          <input
            type="number"
            {...register("quantity", { required: true, min: 1 })}
            className="block w-full border rounded-md border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--text-primary)] focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          />
        </div>
      </div>

      {/* Profondeur Appui */}
      {selectedProfileType === "appui" && (
        <div>
          <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
            Côte menuiserie ➡️ arase mur *
          </label>
          <input
            type="number"
            {...register("widthAppui", { required: true, min: 1 })}
            className="flex-1 mt-2 border rounded-md border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--text-primary)] focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
          />
          {errors.widthAppui && (
            <p className="mt-1 text-sm text-[color:var(--error)]">
              Saisir une côte valide
            </p>
          )}
        </div>
      )}

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

      {/* Dimensions */}
      <div>
        <label className="block mb-2 text-sm font-medium text-[color:var(--text-secondary)]">
          Côtes (mm) *
        </label>
        <div className="mt-2 space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="grid items-center grid-cols-6 gap-2">
              <b className="col-span-1">{i + 1} :</b>
              <input
                type="number"
                {...register(`dimensions.${i}.value`, {
                  required: true,
                  min: 1,
                })}
                className="w-full col-span-3 border rounded-md text-end border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--text-primary)] focus:border-[color:var(--primary)] focus:ring-[color:var(--primary)]"
              />
              <p className="col-span-1">mm</p>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="col-span-1 p-2 text-[color:var(--error)] hover:opacity-80"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Mettre à jour" : "Créer"} la tôle
        </Button>
      </div>
    </form>
  );
}
