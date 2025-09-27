import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          style={{
            backgroundColor: "var(--color-app-bg)", // overlay basé sur texte pour contraste
            opacity: 0.75,
          }}
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        {/* Modal content */}
        <div
          className={`inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} sm:p-6`}
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "var(--color-input-text)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-medium"
              style={{ color: "var(--color-page-title)" }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{
                color: "var(--color-error)",
                backgroundColor: "transparent",
                opacity: 0.75,
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
