import { useRef, useEffect, useState } from "react";
import { Segment } from "../Profiles/LineDrawer";

interface SheetVisualizationProps {
  segments: Segment[];
  dimensions?: number[]; // dimensions réelles pour chaque segment
}

export function SheetVisualization({
  segments,
  dimensions,
}: SheetVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });

  // Met à jour la taille du canvas selon les segments
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth } = containerRef.current;

      if (segments.length > 0) {
        const allX = segments.flatMap((s) => [s.x1, s.x2]);
        const allY = segments.flatMap((s) => [s.y1, s.y2]);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);
        const padding = 60;

        const width = maxX - minX + 2 * padding;
        const height = maxY - minY + 2 * padding;

        setCanvasSize({ width, height });
      } else {
        setCanvasSize({ width: clientWidth, height: 150 });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [segments]);

  // Fonction pour dessiner les flèches aux extrémités
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number
  ) => {
    const arrowAngle = Math.PI / 6; // 30°
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - length * Math.cos(angle - arrowAngle),
      y - length * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - length * Math.cos(angle + arrowAngle),
      y - length * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner grille
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (segments.length === 0) return;

    const allX = segments.flatMap((s) => [s.x1, s.x2]);
    const allY = segments.flatMap((s) => [s.y1, s.y2]);
    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const padding = 60;

    segments.forEach((seg, index) => {
      const x1 = seg.x1 - minX + padding;
      const y1 = seg.y1 - minY + padding;
      const x2 = seg.x2 - minX + padding;
      const y2 = seg.y2 - minY + padding;

      // Dessiner segment
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Dessiner points du segment
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(x1, y1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Dessiner la cote
      const dim =
        dimensions && dimensions[index]
          ? dimensions[index]
          : Math.round(
              Math.sqrt((seg.x2 - seg.x1) ** 2 + (seg.y2 - seg.y1) ** 2)
            );

      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "red";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const offset = 15;
      const arrowLength = 6;

      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);

      // Déterminer orientation forcée de la cote
      let isHorizontalCote = false;
      if (Math.abs(dx - dy) < 1) {
        // diagonale parfaite → cote horizontale
        isHorizontalCote = true;
      } else if (dx > dy) {
        isHorizontalCote = false; // cote verticale
      } else {
        isHorizontalCote = true; // cote horizontale
      }

      if (isHorizontalCote) {
        // ligne de cote horizontale
        const cx1 = x1 - offset;
        const cx2 = x2 - offset;
        const cy1 = y1;
        const cy2 = y2;

        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();

        // points aux extrémités
        ctx.beginPath();
        ctx.arc(cx1, cy1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx2, cy2, 3, 0, Math.PI * 2);
        ctx.fill();

        // flèches
        drawArrow(ctx, cx1, cy1, Math.PI, arrowLength);
        drawArrow(ctx, cx2, cy2, 0, arrowLength);

        // texte dimension
        ctx.fillText(dim + "", (cx1 + cx2) / 2, (cy1 + cy2) / 2 - 5);
      } else {
        // ligne de cote verticale
        const cx1 = x1;
        const cx2 = x2;
        const cy1 = y1 - offset;
        const cy2 = y2 - offset;

        ctx.beginPath();
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();

        // points aux extrémités
        ctx.beginPath();
        ctx.arc(cx1, cy1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx2, cy2, 3, 0, Math.PI * 2);
        ctx.fill();

        // flèches
        drawArrow(ctx, cx1, cy1, -Math.PI / 2, arrowLength);
        drawArrow(ctx, cx2, cy2, Math.PI / 2, arrowLength);

        // texte dimension
        ctx.fillText(dim + "", (cx1 + cx2) / 2 - 5, (cy1 + cy2) / 2);
      }
    });
  }, [segments, dimensions, canvasSize]);

  return (
    <div ref={containerRef} className="p-4 rounded-lg bg-gray-50">
      <h4 className="mb-3 text-sm font-medium text-gray-900">
        Technical Drawing
      </h4>
      <div className="p-4 bg-white border rounded" style={{ overflow: "auto" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: canvasSize.height,
            border: "1px solid #d1d5db",
          }}
        />
      </div>
    </div>
  );
}
