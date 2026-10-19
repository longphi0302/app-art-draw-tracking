import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FilterSettings, TransformSettings } from '../types';
import { Lock, Unlock, Move, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface TracingOverlayProps {
  imageUrl: string | null;
  filters: FilterSettings;
  transforms: TransformSettings;
  onUpdateTransforms: (updater: (prev: TransformSettings) => TransformSettings) => void;
  onOpenLibrary: () => void;
}

export const TracingOverlay: React.FC<TracingOverlayProps> = ({
  imageUrl,
  filters,
  transforms,
  onUpdateTransforms,
  onOpenLibrary,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rawImageRef = useRef<HTMLImageElement | null>(null);

  // Touch tracking state for pinch zoom and drag
  const touchStateRef = useRef<{
    isDragging: boolean;
    startDistance: number;
    startScale: number;
    startX: number;
    startY: number;
    initialTransformX: number;
    initialTransformY: number;
    startAngle: number;
    startRotation: number;
  }>({
    isDragging: false,
    startDistance: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    initialTransformX: 0,
    initialTransformY: 0,
    startAngle: 0,
    startRotation: 0,
  });

  const [processedSketchUrl, setProcessedSketchUrl] = useState<string | null>(null);
  const [isProcessingSketch, setIsProcessingSketch] = useState<boolean>(false);

  // Process edge detection / sketch mode if enabled
  useEffect(() => {
    if (!imageUrl) {
      setProcessedSketchUrl(null);
      return;
    }

    if (!filters.sketchMode) {
      setProcessedSketchUrl(null);
      return;
    }

    setIsProcessingSketch(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const offCanvas = document.createElement('canvas');
        const maxDimension = 900; // Keep processing fast & crisp
        let width = img.naturalWidth || 500;
        let height = img.naturalHeight || 500;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        offCanvas.width = width;
        offCanvas.height = height;

        const ctx = offCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const totalPixels = width * height;

        // Convert to grayscale first
        const gray = new Float32Array(totalPixels);
        for (let i = 0; i < totalPixels; i++) {
          const idx = i * 4;
          gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        }

        // Apply simple Sobel filter for edge detection
        const output = ctx.createImageData(width, height);
        const outData = output.data;
        const threshold = filters.sketchThreshold || 30;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            // Horizontal gradient
            const gx =
              -1 * gray[(y - 1) * width + (x - 1)] +
              1 * gray[(y - 1) * width + (x + 1)] +
              -2 * gray[y * width + (x - 1)] +
              2 * gray[y * width + (x + 1)] +
              -1 * gray[(y + 1) * width + (x - 1)] +
              1 * gray[(y + 1) * width + (x + 1)];

            // Vertical gradient
            const gy =
              -1 * gray[(y - 1) * width + (x - 1)] +
              -2 * gray[(y - 1) * width + x] +
              -1 * gray[(y - 1) * width + (x + 1)] +
              1 * gray[(y + 1) * width + (x - 1)] +
              2 * gray[(y + 1) * width + x] +
              1 * gray[(y + 1) * width + (x + 1)];

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const pIdx = idx * 4;

            if (magnitude > threshold) {
              // Edge line (dark pencil color)
              outData[pIdx] = 17; // R
              outData[pIdx + 1] = 24; // G
              outData[pIdx + 2] = 39; // B
              outData[pIdx + 3] = Math.min(255, magnitude * 2); // Alpha based on strength
            } else {
              // Transparent background so camera paper shows clearly through!
              outData[pIdx] = 255;
              outData[pIdx + 1] = 255;
              outData[pIdx + 2] = 255;
              outData[pIdx + 3] = 0;
            }
          }
        }

        ctx.putImageData(output, 0, 0);
        setProcessedSketchUrl(offCanvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Sketch processing error:', err);
      } finally {
        setIsProcessingSketch(false);
      }
    };
    img.onerror = () => {
      setIsProcessingSketch(false);
    };
    img.src = imageUrl;
  }, [imageUrl, filters.sketchMode, filters.sketchThreshold]);

  // CSS Filter string calculation
  const getFilterStyle = (): string => {
    const parts: string[] = [];
    parts.push(`brightness(${filters.brightness}%)`);
    parts.push(`contrast(${filters.contrast}%)`);
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.grayscale) parts.push('grayscale(100%)');
    if (filters.invert) parts.push('invert(100%)');
    return parts.join(' ');
  };

  // Touch gesture listeners for intuitive pinch-to-zoom and drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (transforms.isLocked) return;

    if (e.touches.length === 1) {
      // Single finger drag
      touchStateRef.current.isDragging = true;
      touchStateRef.current.startX = e.touches[0].clientX;
      touchStateRef.current.startY = e.touches[0].clientY;
      touchStateRef.current.initialTransformX = transforms.x;
      touchStateRef.current.initialTransformY = transforms.y;
    } else if (e.touches.length === 2) {
      // Two finger pinch to zoom and rotate
      touchStateRef.current.isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStateRef.current.startDistance = Math.hypot(dx, dy);
      touchStateRef.current.startScale = transforms.scale;
      touchStateRef.current.startAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      touchStateRef.current.startRotation = transforms.rotation;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (transforms.isLocked) return;

    if (e.touches.length === 1 && touchStateRef.current.isDragging) {
      const deltaX = e.touches[0].clientX - touchStateRef.current.startX;
      const deltaY = e.touches[0].clientY - touchStateRef.current.startY;
      onUpdateTransforms(prev => ({
        ...prev,
        x: touchStateRef.current.initialTransformX + deltaX,
        y: touchStateRef.current.initialTransformY + deltaY,
      }));
    } else if (e.touches.length === 2 && touchStateRef.current.startDistance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.hypot(dx, dy);
      const scaleMultiplier = newDistance / touchStateRef.current.startDistance;
      const newScale = Math.max(0.2, Math.min(6, touchStateRef.current.startScale * scaleMultiplier));

      // Calculate rotation delta
      const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const angleDelta = currentAngle - touchStateRef.current.startAngle;
      const newRotation = (touchStateRef.current.startRotation + angleDelta) % 360;

      onUpdateTransforms(prev => ({
        ...prev,
        scale: Number(newScale.toFixed(2)),
        rotation: Math.round(newRotation),
      }));
    }
  };

  const handleTouchEnd = () => {
    touchStateRef.current.isDragging = false;
    touchStateRef.current.startDistance = 0;
  };

  // Mouse drag support for desktop/trackpad
  const handleMouseDown = (e: React.MouseEvent) => {
    if (transforms.isLocked || e.button !== 0) return;
    touchStateRef.current.isDragging = true;
    touchStateRef.current.startX = e.clientX;
    touchStateRef.current.startY = e.clientY;
    touchStateRef.current.initialTransformX = transforms.x;
    touchStateRef.current.initialTransformY = transforms.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!touchStateRef.current.isDragging) return;
      const deltaX = moveEvent.clientX - touchStateRef.current.startX;
      const deltaY = moveEvent.clientY - touchStateRef.current.startY;
      onUpdateTransforms(prev => ({
        ...prev,
        x: touchStateRef.current.initialTransformX + deltaX,
        y: touchStateRef.current.initialTransformY + deltaY,
      }));
    };

    const handleMouseUp = () => {
      touchStateRef.current.isDragging = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (transforms.isLocked) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    onUpdateTransforms(prev => ({
      ...prev,
      scale: Math.max(0.2, Math.min(5, Number((prev.scale + zoomDelta).toFixed(2))))
    }));
  };

  const effectiveImageUrl = (filters.sketchMode && processedSketchUrl) ? processedSketchUrl : imageUrl;

  return (
    <div
      ref={containerRef}
      id="tracing-overlay-container"
      className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-10 select-none ${
        transforms.isLocked ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {effectiveImageUrl ? (
        <div
          id="tracing-image-wrapper"
          style={{
            transform: `translate3d(${transforms.x}px, ${transforms.y}px, 0) scale(${transforms.scale}) rotate(${transforms.rotation}deg) scaleX(${transforms.flipH ? -1 : 1}) scaleY(${transforms.flipV ? -1 : 1})`,
            transformOrigin: 'center center',
            opacity: filters.opacity,
            filter: getFilterStyle(),
            transition: touchStateRef.current.isDragging ? 'none' : 'transform 0.05s ease-out, opacity 0.15s ease',
          }}
          className="relative max-w-[85vw] max-h-[85vh] flex items-center justify-center will-change-transform pointer-events-none"
        >
          <img
            ref={rawImageRef}
            src={effectiveImageUrl}
            alt="Mẫu căn ke vẽ tranh"
            className="w-auto h-auto max-w-[500px] max-h-[500px] object-contain drop-shadow-sm select-none"
            draggable={false}
          />

          {/* Outline indicator when moving to show boundaries */}
          {!transforms.isLocked && (
            <div className="absolute inset-0 border-2 border-dashed border-sky-400/40 rounded-lg pointer-events-none -m-2"></div>
          )}
        </div>
      ) : (
        /* Empty state prompt */
        <div className="p-6 text-center max-w-xs bg-neutral-900/85 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl pointer-events-auto">
          <p className="text-sm font-medium text-neutral-200 mb-3">
            Chưa có hình ảnh để căn ke
          </p>
          <button
            type="button"
            onClick={onOpenLibrary}
            className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-semibold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Chọn ảnh mẫu hoặc Tải ảnh lên
          </button>
        </div>
      )}

      {/* Locked overlay badge to remind user */}
      {transforms.isLocked && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/85 border border-amber-500/40 text-amber-400 text-xs font-medium backdrop-blur-md shadow-lg pointer-events-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Đã khóa vị trí tranh vẽ (Chạm vẽ an toàn)</span>
          <button
            type="button"
            onClick={() => onUpdateTransforms(prev => ({ ...prev, isLocked: false }))}
            className="ml-1 underline hover:text-amber-300 cursor-pointer"
          >
            Mở khóa
          </button>
        </div>
      )}
    </div>
  );
};
