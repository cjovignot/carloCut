import { useSettings } from "../../services/useSettings";
import { THEMES, Theme } from "../../services/themes";
import {
  getTextColorForBackground,
  generateThemeVars,
  DerivedTheme,
} from "../../services/useApplyTheme";

function generatePreviewVars(theme: Theme) {
  const { primary, mode } = theme;
  const cssVars: DerivedTheme = generateThemeVars(primary, mode);

  return {
    ...theme,
    ...cssVars,
    textOnPrimary: getTextColorForBackground(primary),
    textOnSecondary: getTextColorForBackground(cssVars["--color-secondary"]),
  };
}

export function ThemeSelector() {
  const { tempTheme, setTempTheme, saveTheme, resetTheme } = useSettings();

  if (!tempTheme) return null;

  return (
    <div className="grid grid-cols-2 gap-3 m-1 md:grid-cols-3 lg:grid-cols-4">
      {THEMES.map((t) => {
        const theme = generatePreviewVars(t);
        const isSelected = tempTheme.name === theme.name;

        return (
          <div
            key={theme.name}
            onClick={() => setTempTheme(theme)}
            className="m-auto overflow-hidden transition-transform border rounded-lg shadow-md cursor-pointer hover:scale-105"
            style={{
              borderColor: isSelected ? theme["--color-primary"] : "#E5E7EB",
              backgroundColor: theme["--color-app-bg"],
            }}
          >
            {/* Navbar miniature */}
            <div
              className="flex items-center justify-center h-6 text-xs font-bold"
              style={{
                backgroundColor: theme["--color-navbar-bg"],
                color: theme["--color-navbar-text"],
              }}
            >
              Navbar
            </div>

            {/* Contenu miniature */}
            <div className="p-3 space-y-2">
              {/* Card */}
              <div
                className="p-2 rounded-md shadow-sm"
                style={{ backgroundColor: theme["--color-card-bg"] }}
              >
                <p
                  className="text-xs"
                  style={{ color: theme["--color-navbar-text"] }}
                >
                  Exemple texte
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                    style={{
                      backgroundColor: theme["--color-primary"],
                      color: theme.textOnPrimary,
                    }}
                  >
                    Bouton
                  </button>
                  <button
                    className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                    style={{
                      backgroundColor: theme["--color-secondary"],
                      color: theme.textOnSecondary,
                    }}
                  >
                    Action
                  </button>
                </div>
              </div>
            </div>

            {/* Nom du thème */}
            <div
              className="p-2 text-xs font-semibold text-center"
              style={{
                backgroundColor: theme["--color-card-bg"],
                color: theme["--color-navbar-text"],
              }}
            >
              {theme.name}
            </div>
          </div>
        );
      })}

      {/* Boutons d’action globaux */}
      <div className="flex gap-3 col-span-full">
        <button
          onClick={saveTheme}
          className="flex-1 px-4 py-2 transition rounded-md"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-action-text)",
          }}
        >
          ✅ Enregistrer le thème
        </button>

        <button
          onClick={resetTheme}
          className="flex-1 px-4 py-2 transition border rounded-md"
          style={{
            backgroundColor: "var(--color-neutral-mode)",
            color: "var(--color-navbar-text)",
          }}
        >
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
}
