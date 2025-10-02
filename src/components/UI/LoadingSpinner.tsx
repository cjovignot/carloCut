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
    md: "h-6 w-6",
    lg: "h-10 w-10 min-h-screen",
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ backgroundColor: "var(--color-app-bg)" }}
    >
      <div
        className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${className}`}
        style={{
          borderColor: "var(--color-card-bg)", // couleur neutre du contour
          borderTopColor: "var(--color-info)", // couleur principale pour l'animation
        }}
      />
    </div>
  );
}
