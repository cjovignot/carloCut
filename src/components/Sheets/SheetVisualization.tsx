// SheetVisualization.tsx
import { useEffect, useState } from "react";

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface SheetVisualizationProps {
  segments: Segment[];
  dimensions?: number[];
  widthAppui?: number; // utilisé pour ajuster la plus grande côte
  padding?: number; // padding autour de la zone totale
  offset?: number; // distance des lignes de côte par rapport au dessin
  textOffset?: number; // distance supplémentaire pour le texte
  arrowSize?: number; // taille des flèches
}

export function SheetVisualization({
  segments,
  widthAppui,
  dimensions = [],
  padding = 30,
  offset = 0,
  textOffset = 19,
  arrowSize = 4,
}: SheetVisualizationProps) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    if (!segments || segments.length === 0) {
      setSvgContent("");
      return;
    }

    // 1️⃣ Déterminer la zone du dessin
    const minX = Math.min(...segments.flatMap((s) => [s.x1, s.x2]));
    const maxX = Math.max(...segments.flatMap((s) => [s.x1, s.x2]));
    const minY = Math.min(...segments.flatMap((s) => [s.y1, s.y2]));
    const maxY = Math.max(...segments.flatMap((s) => [s.y1, s.y2]));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // 2️⃣ Positions fixes des côtes
    const verticalLeft = minX - offset - textOffset - arrowSize;
    const verticalRight = maxX + offset + textOffset + arrowSize;
    const horizontalTop = minY - offset - textOffset - arrowSize;
    const horizontalBottom = maxY + offset + textOffset + arrowSize;

    // 3️⃣ Padding général
    const vbX = verticalLeft - padding;
    const vbY = horizontalTop - padding;
    const vbWidth = verticalRight - verticalLeft + 3 * padding;
    const vbHeight = horizontalBottom - horizontalTop + 2 * padding;

    // 4️⃣ Trouver la plus grande dimension
    let maxDim = -Infinity;
    let maxLengthIndex = -1;
    dimensions.forEach((dim, i) => {
      if (dim > maxDim) {
        maxDim = dim;
        maxLengthIndex = i;
      }
    });

    // 5️⃣ Dessiner les segments et les côtes
    let lines = "";
    segments.forEach((s, i) => {
      // segment principal
      lines += `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="black" stroke-width="2"/>`;

      const dim = dimensions[i];
      if (dim === undefined) return;

      let startX: number, startY: number, endX: number, endY: number;
      let textX = 0,
        textY = 0;

      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;

      // orientation de la côte
      let isVertical = Math.abs(dy) > Math.abs(dx);
      if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 1e-6) {
        const midX = (s.x1 + s.x2) / 2;
        const midY = (s.y1 + s.y2) / 2;
        const distVertical = Math.abs(midX - centerX);
        const distHorizontal = Math.abs(midY - centerY);
        isVertical = distVertical < distHorizontal;
      }

      if (isVertical) {
        const dir = s.x1 + s.x2 > 2 * centerX ? 1 : -1;
        startX = endX = dir > 0 ? verticalRight : verticalLeft;
        startY = s.y1;
        endY = s.y2;
        textX = textOffset * dir;
      } else {
        const dir = s.y1 + s.y2 > 2 * centerY ? 1 : -1;
        startY = endY = dir > 0 ? horizontalBottom : horizontalTop;
        startX = s.x1;
        endX = s.x2;
        textY = textOffset * dir;
      }

      // 🔹 Ajuster la plus grande côte avec widthAppui
      if (i === maxLengthIndex && widthAppui && segments[0]) {
        if (!isVertical) {
          startX = segments[0].x1; // x du premier point du premier segment
        } else {
          startY = segments[0].y1; // y du premier point du premier segment
        }
      }

      // ligne de côte
      lines += `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="red" stroke-width="1" stroke-dasharray="4"/>`;

      // flèches
      if (startX === endX) {
        lines += `
          <line x1="${startX - arrowSize}" y1="${startY}" x2="${
          startX + arrowSize
        }" y2="${startY}" stroke="red" stroke-width="1"/>
          <line x1="${startX - arrowSize}" y1="${endY}" x2="${
          startX + arrowSize
        }" y2="${endY}" stroke="red" stroke-width="1"/>
        `;
      } else {
        lines += `
          <line x1="${startX}" y1="${startY - arrowSize}" x2="${startX}" y2="${
          startY + arrowSize
        }" stroke="red" stroke-width="1"/>
          <line x1="${endX}" y1="${endY - arrowSize}" x2="${endX}" y2="${
          endY + arrowSize
        }" stroke="red" stroke-width="1"/>
        `;
      }

      // ligne de texte
      let displayDim = dim;
      if (i === maxLengthIndex && widthAppui) {
        displayDim = widthAppui; // afficher widthAppui pour la plus grande côte
      }

      const midX = (s.x1 + s.x2) / 2 + 2.3 * textX;
      const midY = (s.y1 + s.y2) / 2 + 3 * textY;
      lines += `<text x="${midX}" y="${midY}" fill="red" font-size="12" text-anchor="middle" dominant-baseline="middle">${displayDim}</text>`;
    });

    const svg = `<svg width="100%" height="100%" viewBox="${vbX} ${vbY} ${vbWidth} ${vbHeight}" xmlns="http://www.w3.org/2000/svg">
      ${lines}
    </svg>`;

    setSvgContent(svg);
  }, [
    segments,
    dimensions,
    widthAppui,
    padding,
    offset,
    textOffset,
    arrowSize,
  ]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #d1d5db",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
