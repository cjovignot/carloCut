import { useEffect } from "react";
import { useSettings } from "./useSettings";

// 🔹 Parse rgba(...) ou rgb(...)
export function parseRgbaString(input: string): { r: number; g: number; b: number; a: number } | null {
  const match = input.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(",").map((v) => parseFloat(v.trim()));
  const [r, g, b, a = 1] = parts;
  return { r, g, b, a };
}

// 🔹 Blend d'une couleur semi-transparente sur un fond solide
export function blendWithBackground(
  fg: { r: number; g: number; b: number; a: number },
  bg: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
  };
}

// 🔹 Convertit hex → rgba
export function hexToRgba(hex: string, alpha: number) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// 🔹 Récupère la valeur réelle d'une var CSS
export function getCssVarValue(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// 🔹 Éclaircit ou assombrit une couleur hex
export function shadeColor(hex: string, percent: number) {
  if (!hex) return "#000000";
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
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

// 🔹 Convertit var CSS ou valeur brute en couleur exploitable
export function resolveColor(color: string): string {
  if (!color) return "#000000";
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim();
    return getCssVarValue(varName) || "#000000";
  }
  return color;
}

// 🔹 Calcul du contraste WCAG
function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const luminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };
  const L1 = luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  const L2 = luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

// 🔹 Choisit la meilleure couleur de texte pour un fond donné
export function getBestTextColor(
  bgColor: string,
  lightText = "#ffffff",
  darkText = "#111827"
): string {
  const resolvedBg = resolveColor(bgColor);
  const fg = parseRgbaString(resolvedBg) ?? parseRgbaString(hexToRgba(resolvedBg, 1));
  if (!fg) return darkText;

  const bgRgb: [number, number, number] = [fg.r, fg.g, fg.b];
  const lightRgb: [number, number, number] = [255, 255, 255];
  const darkRgb: [number, number, number] = [17, 24, 39];

  const contrastLight = getContrastRatio(bgRgb, lightRgb);
  const contrastDark = getContrastRatio(bgRgb, darkRgb);

  return contrastLight > contrastDark ? lightText : darkText;
}

// 🔹 Alias pour compatibilité avec l'ancien code
export function getTextColorForBackground(
  bgColor: string,
  lightText = "#ffffff",
  darkText = "#111827"
): string {
  // Appelle le nouveau système robuste
  return getBestTextColor(bgColor, lightText, darkText);
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
  "--color-card-text": string;
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

// 🔹 Génère les variables CSS à partir du primary + mode
export function generateThemeVars(primary: string, mode: "light" | "dark"): DerivedTheme {
  const app_bg = mode === "light" ? shadeColor(primary, 0.85) : shadeColor(primary, -0.6);
  const secondary = shadeColor(primary, 0.3);
  const accent = primary; // ou remplacer par un accent calculé si souhaité
  const neutral_mode = mode === "light" ? shadeColor(primary, 0.8) : shadeColor(primary, -0.6);

  const navbar_bg = mode === "light" ? "#ffffff" : shadeColor(primary, -0.5);
  const navbar_text = getBestTextColor(navbar_bg);

  const card_bg = mode === "light" ? hexToRgba(primary, 0.05) : shadeColor(app_bg, 0.05);
  const card_text = getBestTextColor(card_bg);

  const action_bg = primary;
  const action_bg_hover = shadeColor(primary, -0.15);
  const action_text = getBestTextColor(action_bg);

  const input_bg = shadeColor(app_bg, 0.5);
  const input_text = getBestTextColor(input_bg);

  const page_title = getBestTextColor(neutral_mode);

  const success = "#16a34a";
  const error = "#dc2626";
  const warning = "#f59e0b";
  const info = "#0ea5e9";

  return {
    "--color-app-bg": app_bg,
    "--color-accent": accent,
    "--color-primary": primary,
    "--color-secondary": secondary,
    "--color-neutral-mode": neutral_mode,
    "--color-page-title": page_title,
    "--color-navbar-bg": navbar_bg,
    "--color-navbar-text": navbar_text,
    "--color-card-bg": card_bg,
    "--color-card-text": card_text,
    "--color-input-bg": input_bg,
    "--color-input-text": input_text,
    "--color-action-bg": action_bg,
    "--color-action-bg-hover": action_bg_hover,
    "--color-action-text": action_text,
    "--color-success": success,
    "--color-error": error,
    "--color-warning": warning,
    "--color-info": info,
  };
}

// 🔹 Hook principal pour appliquer le thème
export function useApplyTheme() {
  const { tempTheme } = useSettings();

  useEffect(() => {
    if (!tempTheme) return;

    const cssVars = generateThemeVars(tempTheme.primary, tempTheme.mode);

    // Logs pour debug
    console.group("🎨 Variables CSS du thème");
    Object.entries(cssVars).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.groupEnd();

    // Meta theme-color
    const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", cssVars["--color-app-bg"]);

    // Applique toutes les variables CSS
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [tempTheme]);
}