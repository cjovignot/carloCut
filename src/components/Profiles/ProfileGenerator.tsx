// src/components/ProfileGenerator.tsx
import React, { useRef, useState } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface ProfileGeneratorProps {
  width?: number;
  height?: number;
  angleThreshold?: number; // seuil d'angle pour pivots
  onChange?: (points: Point[]) => void; // callback pour récupérer le tracé final
}

export const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  width = 600,
  height = 400,
  angleThreshold = 30,
  onChange,
}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const isDrawing = useRef(false);

  // ====================== MOUSE EVENTS ======================
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDrawing.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setPoints((prev) => [...prev, newPoint]);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const snapped = snapToDirections(points, angleThreshold);
    setPoints(snapped);
    onChange?.(snapped);
  };

  // ====================== RENDER ======================
  return (
    <svg
      width={width}
      height={height}
      style={{ border: "1px solid #333", cursor: "crosshair" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

// ====================== HELPER FUNCTIONS ======================

// Angle entre trois points
function angleBetweenPoints(p1: Point, p2: Point, p3: Point): number {
  const a = Math.hypot(p2.x - p3.x, p2.y - p3.y);
  const b = Math.hypot(p1.x - p3.x, p1.y - p3.y);
  const c = Math.hypot(p1.x - p2.x, p1.y - p2.y);
  if (a * c === 0) return 0;
  return Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
}

// Snap horizontal / vertical / diagonal 45°
function snapToDirections(points: Point[], angleThreshold: number): Point[] {
  if (points.length < 2) return points;

  const result: Point[] = [points[0]];
  let lastPivot = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const p1 = lastPivot;
    const p2 = points[i];
    const p3 = points[i + 1];

    const angle = angleBetweenPoints(p1, p2, p3);

    // Angle fort => pivot
    if (Math.abs(180 - angle) >= angleThreshold) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      // Déterminer direction
      if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
        // diagonale 45°
        const signX = Math.sign(dx) || 1;
        const signY = Math.sign(dy) || 1;
        result.push({
          x: p1.x + Math.abs(dy) * signX,
          y: p1.y + Math.abs(dy) * signY,
        });
      } else if (Math.abs(dx) > Math.abs(dy)) {
        result.push({ x: p2.x, y: p1.y }); // horizontal
      } else {
        result.push({ x: p1.x, y: p2.y }); // vertical
      }

      lastPivot = result[result.length - 1];
    }
  }

  // dernier point
  result.push(points[points.length - 1]);
  return result;
}
