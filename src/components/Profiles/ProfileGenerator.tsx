// import React, { useRef, useState } from "react";

// export interface Point {
//   x: number;
//   y: number;
// }

// export interface ProfileGeneratorProps {
//   width?: number;
//   height?: number;
//   angleThreshold?: number;
//   strictMode?: boolean; // mode “règle totale”
//   onChange?: (points: Point[]) => void;
// }

// export const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
//   width = 600,
//   height = 400,
//   angleThreshold = 30,
//   strictMode = false,
//   onChange,
// }) => {
//   const [points, setPoints] = useState<Point[]>([]);
//   const isDrawing = useRef(false);

//   const getRelativePoint = (
//     clientX: number,
//     clientY: number,
//     svg: SVGSVGElement
//   ) => {
//     const rect = svg.getBoundingClientRect();
//     return { x: clientX - rect.left, y: clientY - rect.top };
//   };

//   // ====================== EVENTS ======================
//   const handleStart = (x: number, y: number, svg: SVGSVGElement) => {
//     isDrawing.current = true;
//     setPoints([getRelativePoint(x, y, svg)]);
//   };

//   const handleMove = (x: number, y: number, svg: SVGSVGElement) => {
//     if (!isDrawing.current) return;
//     const newPoint = getRelativePoint(x, y, svg);

//     if (strictMode && points.length > 0) {
//       // snap immédiat en mode règle
//       const last = points[points.length - 1];
//       const snapped = snapToStrict(last, newPoint);
//       setPoints((prev) => [...prev, snapped]);
//     } else {
//       setPoints((prev) => [...prev, newPoint]);
//     }
//   };

//   const handleEnd = () => {
//     if (!isDrawing.current) return;
//     isDrawing.current = false;

//     let finalPoints = strictMode
//       ? points
//       : snapToDirections(points, angleThreshold);

//     finalPoints = cleanProfile(finalPoints);

//     setPoints(finalPoints);
//     onChange?.(finalPoints);
//   };

//   // ====================== RENDER ======================
//   return (
//     <svg
//       width={width}
//       height={height}
//       style={{
//         border: "1px solid #333",
//         touchAction: "none",
//         cursor: "crosshair",
//       }}
//       onMouseDown={(e) => handleStart(e.clientX, e.clientY, e.currentTarget)}
//       onMouseMove={(e) => handleMove(e.clientX, e.clientY, e.currentTarget)}
//       onMouseUp={handleEnd}
//       onMouseLeave={handleEnd}
//       onTouchStart={(e) => {
//         e.preventDefault();
//         const t = e.touches[0];
//         handleStart(t.clientX, t.clientY, e.currentTarget);
//       }}
//       onTouchMove={(e) => {
//         e.preventDefault();
//         const t = e.touches[0];
//         handleMove(t.clientX, t.clientY, e.currentTarget);
//       }}
//       onTouchEnd={(e) => {
//         e.preventDefault();
//         handleEnd();
//       }}
//     >
//       {points.length > 1 && (
//         <polyline
//           points={points.map((p) => `${p.x},${p.y}`).join(" ")}
//           fill="none"
//           stroke="black"
//           strokeWidth={2}
//         />
//       )}
//     </svg>
//   );
// };

// // ====================== HELPERS ======================

// function snapToStrict(p1: Point, p2: Point): Point {
//   const dx = p2.x - p1.x;
//   const dy = p2.y - p1.y;

//   if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
//     const signX = Math.sign(dx) || 1;
//     const signY = Math.sign(dy) || 1;
//     return { x: p1.x + Math.abs(dy) * signX, y: p1.y + Math.abs(dy) * signY };
//   } else if (Math.abs(dx) > Math.abs(dy)) {
//     return { x: p2.x, y: p1.y };
//   } else {
//     return { x: p1.x, y: p2.y };
//   }
// }

// function angleBetweenPoints(p1: Point, p2: Point, p3: Point): number {
//   const a = Math.hypot(p2.x - p3.x, p2.y - p3.y);
//   const b = Math.hypot(p1.x - p3.x, p1.y - p3.y);
//   const c = Math.hypot(p1.x - p2.x, p1.y - p2.y);
//   if (a * c === 0) return 0;
//   return Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
// }

// function snapToDirections(points: Point[], angleThreshold: number): Point[] {
//   if (points.length < 2) return points;
//   const result: Point[] = [points[0]];
//   let lastPivot = points[0];

//   for (let i = 1; i < points.length - 1; i++) {
//     const p1 = lastPivot;
//     const p2 = points[i];
//     const p3 = points[i + 1];
//     const angle = angleBetweenPoints(p1, p2, p3);

//     if (Math.abs(180 - angle) >= angleThreshold) {
//       const dx = p2.x - p1.x;
//       const dy = p2.y - p1.y;

//       if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 5) {
//         const signX = Math.sign(dx) || 1;
//         const signY = Math.sign(dy) || 1;
//         result.push({
//           x: p1.x + Math.abs(dy) * signX,
//           y: p1.y + Math.abs(dy) * signY,
//         });
//       } else if (Math.abs(dx) > Math.abs(dy)) {
//         result.push({ x: p2.x, y: p1.y });
//       } else {
//         result.push({ x: p1.x, y: p2.y });
//       }

//       lastPivot = result[result.length - 1];
//     }
//   }

//   result.push(points[points.length - 1]);
//   return result;
// }

// // ====================== CLEAN PROFILE ======================

// // Supprime les points superflus pour garder seulement les pivots
// export function cleanProfile(points: Point[]): Point[] {
//   if (points.length < 2) return points;
//   const result: Point[] = [points[0]];

//   for (let i = 1; i < points.length - 1; i++) {
//     const prev = result[result.length - 1];
//     const curr = points[i];
//     const next = points[i + 1];

//     const dx1 = curr.x - prev.x;
//     const dy1 = curr.y - prev.y;
//     const dx2 = next.x - curr.x;
//     const dy2 = next.y - curr.y;

//     // Si le segment est colinéaire avec le suivant, ignorer ce point
//     if (dx1 * dy2 === dx2 * dy1) continue;

//     result.push(curr);
//   }

//   result.push(points[points.length - 1]);
//   return result;
// }
