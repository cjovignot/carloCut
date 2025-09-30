import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "toggle"
    | "action"
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
    action: "var(--color-action)",
    toggle: "var(--color-secondary)",
    success: "var(--color-success)",
  };

  const bgColor = variantBg[variant];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: bgColor,
        color:
          variant === "outline"
            ? "var(--color-neutral-mode)"
            : "var(--color-action-text)", // Texte géré par useApplyTheme
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}
