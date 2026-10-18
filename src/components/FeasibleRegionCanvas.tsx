import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LinearConstraint, ObjectiveFunction, VertexPoint } from '../types/problemTypes';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface FeasibleRegionCanvasProps {
  constraints: LinearConstraint[];
  objective?: ObjectiveFunction;
  vertices?: VertexPoint[];
  optimalVertex?: VertexPoint;
  xRange?: [number, number];
  yRange?: [number, number];
}

const LINE_COLORS = ['#2563eb', '#dc2626', '#d97706', '#9333ea', '#0891b2', '#4f46e5'];

export const FeasibleRegionCanvas: React.FC<FeasibleRegionCanvasProps> = ({
  constraints,
  objective,
  vertices = [],
  optimalVertex,
  xRange = [0, 50],
  yRange = [0, 60],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View viewport in math coordinates
  const [viewState, setViewState] = useState({
    minX: -5,
    maxX: Math.max(xRange[1] * 1.25, 30),
    minY: -5,
    maxY: Math.max(yRange[1] * 1.25, 30),
  });

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; view: typeof viewState } | null>(null);

  // Reset to initial bounds
  const handleReset = useCallback(() => {
    const maxX = Math.max(xRange[1] * 1.25, 30);
    const maxY = Math.max(yRange[1] * 1.25, 30);
    setViewState({
      minX: -maxX * 0.1,
      maxX,
      minY: -maxY * 0.1,
      maxY,
    });
  }, [xRange, yRange]);

  // Adjust on prop change
  useEffect(() => {
    handleReset();
  }, [handleReset]);

  // Zoom handlers
  const handleZoom = (factor: number) => {
    setViewState((prev) => {
      const cx = (prev.minX + prev.maxX) / 2;
      const cy = (prev.minY + prev.maxY) / 2;
      const spanX = (prev.maxX - prev.minX) * factor;
      const spanY = (prev.maxY - prev.minY) * factor;
      return {
        minX: cx - spanX / 2,
        maxX: cx + spanX / 2,
        minY: cy - spanY / 2,
        maxY: cy + spanY / 2,
      };
    });
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      view: { ...viewState },
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouseX, mouseY to math coordinates
    const mathX = viewState.minX + (mouseX / canvas.width) * (viewState.maxX - viewState.minX);
    const mathY = viewState.maxY - (mouseY / canvas.height) * (viewState.maxY - viewState.minY);
    setHoveredPoint({ x: mathX, y: mathY });

    if (isDragging && dragStartRef.current) {
      const dxPx = e.clientX - dragStartRef.current.clientX;
      const dyPx = e.clientY - dragStartRef.current.clientY;
      const spanX = dragStartRef.current.view.maxX - dragStartRef.current.view.minX;
      const spanY = dragStartRef.current.view.maxY - dragStartRef.current.view.minY;

      const dMathX = -(dxPx / canvas.width) * spanX;
      const dMathY = (dyPx / canvas.height) * spanY;

      setViewState({
        minX: dragStartRef.current.view.minX + dMathX,
        maxX: dragStartRef.current.view.maxX + dMathX,
        minY: dragStartRef.current.view.minY + dMathY,
        maxY: dragStartRef.current.view.maxY + dMathY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Export Canvas Image
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'Mien_Nghiem_He_BPT.png';
    a.click();
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure high DPR
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. WHITE BACKGROUND as required by user prompt:
    // "nền hệ trục tọa độ và bảng biến thiên màu trắng"
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const { minX, maxX, minY, maxY } = viewState;
    const toPxX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toPxY = (y: number) => ((maxY - y) / (maxY - minY)) * height;

    // 2. Draw Grid Lines
    const stepX = Math.pow(10, Math.floor(Math.log10((maxX - minX) / 6)));
    const actualStepX = (maxX - minX) / stepX > 15 ? stepX * 2 : stepX;
    const firstX = Math.floor(minX / actualStepX) * actualStepX;

    const stepY = Math.pow(10, Math.floor(Math.log10((maxY - minY) / 6)));
    const actualStepY = (maxY - minY) / stepY > 15 ? stepY * 2 : stepY;
    const firstY = Math.floor(minY / actualStepY) * actualStepY;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#f1f5f9';

    // Vertical grid
    for (let x = firstX; x <= maxX; x += actualStepX) {
      const px = toPxX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    // Horizontal grid
    for (let y = firstY; y <= maxY; y += actualStepY) {
      const py = toPxY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }

    // 3. Draw Feasible Region Polygon (if vertices exist)
    if (vertices && vertices.length >= 3) {
      ctx.save();
      ctx.beginPath();
      const firstPt = vertices[0];
      ctx.moveTo(toPxX(firstPt.x), toPxY(firstPt.y));
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(toPxX(vertices[i].x), toPxY(vertices[i].y));
      }
      ctx.closePath();

      // Emerald fill for feasible region
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.fill();

      // Emerald outline
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // 4. Draw Boundary Lines
    constraints.forEach((cstr, index) => {
      const color = LINE_COLORS[index % LINE_COLORS.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);

      const points: { px: number; py: number }[] = [];

      // If line is x = k (vertical)
      if (Math.abs(cstr.b) < 1e-9) {
        const xVal = cstr.c / cstr.a;
        if (xVal >= minX && xVal <= maxX) {
          points.push({ px: toPxX(xVal), py: 0 });
          points.push({ px: toPxX(xVal), py: height });
        }
      }
      // If line is y = k (horizontal)
      else if (Math.abs(cstr.a) < 1e-9) {
        const yVal = cstr.c / cstr.b;
        if (yVal >= minY && yVal <= maxY) {
          points.push({ px: 0, py: toPxY(yVal) });
          points.push({ px: width, py: toPxY(yVal) });
        }
      }
      // General line: a*x + b*y = c => y = (c - a*x)/b
      else {
        const yAtMinX = (cstr.c - cstr.a * minX) / cstr.b;
        const yAtMaxX = (cstr.c - cstr.a * maxX) / cstr.b;
        points.push({ px: toPxX(minX), py: toPxY(yAtMinX) });
        points.push({ px: toPxX(maxX), py: toPxY(yAtMaxX) });
      }

      if (points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].px, points[0].py);
        ctx.lineTo(points[1].px, points[1].py);
        ctx.stroke();

        // Label on line
        const midX = (points[0].px + points[1].px) / 2;
        const midY = (points[0].py + points[1].py) / 2;
        if (midX > 20 && midX < width - 60 && midY > 20 && midY < height - 20) {
          ctx.save();
          ctx.setLineDash([]);
          ctx.font = 'bold 11px system-ui';
          ctx.fillStyle = color;
          ctx.fillText(`(d${index + 1})`, midX + 6, midY - 6);
          ctx.restore();
        }
      }
      ctx.setLineDash([]);
    });

    // 5. Draw Coordinate Axes Ox, Oy
    const originPx = toPxX(0);
    const originPy = toPxY(0);

    ctx.strokeStyle = '#0f172a'; // Bold dark axis line
    ctx.lineWidth = 1.8;

    // x-axis
    if (originPy >= 0 && originPy <= height) {
      ctx.beginPath();
      ctx.moveTo(0, originPy);
      ctx.lineTo(width, originPy);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(width - 8, originPy - 4);
      ctx.lineTo(width, originPy);
      ctx.lineTo(width - 8, originPy + 4);
      ctx.fill();

      // "x" label
      ctx.font = 'bold 13px system-ui';
      ctx.fillText('x', width - 16, originPy - 8);
    }

    // y-axis
    if (originPx >= 0 && originPx <= width) {
      ctx.beginPath();
      ctx.moveTo(originPx, height);
      ctx.lineTo(originPx, 0);
      ctx.stroke();

      // Arrow
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(originPx - 4, 8);
      ctx.lineTo(originPx, 0);
      ctx.lineTo(originPx + 4, 8);
      ctx.fill();

      // "y" label
      ctx.font = 'bold 13px system-ui';
      ctx.fillText('y', originPx + 8, 16);
    }

    // "O" origin label
    ctx.font = 'bold 12px system-ui';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('O', originPx - 14, originPy + 16);

    // Number ticks on axes
    ctx.font = '10px system-ui';
    ctx.fillStyle = '#475569';

    // x-ticks
    for (let x = firstX; x <= maxX; x += actualStepX) {
      if (Math.abs(x) < 1e-4) continue;
      const px = toPxX(x);
      if (px > 10 && px < width - 10) {
        ctx.beginPath();
        ctx.moveTo(px, originPy - 3);
        ctx.lineTo(px, originPy + 3);
        ctx.stroke();
        ctx.fillText(`${x}`, px - 6, originPy + 15);
      }
    }

    // y-ticks
    for (let y = firstY; y <= maxY; y += actualStepY) {
      if (Math.abs(y) < 1e-4) continue;
      const py = toPxY(y);
      if (py > 10 && py < height - 10) {
        ctx.beginPath();
        ctx.moveTo(originPx - 3, py);
        ctx.lineTo(originPx + 3, py);
        ctx.stroke();
        ctx.fillText(`${y}`, originPx - 20, py + 4);
      }
    }

    // 6. Draw Vertex Points (O, A, B, C...)
    vertices.forEach((v) => {
      const px = toPxX(v.x);
      const py = toPxY(v.y);
      const isOpt = v.isOptimal;

      // Outer glow for optimal vertex
      if (isOpt) {
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#059669';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(px, py, isOpt ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isOpt ? '#10b981' : '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertex label
      ctx.font = isOpt ? 'bold 13px system-ui' : 'bold 12px system-ui';
      ctx.fillStyle = isOpt ? '#065f46' : '#0f172a';
      const coordStr = `${v.name}(${Number(v.x.toFixed(1))}; ${Number(v.y.toFixed(1))})`;
      ctx.fillText(coordStr, px + 8, py - 8);
    });

    ctx.restore();
  }, [viewState, constraints, vertices, optimalVertex]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg flex flex-col relative select-none"
    >
      {/* Top Banner inside Canvas Card */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-700 font-black">Hệ trục tọa độ Oxy</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">Miền nghiệm đa giác (Nền trắng SGK)</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shadow-sm"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shadow-sm"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors shadow-sm"
            title="Căn giữa lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportPNG}
            className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 cursor-pointer transition-colors shadow-sm ml-1 flex items-center gap-1 font-bold text-xs"
            title="Tải ảnh đồ thị PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Tải ảnh</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-[360px] sm:h-[440px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Live coordinate indicator */}
        {hoveredPoint && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-900/85 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-200 text-[11px] font-mono pointer-events-none">
            x = {hoveredPoint.x.toFixed(2)}, y = {hoveredPoint.y.toFixed(2)}
            {objective && (
              <span className="text-emerald-400 font-bold ml-2">
                F = {(objective.a * hoveredPoint.x + objective.b * hoveredPoint.y).toFixed(1)}
              </span>
            )}
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm text-[11px] space-y-1 max-w-[200px] pointer-events-none">
          <div className="font-bold text-slate-800 border-b border-slate-100 pb-0.5">Chú giải đồ thị:</div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded bg-emerald-500/25 border border-emerald-600 shrink-0"></span>
            <span>Miền nghiệm đa giác</span>
          </div>
          {optimalVertex && (
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300 shrink-0"></span>
              <span>Đỉnh tối ưu: {optimalVertex.name}</span>
            </div>
          )}
          {constraints.map((c, i) => (
            <div key={c.id} className="flex items-center gap-1.5 text-slate-600 truncate">
              <span
                className="w-2.5 h-0.5 shrink-0"
                style={{ backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }}
              ></span>
              <span className="truncate">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
