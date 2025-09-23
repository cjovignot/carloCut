import { useEffect } from "react";
import { useSettings } from "./useSettings";

export function useThemeColor() {
  const { tempRAL } = useSettings(); // 👈 on regarde tempRAL

  useEffect(() => {
    const metaTheme = document.querySelector<HTMLMetaElement>(
      "meta[name=theme-color]"
    );
    if (metaTheme) {
      metaTheme.setAttribute("content", tempRAL?.hex || "#ffffff");
    }
  }, [tempRAL]);
}