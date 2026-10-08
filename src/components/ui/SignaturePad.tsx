import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface SignaturePadProps {
  value?: string; // Base64 data URL
  onChange: (dataUrl: string) => void;
  title?: string;
  signeeName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  title = 'Digital Signature',
  signeeName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Only resize if needed to prevent clearing on non-resizing renders
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a'; // Deep Navy / Slate

    // If an existing signature value is provided and canvas is empty, load it
    if (value && !hasDrawn) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = value;
    }
  }, [value, hasDrawn]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setLastPoint(coords);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    if (!coords) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPoint(coords);
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onChange('');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PenTool className="w-4 h-4 text-blue-900" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</span>
          {signeeName && <span className="text-xs text-slate-500 font-medium">({signeeName})</span>}
        </div>
        <div className="flex items-center gap-2">
          {hasDrawn && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Signed
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs"
          >
            Clear Signature
          </Button>
        </div>
      </div>

      <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl overflow-hidden bg-white shadow-inner transition-colors touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-38 cursor-crosshair block"
          style={{ width: '100%', height: '152px' }}
        />

        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400 select-none">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 text-slate-400">
              <PenTool className="w-5 h-5 stroke-1.5" />
            </div>
            <p className="text-xs font-semibold text-slate-600">Sign here using mouse, finger or stylus</p>
            <p className="text-[11px] text-slate-400 font-medium">คลิกหรือลากเพื่อเซ็นชื่อบนพื้นที่นี้</p>
          </div>
        )}

        <div className="absolute bottom-4 left-6 right-6 border-b border-slate-300/80 pointer-events-none" />
        <span className="absolute bottom-1.5 right-6 text-[10px] font-mono font-bold text-slate-400 pointer-events-none uppercase tracking-wider">
          Sign above line
        </span>
      </div>
    </div>
  );
};
