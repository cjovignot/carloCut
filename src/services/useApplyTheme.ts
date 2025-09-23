import { useEffect } from "react";
import { useSettings } from "./useSettings";

export function useApplyTheme() {
  const { tempTheme } = useSettings();

  useEffect(() => {
    if (!tempTheme) return;

    // Mettre à jour le meta theme-color pour la PWA
    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", tempTheme.navbar);

    // Appliquer via variables CSS
    document.documentElement.style.setProperty("--color-primary", tempTheme.primary);
    document.documentElement.style.setProperty("--color-secondary", tempTheme.secondary);
    document.documentElement.style.setProperty("--color-background", tempTheme.background);
    document.documentElement.style.setProperty("--color-text", tempTheme.text);
    document.documentElement.style.setProperty("--color-navbar", tempTheme.navbar);
  }, [tempTheme]);
}