import { useEffect } from "react";
import { useSettings } from "./useSettings"; // ✅ ton chemin actuel

export function useThemeColor() {
  const { tempRAL } = useSettings();

  useEffect(() => {
    const metaTheme = document.querySelector<HTMLMetaElement>(
      "meta[name=theme-color]"
    );
    if (metaTheme) {
      metaTheme.setAttribute("content", tempRAL?.hex || "#ffffff"); // fallback blanc
    }
  }, [tempRAL]);
}