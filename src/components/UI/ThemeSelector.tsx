import { useSettings, THEMES } from "../services/useSettings";

export function ThemeSelector() {
  const { tempTheme, setTempTheme, saveTheme } = useSettings();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
      {THEMES.map((theme) => {
        const isSelected = tempTheme?.name === theme.name;

        return (
          <div
            key={theme.name}
            className={`cursor-pointer rounded-lg shadow-md overflow-hidden border transition-transform hover:scale-105 ${
              isSelected ? "ring-2 ring-blue-500" : "border-gray-200"
            }`}
            onClick={() => setTempTheme(theme)}
          >
            {/* Aperçu miniature */}
            <div
              className="h-6 flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: theme.navbar,
                color: theme.textOnNavbar,
              }}
            >
              Navbar
            </div>

            <div
              className="p-3 space-y-2"
              style={{ backgroundColor: theme.navbar, color: theme.text }}
            >
              {/* Texte exemple */}
              <div className="text-sm font-medium">Exemple texte</div>

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  className="flex-1 py-1 px-2 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.textOnPrimary,
                  }}
                >
                  Bouton
                </button>
                <button
                  className="flex-1 py-1 px-2 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.textOnSecondary,
                  }}
                >
                  Action
                </button>
              </div>
            </div>

            {/* Nom du thème */}
            <div className="p-2 text-center text-xs font-semibold bg-gray-50">
              {theme.name}
            </div>
          </div>
        );
      })}

      {/* Bouton sauvegarder */}
      <button
        onClick={saveTheme}
        className="col-span-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Enregistrer le thème
      </button>
    </div>
  );
}
