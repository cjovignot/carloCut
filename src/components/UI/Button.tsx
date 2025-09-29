import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  getTextColorForBackground,
  getCssVarValue,
} from "../../services/useApplyTheme";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "toggle"
    | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  // Couleurs de fond selon le variant
  const variantBg: Record<string, string> = {
    primary: "var(--color-action-bg)",
    secondary: "var(--color-secondary)",
    danger: "#b01c1cff",
    outline: "transparent",
    toggle: "var(--color-input-bg)",
    success: "var(--color-success)",
  };

  const bgColor = variantBg[variant];

  // Résoudre la vraie valeur de bgColor si c’est une var(...)
  const resolvedBgColor = bgColor.startsWith("var(")
    ? getCssVarValue(bgColor.replace(/var\(|\)/g, ""))
    : bgColor;

  // Détermine le fond derrière le bouton (utile pour le blending si bgColor est translucide)
  const backgroundBehind =
    variant === "outline"
      ? getCssVarValue("--color-neutral-mode")
      : getCssVarValue("--color-app-bg");

  // Couleur du texte calculée automatiquement selon la couleur réelle
  const textColor =
    variant === "outline"
      ? "var(--color-neutral-mode)"
      : getTextColorForBackground(
          resolvedBgColor,
          "#FFFFFF",
          "#111827",
          backgroundBehind
        );

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  console.log("Button →", { bgColor, backgroundBehind, textColor });

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}
