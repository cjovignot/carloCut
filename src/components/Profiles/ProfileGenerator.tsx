import React, { useRef, useState } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface ProfileGeneratorProps {
  width?: number;
  height?: number;
  angleThreshold?: number;
  strictMode?: boolean; // <-- contrôle supplémentaire
  onChange?: (points: Point[]) => void;
}

export const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  width = 600,
  height = 400,
  angleThreshold = 30,
  strictMode = false,
  onChange,
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const isDrawing = useRef(false);

  const getRelativePoint = (
    clientX: number,
    clientY: number,
    svg: SVGSVGElement
  ) => {
    const rect = svg.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleStart = (
    clientX: number,
    clientY: number,
    svg: SVGSVGElement
  ) => {
    isDrawing.current = true;
    setPoints([getRelativePoint(clientX, clientY, svg)]);
  };

  const handleMove = (clientX: number, clientY: number, svg: SVGSVGElement) => {
    if (!isDrawing.current) return;
    const newPoint = getRelativePoint(clientX, clientY, svg);

    if (strictMode && points.length > 0) {
      // snap immédiat en mode règle
      const last = points[points.length - 1];
      const dx = newPoint.x - last.x;
      const dy = newPoint.y - last.y;
      let snapped: Point;

      if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
        const signX = Math.sign(dx) || 1;
        const signY = Math.sign(dy) || 1;
        snapped = {
          x: last.x + Math.abs(dy) * signX,
          y: last.y + Math.abs(dy) * signY,
        };
      } else if (Math.abs(dx) > Math.abs(dy)) {
        snapped = { x: newPoint.x, y: last.y };
      } else {
        snapped = { x: last.x, y: newPoint.y };
      }

      setPoints((prev) => [...prev, snapped]);
    } else {
      setPoints((prev) => [...prev, newPoint]);
    }
  };

  const handleEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const finalPoints = strictMode
      ? points
      : snapToDirections(points, angleThreshold);
    setPoints(finalPoints);
    onChange?.(finalPoints);
  };

  return (
    <svg
      width={width}
      height={height}
      style={{
        border: "1px solid #333",
        touchAction: "none",
        cursor: "crosshair",
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY, e.currentTarget)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY, e.currentTarget)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY, e.currentTarget);
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY, e.currentTarget);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleEnd();
      }}
    >
      {points.length > 1 && (
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="black"
          strokeWidth={2}
        />
      )}
    </svg>
  );
};

// ====================== HELPER ======================
function angleBetweenPoints(p1: Point, p2: Point, p3: Point): number {
  const a = Math.hypot(p2.x - p3.x, p2.y - p3.y);
  const b = Math.hypot(p1.x - p3.x, p1.y - p3.y);
  const c = Math.hypot(p1.x - p2.x, p1.y - p2.y);
  if (a * c === 0) return 0;
  return Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
}

function snapToDirections(points: Point[], angleThreshold: number): Point[] {
  if (points.length < 2) return points;
  const result: Point[] = [points[0]];
  let lastPivot = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const p1 = lastPivot;
    const p2 = points[i];
    const p3 = points[i + 1];
    const angle = angleBetweenPoints(p1, p2, p3);

    if (Math.abs(180 - angle) >= angleThreshold) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
        const signX = Math.sign(dx) || 1;
        const signY = Math.sign(dy) || 1;
        result.push({
          x: p1.x + Math.abs(dy) * signX,
          y: p1.y + Math.abs(dy) * signY,
        });
      } else if (Math.abs(dx) > Math.abs(dy)) {
        result.push({ x: p2.x, y: p1.y });
      } else {
        result.push({ x: p1.x, y: p2.y });
      }

      lastPivot = result[result.length - 1];
    }
  }

  result.push(points[points.length - 1]);
  return result;
}
