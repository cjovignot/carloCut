import { useSettings } from "../../services/useSettings";
import { THEMES } from "../../services/themes";

export function ThemeSelector() {
  const { tempTheme, setTempTheme, saveTheme } = useSettings();

  if (!tempTheme) return null;

  return (
    <div className="grid grid-cols-1 gap-6 m-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {THEMES.map((theme) => {
        const isSelected = tempTheme.name === theme.name;

        return (
          <div
            key={theme.name}
            className={`cursor-pointer rounded-lg shadow-md overflow-hidden border transition-transform hover:scale-105`}
            style={{
              backgroundColor: "var(--color-card-bg)",
              borderColor: isSelected ? "var(--color-primary)" : "#E5E7EB",
            }}
            onClick={() => setTempTheme(theme)}
          >
            {/* Aperçu miniature */}
            <div
              className="flex items-center justify-center h-6 text-xs font-bold"
              style={{
                backgroundColor: "var(--color-navbar)",
                color: "var(--color-text-on-navbar)",
              }}
            >
              Navbar
            </div>

            <div
              className="p-3 space-y-2"
              style={{
                backgroundColor: "var(--color-navbar)",
                color: "var(--color-text)",
              }}
            >
              {/* Texte exemple */}
              <div className="text-sm font-medium">Exemple texte</div>

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-text-on-primary)",
                  }}
                >
                  Bouton
                </button>
                <button
                  className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-text-on-secondary)",
                  }}
                >
                  Action
                </button>
              </div>
            </div>

            {/* Nom du thème */}
            <div
              className="p-2 text-xs font-semibold text-center"
              style={{
                backgroundColor: "var(--color-card-bg)",
                color: "var(--color-text)",
              }}
            >
              {theme.name}
            </div>
          </div>
        );
      })}

      {/* Bouton sauvegarder */}
      <button
        onClick={saveTheme}
        className="px-4 py-2 mt-2 transition rounded-md col-span-full"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-text-on-primary)",
        }}
      >
        Enregistrer le thème
      </button>
    </div>
  );
}
