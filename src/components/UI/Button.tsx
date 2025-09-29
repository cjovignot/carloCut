import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { getTextColorForBackground } from "../../services/useApplyTheme";

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

  // Récupère la couleur de fond selon le variant
  const variantBg: Record<string, string> = {
    primary: "var(--color-action-bg)",
    secondary: "var(--color-secondary)",
    danger: "#b01c1cff",
    outline: "transparent",
    toggle: "var(--color-input-bg)",
    success: "var(--color-success)",
  };

  const bgColor = variantBg[variant];

  // Utilise getTextColorForBackground pour déterminer la couleur du texte
  const textColor =
    variant === "outline"
      ? "var(--color-neutral-mode)" // pour outline on garde mode neutre
      : getTextColorForBackground(
          bgColor.startsWith("var(") ? "#FFFFFF" : bgColor
        );

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Styles dynamiques via CSS variables
  const style: React.CSSProperties = {
    backgroundColor: bgColor,
    color: textColor,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={style}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}