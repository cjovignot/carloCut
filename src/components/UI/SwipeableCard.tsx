// components/SwipeableCard.tsx
import { ReactNode, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../services/useAuth";

interface SwipeableCardProps {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  showDelete?: boolean | (() => boolean);
  maxSwipe?: number;
  className?: string;
  style?: React.CSSProperties;
  imageSrc?: string; // URL de la photo
  imageAlt?: string;
}

export function SwipeableCard({
  children,
  onEdit,
  onDelete,
  showDelete = false,
  maxSwipe = 75,
  className = "",
  style = {},
  imageSrc,
  imageAlt = "Photo",
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const { user } = useAuth();

  const handlers = useSwipeable({
    onSwipedLeft: () => setTranslateX(-maxSwipe),
    onSwipedRight: () => setTranslateX(0),
    onSwiping: (eventData) => {
      let x = Math.max(Math.min(-eventData.deltaX, maxSwipe), 0);
      setTranslateX(-x);
    },
    trackMouse: true,
  });

  const actions: { icon: ReactNode; color: string; onClick: () => void }[] = [];

  if (onEdit) {
    actions.push({
      icon: <Edit className="w-6 h-6" />,
      color: "var(--color-edit-btn, #6B7280)",
      onClick: onEdit,
    });
  }

  const showDeleteBtn =
    typeof showDelete === "function" ? showDelete() : showDelete;

  if (onDelete && showDeleteBtn) {
    actions.push({
      icon: <Trash2 className="w-6 h-6" />,
      color: "var(--color-delete-btn, #EF4444)",
      onClick: onDelete,
    });
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg shadow-md ${className}`}
    >
      {/* --- Actions en arrière-plan --- */}
      {actions.length > 0 && (
        <div
          className="absolute top-0 right-0 flex flex-col h-full"
          style={{ width: maxSwipe }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              className="flex items-center justify-center h-full text-white"
              style={{
                width: maxSwipe,
                backgroundColor: action.color,
              }}
              onClick={action.onClick}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}

      {/* --- Carte principale --- */}
      <div
        {...handlers}
        className="relative flex transition-transform duration-200 bg-white"
        style={{
          transform: `translateX(${translateX}px)`,
          ...style,
        }}
      >
        {/* Contenu principal (2/3) */}
        <div className="flex-2 p-2">{children}</div>

        {/* Encadré image (1/3) */}
        <div className="flex-[1] basis-1/3 flex items-center justify-center bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="object-cover w-full h-full rounded-r-lg"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
}