import { useEffect } from "react";
import { useSettings } from "./useSettings";
import { Theme } from "./themes";

// 🔹 Vérifie si une couleur est claire ou foncée
export function isColorLight(hex: string) {
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
  // formule luminance standard BT.709
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 186; // seuil réaliste
}

// 🔹 Donne une couleur de texte lisible
export function getTextColorForBackground(
  bgHex: string,
  lightText = "#FFFFFF",
  darkText = "#111827"
) {
  return isColorLight(bgHex) ? darkText : lightText;
}

// 🔹 Éclaircit ou assombrit une couleur
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
    R = Math.round(R * (1 + percent));
    G = Math.round(G * (1 + percent));
    B = Math.round(B * (1 + percent));
  } else {
    R = Math.round(R + (255 - R) * percent);
    G = Math.round(G + (255 - G) * percent);
    B = Math.round(B + (255 - B) * percent);
  }
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

// 🔹 Hex → RGBA
export function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// 🔹 Type des variables dérivées
export type DerivedTheme = {
  "--color-app-bg": string;
  "--color-primary": string;
  "--color-secondary": string;
  "--color-navbar-bg": string;
  "--color-navbar-text": string;
  "--color-card-bg": string;
  "--color-action-bg": string;
  "--color-action-bg-hover": string;
  "--color-action-txt": string;
  "--color-success": string;
  "--color-error": string;
  "--color-warning": string;
  "--color-info": string;
  "--color-neutral-mode": string;
};

// 🔹 Génère les couleurs dérivées
export function generateThemeVars(
  primary: string,
  mode: "light" | "dark"
): DerivedTheme {
  // Fonds principaux
  const app_bg =
    mode === "light" ? shadeColor(primary, 0.85) : shadeColor(primary, -0.2);
  const secondary = shadeColor(primary, 0.3);
  const navbar_bg = mode === "light" ? "#FFFFFF" : shadeColor(primary, -0.5);
  const navbar_text = getTextColorForBackground(navbar_bg);
  const neutral_mode =
    mode === "light" ? shadeColor(primary, 0.8) : shadeColor(primary, -0.6);
  const page_title = shadeColor(getTextColorForBackground(neutral_mode), 0.1);

  // Cartes et boutons
  const card_bg =
    mode === "light" ? hexToRgba(primary, 0.05) : hexToRgba(primary, 0.15);
  const action_bg = primary;
  const action_bg_hover = shadeColor(primary, -0.15);
  const action_txt = getTextColorForBackground(action_bg);

  // Couleurs fixes universelles
  const success = "#16a34a";
  const error = "#dc2626";
  const warning = "#f59e0b";
  const info = "#0ea5e9";

  return {
    "--color-app-bg": app_bg,
    "--color-page-title": page_title,
    "--color-primary": primary,
    "--color-secondary": secondary,
    "--color-navbar-bg": navbar_bg,
    "--color-navbar-text": navbar_text,
    "--color-card-bg": card_bg,
    "--color-action-bg": action_bg,
    "--color-action-bg-hover": action_bg_hover,
    "--color-action-txt": action_txt,
    "--color-success": success,
    "--color-error": error,
    "--color-warning": warning,
    "--color-info": info,
    "--color-neutral-mode": neutral_mode,
  };
}

// 🔹 Hook qui applique le thème
export function useApplyTheme() {
  const { tempTheme } = useSettings();

  useEffect(() => {
    if (!tempTheme) return;

    const cssVars = generateThemeVars(tempTheme.primary, tempTheme.mode);

    console.group("🎨 Variables CSS du thème");
    Object.entries(cssVars).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.groupEnd();

    // Meta theme-color pour mobile
    const metaTheme = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (metaTheme)
      metaTheme.setAttribute("content", cssVars["--color-navbar-bg"]);

    // Application des variables CSS
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [tempTheme]);
}
