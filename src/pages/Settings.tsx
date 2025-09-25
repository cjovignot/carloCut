// Settings.tsx
import { useSettings } from "../services/useSettings";
import { THEMES } from "../services/themes";
import { Button } from "../components/UI/Button";

export function Settings() {
  const { tempTheme, setTempTheme, saveTheme } = useSettings();

  if (!tempTheme) return null;

  return (
    <div
      className="px-4 py-8 mx-auto pb-14 max-w-7xl"
      style={{ backgroundColor: "var(--color-app-bg)" }}
    >
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        Sélection du thème
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {THEMES.map((theme) => {
          const isSelected = tempTheme.name === theme.name;

          return (
            <div
              key={theme.name}
              onClick={() => setTempTheme(theme)}
              className={`border rounded-md cursor-pointer overflow-hidden transition-transform hover:scale-105 ${
                isSelected ? "ring-2 ring-blue-500" : "border-gray-200"
              }`}
              style={{ backgroundColor: `var(--color-card-bg)` }}
            >
              {/* Navbar miniature */}
              <div
                className="flex items-center justify-center h-6 text-xs font-bold"
                style={{
                  backgroundColor: `var(--color-navbar)`,
                  color: `var(--color-text-on-navbar)`,
                }}
              >
                Navbar
              </div>

              {/* Couleurs principales */}
              <div className="flex">
                <div
                  className="flex-1 h-6"
                  style={{
                    backgroundColor: `var(--color-primary)`,
                    color: `var(--color-text-on-primary)`,
                  }}
                />
                <div
                  className="flex-1 h-6"
                  style={{
                    backgroundColor: `var(--color-secondary)`,
                    color: `var(--color-text-on-secondary)`,
                  }}
                />
              </div>

              {/* Fond et texte */}
              <div
                className="flex items-center justify-center h-16 text-sm font-medium"
                style={{
                  backgroundColor: `var(--color-background)`,
                  color: `var(--color-text-primary)`,
                }}
              >
                Texte
              </div>

              {/* Nom du thème */}
              <div
                className="p-1 text-xs font-semibold text-center"
                style={{ color: `var(--color-text-primary)` }}
              >
                {theme.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Button onClick={saveTheme}>Enregistrer le thème</Button>
      </div>
    </div>
  );
}