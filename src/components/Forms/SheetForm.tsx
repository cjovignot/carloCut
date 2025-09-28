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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-2">
      {/* Profile Type */}
      <div>
        <label
          className="block mb-2 text-sm font-medium"
          style={{ color: "var(--color-neutral-mode)" }}
        >
          Élément *
        </label>
        <select
          {...register("profileType", {
            required: "Le type de profil est obligatoire",
          })}
          style={{ backgroundColor: "var(--color-input-bg)" }}
          className="block p-1 w-full mt-1 border border-[color:var(--border)] rounded-md shadow-sm"
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
        {/* RAL Type Buttons */}
        <div className="flex items-center justify-between w-full my-2 mt-8">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--color-neutral-mode)" }}
          >
            RAL *
          </label>
          <div
            style={{
              backgroundColor: "var(--color-input-bg)",
              border: "1.5px var(--color-input-bg) solid",
            }}
            className="rounded-md"
          >
            <Button
              type="button"
              size="sm"
              className="rounded-r-none rounded-l-md"
              variant={ralType === "classic" ? "toggle" : "secondary"}
              onClick={() => setRalType("classic")}
            >
              Classic
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-l-none rounded-r-md"
              variant={ralType === "design" ? "toggle" : "secondary"}
              onClick={() => setRalType("design")}
            >
              Design
            </Button>
          </div>
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
                <Listbox.Button
                  style={{
                    backgroundColor: "var(--color-input-bg)",
                    color: "var(--color-input-text",
                  }}
                  className="flex items-center w-full gap-2 p-1 text-left border rounded-md border-[color:var(--border)]"
                >
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
                <Listbox.Options
                  style={{
                    backgroundColor: "var(--color-input-bg)",
                    color: "var(--color-input-text)",
                  }}
                  className="z-10 mt-1 overflow-auto border rounded-md max-h-60 border-[color:var(--border)]"
                >
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
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--color-neutral-mode)" }}
          >
            {selectedProfileType?.toLowerCase().includes("tableau")
              ? "Hauteur (mm)"
              : "Longueur (mm)"}{" "}
            *
          </label>
          <input
            type="number"
            style={{
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-input-text",
            }}
            {...register("length", { required: true, min: 1 })}
            className="block p-1 w-full border rounded-md border-[color:var(--border)]"
          />
        </div>
        <div className="mb-2">
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: "var(--color-neutral-mode)" }}
          >
            QTE *
          </label>
          <input
            type="number"
            {...register("quantity", { required: true, min: 1 })}
            className="block p-1 w-full border rounded-md border-[color:var(--border)]"
            style={{
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-input-text)",
            }}
          />
        </div>
      </div>

      {/* Profondeur Appui */}
      {selectedProfileType === "appui" && (
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: "var(--color-neutral-mode)" }}
          >
            Côte menuiserie ➡️ arase mur *
          </label>
          <input
            type="number"
            style={{
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-input-text)",
            }}
            {...register("widthAppui", { required: true, min: 1 })}
            className="flex-1 p-1 mt-2 border rounded-md border-[color:var(--border)]"
          />
          {errors.widthAppui && (
            <p className="mt-1 text-sm" style={{ color: "var(--color-error)" }}>
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
      <div className="">
        <label
          className="block mb-2 text-sm font-medium"
          style={{ color: "var(--color-neutral-mode)" }}
        >
          Côtes (mm) *
        </label>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="grid items-center grid-cols-7 gap-0">
              <b
                className="col-span-0"
                style={{
                  color: "var(--color-neutral-mode)",
                }}
              >
                {i + 1} :
              </b>
              <input
                type="number"
                {...register(`dimensions.${i}.value`, {
                  required: true,
                  min: 1,
                })}
                style={{
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-input-text)",
                }}
                className="-ml-4 p-1 col-span-4 border rounded-md text-end border-[color:var(--border)]"
              />
              <p
                className="ml-2 col-span-0"
                style={{ color: "var(--color-neutral-mode)" }}
              >
                mm
              </p>
              {fields.length > 1 && (
                <div
                  className="flex items-center justify-center w-3/4 h-full col-span-1 ml-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-neutral-mode)",
                    opacity: 0.95,
                  }}
                >
                  <X onClick={() => remove(i)} className="p-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-x-2 space-y-6 text-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" loading={loading} variant="success">
          {initialData ? "Mettre à jour" : "Créer"} la tôle
        </Button>
      </div>
    </form>
  );
}
