import { useRef, useState, useEffect } from "react";

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function LineDrawer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [segments, setSegments] = useState<Segment[]>([]);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [drawing, setDrawing] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const allowedAngles = [0, 35, 45, 90, 135, 180, 225, 270, 315];

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

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleClick = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawing) return;
    const { x, y } = getCanvasCoords(e);
    e.preventDefault();
    if (lastPoint) {
      const snapped = snapAngle(lastPoint.x, lastPoint.y, x, y);
      setSegments([
        ...segments,
        { x1: lastPoint.x, y1: lastPoint.y, x2: snapped.x, y2: snapped.y },
      ]);
      setLastPoint({ x: snapped.x, y: snapped.y });
      setHoverPoint(null);
    } else {
      setLastPoint({ x, y });
    }
  };

  const handleMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!lastPoint || !drawing) return;
    const { x, y } = getCanvasCoords(e);
    e.preventDefault();
    setHoverPoint(snapAngle(lastPoint.x, lastPoint.y, x, y));
  };

  // 🔹 Mettre à jour la taille du canvas pour qu’il remplisse le container
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

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // set canvas size dynamically
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // segments existants
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    segments.forEach((seg) => {
      ctx.beginPath();
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
      ctx.stroke();
    });

    // segment en cours
    if (lastPoint && hoverPoint) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(hoverPoint.x, hoverPoint.y);
      ctx.stroke();
    }

    // dernier point
    if (lastPoint) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(draw, [segments, lastPoint, hoverPoint, canvasSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "80vh",
        border: "1px solid black",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ touchAction: "none", cursor: "crosshair", display: "block" }}
        onClick={handleClick}
        onMouseMove={handleMove}
        onTouchStart={handleClick}
        onTouchMove={handleMove}
      />
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            setSegments([]);
            setLastPoint(null);
            setHoverPoint(null);
          }}
        >
          Effacer tout
        </button>
        <button
          onClick={() => {
            if (segments.length === 0) return;
            const newSegs = [...segments];
            newSegs.pop();
            setSegments(newSegs);
            if (newSegs.length === 0) setLastPoint(null);
            else
              setLastPoint({
                x: newSegs[newSegs.length - 1].x2,
                y: newSegs[newSegs.length - 1].y2,
              });
          }}
        >
          Annuler dernier segment
        </button>
        <button onClick={() => setDrawing(!drawing)}>
          {drawing ? "Arrêter la saisie" : "Reprendre la saisie"}
        </button>
      </div>
    </div>
  );
}
