import { useSettings, THEMES } from "../../services/useSettings";

export function ThemeSelector() {
  const { tempTheme, setTempTheme } = useSettings();

  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-200 border border-gray-200">
      {THEMES.map((theme) => {
        const isSelected = tempTheme?.name === theme.name;

        return (
          <div
            key={theme.name}
            onClick={() => setTempTheme(theme)}
            className={`flex items-center justify-between p-4 cursor-pointer transition ${
              isSelected ? "bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            {/* Mini aperçu avec pastilles */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: theme.secondary }}
                />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: theme.navbar }}
                />
              </div>
              <span className="text-sm font-medium">{theme.name}</span>
            </div>

            {/* Indicateur sélection */}
            {isSelected && (
              <span className="text-blue-500 font-semibold">✓</span>
            )}
          </div>
        );
      })}
    </div>
  );
}