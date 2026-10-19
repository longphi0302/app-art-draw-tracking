import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CameraView } from './components/CameraView';
import { TracingOverlay } from './components/TracingOverlay';
import { FilterControls } from './components/FilterControls';
import { ImageLibraryModal } from './components/ImageLibraryModal';
import { GuideModal } from './components/GuideModal';
import { HeaderBar } from './components/HeaderBar';
import { CameraSelectorModal } from './components/CameraSelectorModal';
import { SAMPLE_IMAGES } from './data/sampleImages';
import { FilterSettings, TransformSettings, ImageTemplate, CameraDeviceOption } from './types';

export default function App() {
  // Current active sketch / image (default to Anime Warrior sketch similar to the user's prompt photo!)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(SAMPLE_IMAGES[0].url);
  const [currentTemplateTitle, setCurrentTemplateTitle] = useState<string>(SAMPLE_IMAGES[0].title);

  // Camera selection state (Front vs Back camera, detected devices)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [availableCameras, setAvailableCameras] = useState<CameraDeviceOption[]>([]);
  const [isCameraSelectorOpen, setIsCameraSelectorOpen] = useState<boolean>(false);

  // Filters state (Độ mờ, Sáng, Tương phản, Làm mờ nhòe, Tách nét vẽ, Đảo màu)
  const [filters, setFilters] = useState<FilterSettings>({
    opacity: 0.5, // 50% opacity ideal for seeing both sketch and paper
    brightness: 100, // 100% normal
    contrast: 120, // slightly boosted contrast for crisp lines
    blur: 0, // 0px default blur
    invert: false,
    grayscale: false,
    sketchMode: false,
    sketchThreshold: 35,
  });

  // Transform & Alignment state
  const [transforms, setTransforms] = useState<TransformSettings>({
    x: 0,
    y: -20,
    scale: 1.0,
    rotation: 0,
    flipH: false,
    flipV: false,
    isLocked: false,
  });

  // UI Modals & State
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isGridOn, setIsGridOn] = useState<boolean>(false);
  const [isToolsHidden, setIsToolsHidden] = useState<boolean>(false);
  const [snapshotSuccessToast, setSnapshotSuccessToast] = useState<string | null>(null);

  // Video element ref for snapshot
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Reset filter settings
  const handleResetFilters = useCallback(() => {
    setFilters({
      opacity: 0.5,
      brightness: 100,
      contrast: 100,
      blur: 0,
      invert: false,
      grayscale: false,
      sketchMode: false,
      sketchThreshold: 35,
    });
  }, []);

  // Reset transform settings to center
  const handleResetTransforms = useCallback(() => {
    setTransforms({
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      flipH: false,
      flipV: false,
      isLocked: false,
    });
  }, []);

  // Handle image selection from preset library or file upload
  const handleSelectImage = useCallback((url: string, template?: ImageTemplate) => {
    setSelectedImageUrl(url);
    if (template) {
      setCurrentTemplateTitle(template.title);
    } else {
      setCurrentTemplateTitle('Ảnh người dùng tải lên');
    }
    // Auto center
    setTransforms(prev => ({
      ...prev,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
    }));
  }, []);

  const handleSelectFacingMode = useCallback((mode: 'environment' | 'user') => {
    setFacingMode(mode);
    setSelectedDeviceId(undefined);
  }, []);

  const handleSelectDevice = useCallback((deviceId: string, facing: 'environment' | 'user') => {
    setSelectedDeviceId(deviceId);
    setFacingMode(facing);
  }, []);

  const handleCameraReady = useCallback((el: HTMLVideoElement) => {
    videoElementRef.current = el;
  }, []);

  const handleOpenSelectorModal = useCallback(() => {
    setIsCameraSelectorOpen(true);
  }, []);

  const handleCloseSelectorModal = useCallback(() => {
    setIsCameraSelectorOpen(false);
  }, []);

  const handleOpenLibrary = useCallback(() => {
    setIsLibraryOpen(true);
  }, []);

  const handleCloseLibrary = useCallback(() => {
    setIsLibraryOpen(false);
  }, []);

  const handleOpenGuide = useCallback(() => {
    setIsGuideOpen(true);
  }, []);

  const handleCloseGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setIsGridOn(prev => !prev);
  }, []);

  const handleToggleHideTools = useCallback(() => {
    setIsToolsHidden(prev => !prev);
  }, []);

  // Capture snapshot of the current view (camera + tracing overlay)
  const handleCaptureSnapshot = useCallback(() => {
    const canvas = document.createElement('canvas');
    const width = window.innerWidth || 1080;
    const height = window.innerHeight || 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background camera frame if available
    if (videoElementRef.current && videoElementRef.current.videoWidth > 0) {
      try {
        ctx.drawImage(videoElementRef.current, 0, 0, width, height);
      } catch (err) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    }

    // Draw overlay image if available
    if (selectedImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = filters.opacity;
        ctx.translate(width / 2 + transforms.x, height / 2 + transforms.y);
        ctx.rotate((transforms.rotation * Math.PI) / 180);
        ctx.scale(
          transforms.scale * (transforms.flipH ? -1 : 1),
          transforms.scale * (transforms.flipV ? -1 : 1)
        );

        const imgWidth = Math.min(width * 0.75, 500);
        const aspectRatio = (img.naturalHeight || 1) / (img.naturalWidth || 1);
        const imgHeight = imgWidth * aspectRatio;

        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        ctx.restore();

        // Trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `ar-draw-tracing-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setSnapshotSuccessToast('Đã chụp và tải ảnh mẫu căn ke về thiết bị!');
        setTimeout(() => setSnapshotSuccessToast(null), 3000);
      };
      img.src = selectedImageUrl;
    }
  }, [selectedImageUrl, filters, transforms]);

  // Prevent accidental mobile browser bounce or gestures while dragging
  useEffect(() => {
    const preventTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        // Allow pinch gesture inside component
      }
    };
    document.addEventListener('touchmove', preventTouch, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventTouch);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-neutral-100 flex flex-col font-sans select-none">
      {/* 1. Camera View (Background) */}
      <CameraView
        onCameraReady={handleCameraReady}
        showGrid={isGridOn}
        facingMode={facingMode}
        selectedDeviceId={selectedDeviceId}
        onFacingModeChange={handleSelectFacingMode}
        onDeviceChange={handleSelectDevice}
        availableCameras={availableCameras}
        onAvailableCamerasChange={setAvailableCameras}
        onOpenSelectorModal={handleOpenSelectorModal}
      />

      {/* 2. Tracing Overlay (Overlaid target image with touch gesture & live filters) */}
      <TracingOverlay
        imageUrl={selectedImageUrl}
        filters={filters}
        transforms={transforms}
        onUpdateTransforms={setTransforms}
        onOpenLibrary={handleOpenLibrary}
      />

      {/* 3. Top Navigation Bar with library trigger & controls */}
      <HeaderBar
        onOpenLibrary={handleOpenLibrary}
        onToggleGrid={handleToggleGrid}
        isGridOn={isGridOn}
        onOpenGuide={handleOpenGuide}
        onCaptureSnapshot={handleCaptureSnapshot}
        hasSelectedImage={!!selectedImageUrl}
        isToolsHidden={isToolsHidden}
        facingMode={facingMode}
        onOpenSelectorModal={handleOpenSelectorModal}
      />

      {/* 4. Bottom Controls Drawer (Opacity, Brightness, Contrast, Blur, Transform, Lock) */}
      <FilterControls
        filters={filters}
        transforms={transforms}
        onUpdateFilters={setFilters}
        onUpdateTransforms={setTransforms}
        onResetFilters={handleResetFilters}
        onResetTransforms={handleResetTransforms}
        onOpenLibrary={handleOpenLibrary}
        isToolsHidden={isToolsHidden}
        onToggleHideTools={handleToggleHideTools}
        facingMode={facingMode}
        onOpenSelectorModal={handleOpenSelectorModal}
      />

      {/* 5. Image Selection & Upload Modal */}
      <ImageLibraryModal
        isOpen={isLibraryOpen}
        onClose={handleCloseLibrary}
        onSelectImage={handleSelectImage}
        selectedImageUrl={selectedImageUrl}
      />

      {/* 6. Tracing Setup Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
      />

      {/* 7. Camera Selection Modal (Front vs Back camera & multi-lens picker) */}
      <CameraSelectorModal
        isOpen={isCameraSelectorOpen}
        onClose={handleCloseSelectorModal}
        facingMode={facingMode}
        selectedDeviceId={selectedDeviceId}
        availableCameras={availableCameras}
        onSelectFacingMode={handleSelectFacingMode}
        onSelectDevice={handleSelectDevice}
      />

      {/* 8. Success Toast Notification */}
      {snapshotSuccessToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600/90 text-white text-xs font-medium rounded-full shadow-2xl backdrop-blur-md animate-bounce pointer-events-none">
          {snapshotSuccessToast}
        </div>
      )}
    </div>
  );
}
