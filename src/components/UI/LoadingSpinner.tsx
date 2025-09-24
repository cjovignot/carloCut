interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${className}`}
      style={{
        borderColor: "var(--color-card-bg)", // couleur neutre pour le contour
        borderTopColor: "var(--color-primary)", // couleur principale pour l'animation
      }}
    />
  );
}
