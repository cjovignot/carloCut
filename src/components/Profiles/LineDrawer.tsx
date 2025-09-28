import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "../UI/Button";
import { Square, Play, RefreshCw, Undo2, Info } from "lucide-react";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LineDrawerProps {
  segments?: Segment[];
  onSegmentsChange?: (segments: Segment[]) => void;
}

export default function LineDrawer({
  segments: propSegments,
  onSegmentsChange,
}: LineDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [segments, setSegments] = useState<Segment[]>(propSegments || []);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [drawing, setDrawing] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const allowedAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  // Sync props
  useEffect(() => {
    if (propSegments) setSegments(propSegments);
  }, [propSegments]);

  // Snap angle
  const snapAngle = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;
    const closest = allowedAngles.reduce((prev, curr) =>
      Math.abs(curr - angleDeg) < Math.abs(prev - angleDeg) ? curr : prev
    );
    const rad = (closest * Math.PI) / 180;
    return {
      x: x1 + distance * Math.cos(rad),
      y: y1 + distance * Math.sin(rad),
    };
  };

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Start drawing
  const handleStart = useCallback(
    (x: number, y: number) => {
      if (!drawing) return;
      if (lastPoint) {
        const snapped = snapAngle(lastPoint.x, lastPoint.y, x, y);
        const newSeg: Segment = {
          x1: lastPoint.x,
          y1: lastPoint.y,
          x2: snapped.x,
          y2: snapped.y,
        };
        const updatedSegs = [...segments, newSeg];
        setSegments(updatedSegs);
        setLastPoint({ x: snapped.x, y: snapped.y });
        setHoverPoint(null);
        onSegmentsChange?.(updatedSegs);
      } else {
        setLastPoint({ x, y });
      }
    },
    [drawing, lastPoint, segments, onSegmentsChange]
  );

  const handleMove = useCallback(
    (x: number, y: number) => {
      if (!lastPoint || !drawing) return;
      setHoverPoint(snapAngle(lastPoint.x, lastPoint.y, x, y));
    },
    [lastPoint, drawing]
  );

  // Touch
  const handleTouch = useCallback(
    (e: TouchEvent) => {
      if (!canvasRef.current) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        const { clientX, clientY } = e.touches[0];
        const coords = getCanvasCoords(clientX, clientY);
        handleStart(coords.x, coords.y);
      }
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!canvasRef.current) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        const { clientX, clientY } = e.touches[0];
        const coords = getCanvasCoords(clientX, clientY);
        handleMove(coords.x, coords.y);
      }
    },
    [handleMove]
  );

  // Canvas resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Draw
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--color-primary") || "red";
    const secondary = style.getPropertyValue("--color-secondary") || "#ccc";
    const textColor = style.getPropertyValue("--color-text") || "black";
    const lastPointColor = style.getPropertyValue("--color-accent") || "blue";

    // Canvas background
    ctx.fillStyle = style.getPropertyValue("--color-background") || "#f9fafb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Existing segments
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    segments.forEach((seg, i) => {
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();

      const midX = (seg.x1 + seg.x2) / 2;
      const midY = (seg.y1 + seg.y2) / 2;
      ctx.fillStyle = primary;
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${i + 1}`, midX, midY);
    });

    // Current segment
    if (lastPoint && hoverPoint) {
      ctx.strokeStyle = primary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(hoverPoint.x, hoverPoint.y);
      ctx.stroke();
    }

    // Last point
    if (lastPoint) {
      ctx.fillStyle = lastPointColor;
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(draw, [segments, lastPoint, hoverPoint, canvasSize]);

  // Touch listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouch, handleTouchMove]);

  // Update segment (external)
  // const updateSegment = (index: number, length: number, angleDeg: number) => {
  //   setSegments((prev) => {
  //     if (!prev[index]) return prev;
  //     const updated = [...prev];
  //     const seg = updated[index];
  //     const rad = (angleDeg * Math.PI) / 180;
  //     updated[index] = {
  //       x1: seg.x1,
  //       y1: seg.y1,
  //       x2: seg.x1 + length * Math.cos(rad),
  //       y2: seg.y1 + length * Math.sin(rad),
  //     };
  //     onSegmentsChange?.(updated);
  //     return updated;
  //   });
  // };

  return (
    <div className="">
      {/* Buttons */}
      <div className="flex justify-end h-10 my-3 space-x-3">
        <Button
          className="!p-3 !bg-green-700 !text-white"
          disabled={!drawing}
          type="button"
          variant="outline"
          onClick={() => {
            if (segments.length === 0) return;
            const newSegs = segments.slice(0, -1);
            setSegments(newSegs);
            const last = newSegs[newSegs.length - 1];
            setLastPoint(last ? { x: last.x2, y: last.y2 } : null);
            setHoverPoint(null);
            onSegmentsChange?.(newSegs);
          }}
        >
          <Undo2 className="w-4 h-5" />
        </Button>

        <Button
          type="button"
          className="!p-3 !text-white !bg-blue-600"
          disabled={!drawing}
          variant="outline"
          onClick={() => {
            setSegments([]);
            setLastPoint(null);
            setHoverPoint(null);
            onSegmentsChange?.([]);
          }}
        >
          <RefreshCw className="w-4 h-5" />
        </Button>

        <Button
          className={`!p-3 !text-white ${
            !drawing ? "!bg-green-600" : "!bg-red-700"
          }`}
          type="button"
          variant="outline"
          onClick={() => setDrawing(!drawing)}
        >
          {drawing ? (
            <Square className="w-4 h-5" />
          ) : (
            <Play className="w-4 h-5" />
          )}
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          marginBottom: "20px",
          height: "40vh",
          position: "relative",
          borderRadius: "20px",
        }}
      >
        <p
          className="absolute flex items-center pt-2 pl-3 text-sm italic text-gray-700"
          style={{ color: "var(--color-info)" }}
        >
          <Info className="w-4 h-4 mr-1" />
          Dessiner le profilé point par point
        </p>
        <canvas
          ref={canvasRef}
          style={{
            touchAction: "none",
            cursor: "crosshair",
            display: "block",
            border: `2px dashed var(--color-info)`,
            borderRadius: "20px",
          }}
          onMouseDown={(e) => {
            const coords = getCanvasCoords(e.clientX, e.clientY);
            handleStart(coords.x, coords.y);
          }}
          onMouseMove={(e) => {
            const coords = getCanvasCoords(e.clientX, e.clientY);
            handleMove(coords.x, coords.y);
          }}
          onMouseUp={() => setHoverPoint(null)}
          onMouseLeave={() => setHoverPoint(null)}
        />
      </div>
    </div>
  );
}
