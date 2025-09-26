import { useSettings } from "../services/useSettings";
import { ThemeSelector } from "../components/UI/ThemeSelector";

export function Settings() {
  const { tempTheme } = useSettings();

  if (!tempTheme) return null;

  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-7xl">
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ color: "var(--color-page-title)" }}
      >
        Sélection du thème
      </h1>

      <ThemeSelector />
    </div>
  );
}
