import { useEffect } from "react";
import { useSettings } from "./useSettings";
import { Theme } from "./themes";
// test

// 🔹 Parse rgba(...) or rgb(...) strings
function parseRgbaString(
  input: string
): { r: number; g: number; b: number; a: number } | null {
  const match = input.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const parts = match[1].split(",").map((v) => parseFloat(v.trim()));
  const [r, g, b, a = 1] = parts;

  return { r, g, b, a };
}

// 🔹 Blends a semi-transparent color over a solid background
function blendWithBackground(
  fg: { r: number; g: number; b: number; a: number },
  bg: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
  };
}

// 🔹 Luminance threshold logic
function luminanceIsLight(r: number, g: number, b: number): boolean {
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 186;
}

// ✅ Main function: determine if a color (hex or rgba) is light
export function isColorLight(
  color: string,
  background: string = "#ffffff"
): boolean {
  if (!color) return true;

  // Hex format
  if (color.startsWith("#")) {
    let c = color.slice(1);
    if (c.length === 3) {
      c = c
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return luminanceIsLight(r, g, b);
  }

  // rgba / rgb format
  const fg = parseRgbaString(color);
  if (!fg) return true;

  if (fg.a < 1) {
    const bg =
      parseRgbaString(background) ?? parseRgbaString(hexToRgba(background, 1))!;

    const { r, g, b } = blendWithBackground(fg, bg);
    return luminanceIsLight(r, g, b);
  }

  return luminanceIsLight(fg.r, fg.g, fg.b);
}

// 🔹 Retourne une couleur de texte lisible selon la couleur de fond (opaque ou translucide)
export function getTextColorForBackground(
  bgColor: string,
  lightText = "#FFFFFF",
  darkText = "#111827",
  backgroundBehind: string = "#FFFFFF"
): string {
  if (!bgColor) return darkText;

  // On utilise la fonction isColorLight existante qui gère le blending si nécessaire
  const isLight = isColorLight(bgColor, backgroundBehind);

  return isLight ? darkText : lightText;
}

// 🔹 Récupère la couleur derrière l'élément
export function getCssVarValue(varName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
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

// 🔹 Convertit hex en rgba()
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
  const accentHue = (22 + (h % 15) - 5 + 360) % 360;
  const accentS = 90;
  const accentL = 50;
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

// 🔹 Génère les couleurs dérivées
export function generateThemeVars(
  primary: string,
  mode: "light" | "dark"
): DerivedTheme {
  const app_bg =
    mode === "light" ? shadeColor(primary, 0.85) : shadeColor(primary, -0.6);
  const secondary = shadeColor(primary, 0.3);
  const accent = getAccentColor(primary);
  const neutral_mode =
    mode === "light" ? shadeColor(primary, 0.8) : shadeColor(primary, -0.6);

  const page_title = shadeColor(getTextColorForBackground(neutral_mode), 0.1);

  const navbar_bg = mode === "light" ? "#FFFFFF" : shadeColor(primary, -0.5);
  const navbar_text = getTextColorForBackground(navbar_bg);

  const card_bg =
    mode === "light" ? hexToRgba(primary, 0.05) : shadeColor(app_bg, 0.05);
  const card_text = getTextColorForBackground(
    card_bg,
    "#fff",
    "#111827",
    app_bg
  );

  const action_bg = primary;
  const action_bg_hover = shadeColor(primary, -0.15);
  const action_text = getTextColorForBackground(action_bg);

  const input_bg = shadeColor(app_bg, 0.5);
  const input_text = navbar_text;

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

    "--color-action-text": action_text,
    "--color-action-bg": action_bg,
    "--color-action-bg-hover": action_bg_hover,

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

    const metaTheme = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );
    if (metaTheme) metaTheme.setAttribute("content", cssVars["--color-app-bg"]);

    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [tempTheme]);
}
