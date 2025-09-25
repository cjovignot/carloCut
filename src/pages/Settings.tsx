import { useSettings } from "../services/useSettings";
import { ThemeSelector } from "../components/UI/ThemeSelector";

export function Settings() {
  const { tempTheme } = useSettings();

  if (!tempTheme) return null;

  return (
    <div
      className="px-4 py-8 mx-auto pb-14 max-w-7xl"
      style={{
        // ✅ la page entière prend les variables du thème actif
        backgroundColor: "var(--color-app-background)",
        color: "var(--color-text)",
      }}
    >
      <h1 className="mb-6 text-2xl font-bold">Sélection du thème</h1>

      {/* ✅ Les vignettes sont rendues ici */}
      <ThemeSelector />
    </div>
  );
}