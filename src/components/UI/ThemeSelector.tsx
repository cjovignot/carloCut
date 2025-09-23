import { useSettings, THEMES, getTextColorForBackground } from "../services/useSettings";

export function ThemeSelector() {
  const { tempTheme, setTempTheme, saveTheme, savedTheme } = useSettings();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 m-2">
      {THEMES.map((theme) => {
        const isSelected = tempTheme?.name === theme.name;
        return (
          <div
            key={theme.name}
            className={`border rounded-md cursor-pointer overflow-hidden transition-transform hover:scale-105 ${
              isSelected ? "ring-2 ring-blue-500" : "border-gray-200"
            }`}
            onClick={() => setTempTheme(theme)}
          >
            {/* Navbar miniature */}
            <div
              className="h-6 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: theme.navbar, color: getTextColorForBackground(theme.navbar) }}
            >
              Navbar
            </div>
            {/* Couleurs principales */}
            <div className="flex">
              <div
                className="flex-1 h-6"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="flex-1 h-6"
                style={{ backgroundColor: theme.secondary }}
              />
            </div>
            {/* Fond et texte */}
            <div
              className="h-16 flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: theme.background, color: theme.text }}
            >
              Texte
            </div>
            {/* Nom du thème */}
            <div className="p-1 text-center text-xs font-semibold bg-gray-50">
              {theme.name}
            </div>
          </div>
        );
      })}

      {/* Bouton sauvegarder */}
      <button
        onClick={saveTheme}
        className="col-span-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Enregistrer le thème
      </button>
    </div>
  );
}