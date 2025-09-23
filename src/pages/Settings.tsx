import { THEMES, useSettings } from "../services/useSettings";
import { Button } from "../components/UI/Button";

export function Settings() {
  const { tempTheme, setTempTheme, saveTheme } = useSettings();

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sélection du thème</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTempTheme(theme)}
            style={{ backgroundColor: theme.primary, color: theme.text }}
            className={`p-4 rounded-md flex flex-col items-center justify-center transition ${
              tempTheme?.name === theme.name ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <span className="font-semibold">{theme.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={saveTheme}>Enregistrer</Button>
      </div>
    </div>
  );
}