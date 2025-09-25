// SheetCard.tsx
import { RAL_CLASSIC } from "../../constants/ral_classic_colors";
import { RAL_DESIGN } from "../../constants/ral_design_colors";

interface SheetCardProps {
  title?: string;
  data?: string | number;
  textured: boolean;
  className?: string;
  unit?: string;
}

export function SheetCard({
  title,
  data,
  textured,
  unit,
  className = "",
}: SheetCardProps) {
  // Cherche la couleur dans les palettes RAL
  const allColors = [...RAL_CLASSIC, ...RAL_DESIGN];
  const color = allColors.find((c) => c.code === data);

  return (
    <div
      className={`shadow rounded-xl p-3 flex flex-col h-22 transition-all hover:shadow-md ${className}`}
      style={{
        backgroundColor: "var(--color-card-bg)", // fond de la carte selon le thème
        color: "var(--color-text)", // texte principal selon le thème
        borderColor: "var(--color-primary)",
        borderWidth: 1,
        borderStyle: "solid",
      }}
    >
      {title && data !== undefined && (
        <div
          className="mb-1 text-xs"
          style={{ color: "var(--color-text-on-secondary)" }}
        >
          {title.toUpperCase()}
          {unit ? ` (${unit})` : ""}
        </div>
      )}

      <div className="flex flex-col items-center justify-center h-full text-lg font-bold text-center">
        <div className="flex items-center gap-2">
          {color && (
            <span
              className="w-4 h-4 border rounded-full"
              style={{
                backgroundColor: color.hex,
                borderColor: "var(--color-text)", // contraste avec texte
              }}
            />
          )}
          <span>{data}</span>
        </div>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-on-secondary)" }}
        >
          {textured ? "Texturé" : ""}
        </span>
      </div>
    </div>
  );
}