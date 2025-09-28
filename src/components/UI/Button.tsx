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

  // Styles dynamiques via CSS variables
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--color-action-bg)",
      color: "var(--color-action-txt)",
    },
    secondary: {
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-neutral-mode)",
    },
    danger: {
      backgroundColor: "#b01c1cff",
      color: "#FFFFFF",
    },
    outline: {
      backgroundColor: "transparent",
      color: "var(--color-neutral-mode)",
      border: "1px solid var(--color-neutral-mode)",
    },
    toggle: {
      backgroundColor: "var(--color-input-bg)",
      color: "var(--color-input-text)",
    },
    success: {
      backgroundColor: "var(--color-success)",
      color: "var(--color-neutral-mode)",
    },
  };

  // Hover & focus via pseudo-classes CSS
  const hoverFocusStyles: Record<string, React.CSSProperties> = {
    primary: {
      "--hover-bg": "var(--color-action-bg-hover)",
    },
    secondary: {
      "--hover-bg": "var(--color-secondary)",
    },
    danger: {
      "--hover-bg": "#B91C1C",
    },
    outline: {
      "--hover-bg": "var(--color-neutral-light)",
    },
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={{
        ...variantStyles[variant],
        ...hoverFocusStyles[variant],
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}
