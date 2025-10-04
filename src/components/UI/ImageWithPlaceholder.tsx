// src/components/UI/ImageWithPlaceholder.tsx
import { useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode; // ce qu'on affiche en attendant
}

export function ImageWithPlaceholder({ fallback, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-gray-200">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback || (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
      <img
        {...props}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${props.className || ""}`}
      />
    </div>
  );
}