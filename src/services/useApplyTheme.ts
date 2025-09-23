import { useEffect } from "react";
import { useSettings, getTextColorForBackground } from "./useSettings";

export function useApplyTheme() {
  const { tempTheme } = useSettings();

  useEffect(() => {
    if (!tempTheme) return;

    // Calculer automatiquement les couleurs de texte selon le contraste
    const themeWithContrast = {
      ...tempTheme,
      textOnPrimary: getTextColorForBackground(tempTheme.primary),
      textOnSecondary: getTextColorForBackground(tempTheme.secondary),
      textOnNavbar: getTextColorForBackground(tempTheme.navbar),
    };

    // Mettre à jour le meta theme-color
    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", themeWithContrast.navbar);

    // Appliquer les variables CSS
    document.documentElement.style.setProperty("--color-primary", themeWithContrast.primary);
    document.documentElement.style.setProperty("--color-secondary", themeWithContrast.secondary);
    document.documentElement.style.setProperty("--color-background", themeWithContrast.background);
    document.documentElement.style.setProperty("--color-text", themeWithContrast.text);
    document.documentElement.style.setProperty("--color-navbar", themeWithContrast.navbar);

    document.documentElement.style.setProperty("--color-text-on-primary", themeWithContrast.textOnPrimary);
    document.documentElement.style.setProperty("--color-text-on-secondary", themeWithContrast.textOnSecondary);
    document.documentElement.style.setProperty("--color-text-on-navbar", themeWithContrast.textOnNavbar);
  }, [tempTheme]);
}