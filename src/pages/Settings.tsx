import { ThemeSelector } from "../components/UI/ThemeSelector";
import { Button } from "../components/UI/Button";
import { useSettings } from "../services/useSettings";

export function Settings() {
  const { saveTheme } = useSettings();

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Apparence</h1>

      <ThemeSelector />

      <div className="mt-8">
        <Button onClick={saveTheme} className="w-full">
          Enregistrer
        </Button>
      </div>
    </div>
  );
}