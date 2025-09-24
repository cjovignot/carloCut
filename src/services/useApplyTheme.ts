import { useEffect } from "react";
import { useSettings } from "./useSettings";

// 🔹 Détecter si couleur claire ou foncée
function isColorLight(hex: string) {
  if (!hex) return true;
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 180;
}

// 🔹 Couleur de texte lisible sur fond
function getTextColorForBackground(
  bgHex: string,
  lightText = "#FFFFFF",
  darkText = "#111827"
) {
  return isColorLight(bgHex) ? darkText : lightText;
}

// 🔹 Assombrir ou éclaircir une couleur
export function shadeColor(hex: string, percent: number) {
  if (!hex) return "#000000";

  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");

  const num = parseInt(c, 16);
  let R = (num >> 16) & 0xff;
  let G = (num >> 8) & 0xff;
  let B = num & 0xff;

  if (percent < 0) {
    // Assombrir : réduire chaque canal
    R = Math.round(R * (1 + percent)); // percent négatif
    G = Math.round(G * (1 + percent));
    B = Math.round(B * (1 + percent));
  } else {
    // Éclaircir : augmenter chaque canal vers 255
    R = Math.round(R + (255 - R) * percent);
    G = Math.round(G + (255 - G) * percent);
    B = Math.round(B + (255 - B) * percent);
  }

  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// 🔹 Appliquer thème et log des variables CSS
export function useApplyTheme() {
  const { tempTheme } = useSettings();

  useEffect(() => {
    if (!tempTheme) return;

    const themeWithDerived = {
      ...tempTheme,
      textOnPrimary: getTextColorForBackground(tempTheme.primary),
      textOnSecondary: getTextColorForBackground(tempTheme.secondary),
      textOnNavbar: getTextColorForBackground(tempTheme.navbar),
      appBackground: shadeColor(tempTheme.primary, 0.5),
      cardBg: hexToRgba(tempTheme.primary, 0.2), // 80% opacity
    };

    // Meta theme-color pour mobile
    const metaTheme = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (metaTheme) metaTheme.setAttribute("content", themeWithDerived.navbar);

    // Variables CSS globales
    const root = document.documentElement;
    const cssVarsMap: Record<string, string> = {
      "--color-primary": themeWithDerived.primary,
      "--color-secondary": themeWithDerived.secondary,
      "--color-background": themeWithDerived.background,
      "--color-text": themeWithDerived.text,
      "--color-navbar": themeWithDerived.navbar,
      "--color-text-on-primary": themeWithDerived.textOnPrimary,
      "--color-text-on-secondary": themeWithDerived.textOnSecondary,
      "--color-text-on-navbar": themeWithDerived.textOnNavbar,
      "--color-app-background": themeWithDerived.appBackground,
      "--color-card-bg": themeWithDerived.cardBg,
    };

    // 🔹 Appliquer les variables
    Object.entries(cssVarsMap).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 🔹 Loguer après que le style soit appliqué
    requestAnimationFrame(() => {
      const computed = getComputedStyle(root);
      const allCSSVars: Record<string, string> = {};
      for (let i = 0; i < computed.length; i++) {
        const name = computed[i];
        if (name.startsWith("--color-")) {
          allCSSVars[name] = computed.getPropertyValue(name).trim();
        }
      }
    });
  }, [tempTheme]);
}
