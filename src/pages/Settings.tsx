import { THEMES, useSettings, getTextColorForBackground } from "../services/useSettings";
import { Button } from "../components/UI/Button";

export function Settings() {
  const { tempTheme, setTempTheme, saveTheme } = useSettings();

  return (
    <div className="px-4 py-8 pb-14 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sélection du thème</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {THEMES.map((theme) => {
          const isSelected = tempTheme?.name === theme.name;

          return (
            <div
              key={theme.name}
              onClick={() => setTempTheme(theme)}
              className={`border rounded-md cursor-pointer overflow-hidden transition-transform hover:scale-105 ${
                isSelected ? "ring-2 ring-blue-500" : "border-gray-200"
              }`}
            >
              {/* Navbar miniature */}
              <div
                className="h-6 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: theme.navbar,
                  color: getTextColorForBackground(theme.navbar),
                }}
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
      </div>

      <div className="mt-6">
        <Button onClick={saveTheme}>Enregistrer le thème</Button>
      </div>
    </div>
  );
}
