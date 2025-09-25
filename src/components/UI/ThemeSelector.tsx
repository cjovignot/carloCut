import { useSettings } from "../../services/useSettings";
import { THEMES } from "../../services/themes";

export function ThemeSelector() {
  const { tempTheme, setTempTheme, saveTheme, resetTheme } = useSettings();

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
                backgroundColor: "var(--color-navbar-bg)",
                color: "var(--color-navbar-text)",
              }}
            >
              Navbar
            </div>

            {/* Contenu exemple */}
            <div
              className="p-3 space-y-2"
              style={{
                backgroundColor: "var(--color-card-bg)",
                color: "var(--color-navbar-text)",
              }}
            >
              {/* Texte exemple */}
              <div className="text-sm font-medium">Exemple texte</div>

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                  style={{
                    backgroundColor: "var(--color-action-bg)",
                    color: "var(--color-action-txt)",
                  }}
                >
                  Bouton
                </button>
                <button
                  className="flex-1 px-2 py-1 text-xs font-semibold rounded"
                  style={{
                    backgroundColor: "var(--color-action-bg-hover)",
                    color: "var(--color-action-txt)",
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
                color: "var(--color-navbar-text)",
              }}
            >
              {theme.name}
            </div>
          </div>
        );
      })}

      {/* Boutons d’action */}
      <div className="col-span-full flex gap-3">
        <button
          onClick={saveTheme}
          className="flex-1 px-4 py-2 transition rounded-md"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-action-txt)",
          }}
        >
          ✅ Enregistrer le thème
        </button>

        <button
          onClick={resetTheme}
          className="flex-1 px-4 py-2 transition rounded-md border"
          style={{
            backgroundColor: "var(--color-neutral-light)",
            color: "var(--color-neutral-dark)",
          }}
        >
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
}