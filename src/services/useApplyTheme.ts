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

// Convertit hex → HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(c.substr(0, 2), 16) / 255;
  const g = parseInt(c.substr(2, 2), 16) / 255;
  const b = parseInt(c.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convertit HSL → hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
  else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
  else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
  else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
  else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
  else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Accent basé sur un décalage fixe de teinte
function getAccentColor(primary: string): string {
  const { h, s, l } = hexToHsl(primary);

  // Décalage fixe : anthracite (220°) → orange vif (~30°)
  const accentHue = (22 + (h % 15) - 5 + 360) % 360;

  // Accent toujours saturé et lumineux pour contraster
  const accentS = 90; // saturation haute
  const accentL = 50; // luminosité équilibrée, vif

  return hslToHex(accentHue, accentS, accentL);
}

// 🔹 Type des variables dérivées
export type DerivedTheme = {
  "--color-app-bg": string;
  "--color-accent": string;
  "--color-primary": string;
  "--color-secondary": string;

  "--color-page-title": string;
  "--color-navbar-bg": string;
  "--color-navbar-text": string;
  "--color-card-bg": string;
  "--color-input-bg": string;
  "--color-input-text": string;
  "--color-action-bg": string;
  "--color-action-bg-hover": string;
  "--color-action-text": string;

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
  // Globals
  const app_bg =
    mode === "light" ? shadeColor(primary, 0.85) : shadeColor(primary, -0.6);
  const secondary = shadeColor(primary, 0.3);
  const accent = getAccentColor(primary);
  const neutral_mode =
    mode === "light" ? shadeColor(primary, 0.8) : shadeColor(primary, -0.6);

  // Titles
  const page_title = shadeColor(getTextColorForBackground(neutral_mode), 0.1);

  // Navbar
  const navbar_bg = mode === "light" ? "#FFFFFF" : shadeColor(primary, -0.5);
  const navbar_text = getTextColorForBackground(navbar_bg);

  // Cards
  const card_bg =
    mode === "light" ? hexToRgba(primary, 0.05) : shadeColor(app_bg, 0.05);
  const action_bg = primary;
  const action_bg_hover = shadeColor(primary, -0.15);
  const action_text = getTextColorForBackground(action_bg);

  // Inputs
  const input_bg = shadeColor(app_bg, 0.5);
  const input_text = navbar_text;

  // Importants
  const success = "#16a34a";
  const error = "#dc2626";
  const warning = "#f59e0b";
  const info = "#0ea5e9";

  return {
    // Globals
    "--color-app-bg": app_bg,
    "--color-accent": accent,
    "--color-primary": primary,
    "--color-secondary": secondary,
    "--color-neutral-mode": neutral_mode,

    // Titles
    "--color-page-title": page_title,

    // Navbar
    "--color-navbar-bg": navbar_bg,
    "--color-navbar-text": navbar_text,

    // Inputs
    "--color-input-bg": input_bg,
    "--color-input-text": input_text,

    // Cards
    "--color-card-bg": card_bg,

    // Buttons
    "--color-action-text": action_text,
    "--color-action-bg": action_bg,
    "--color-action-bg-hover": action_bg_hover,

    // Importants
    "--color-success": success,
    "--color-error": error,
    "--color-warning": warning,
    "--color-info": info,
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
