import React from 'react';
import {
  FolderOpen,
  Grid3X3,
  HelpCircle,
  Camera,
  Share2,
  Sparkles,
  Download
} from 'lucide-react';

interface HeaderBarProps {
  onOpenLibrary: () => void;
  onToggleGrid: () => void;
  isGridOn: boolean;
  onOpenGuide: () => void;
  onCaptureSnapshot: () => void;
  hasSelectedImage: boolean;
  isToolsHidden: boolean;
  facingMode: 'environment' | 'user';
  onOpenSelectorModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenLibrary,
  onToggleGrid,
  isGridOn,
  onOpenGuide,
  onCaptureSnapshot,
  hasSelectedImage,
  isToolsHidden,
  facingMode,
  onOpenSelectorModal,
}) => {
  if (isToolsHidden) {
    return null;
  }

  return (
    <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 sm:px-6 sm:py-4 pointer-events-auto bg-gradient-to-b from-neutral-950/80 via-neutral-950/40 to-transparent">
      {/* App Branding */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
          <Sparkles className="w-4 h-4 fill-neutral-950" />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            AR Trace Draw
          </h1>
          <p className="text-[10px] text-neutral-400 hidden sm:block">
            Căn ke vẽ tranh qua camera
          </p>
        </div>
      </div>

      {/* Main Action: CHỌN ẢNH TỪ THƯ VIỆN / TẢI ẢNH & TÙY CHỌN CAMERA */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Camera Selector Option Button */}
        <button
          type="button"
          id="btn-header-camera-select"
          onClick={onOpenSelectorModal}
          title={`Đang dùng: ${facingMode === 'environment' ? 'Camera Sau (Giấy vẽ)' : 'Camera Trước (Selfie)'}. Bấm để chọn camera.`}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 backdrop-blur-md text-xs font-medium transition cursor-pointer"
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] sm:text-xs">
            {facingMode === 'environment' ? 'Cam Sau' : 'Cam Trước'}
          </span>
        </button>

        <button
          type="button"
          id="btn-main-open-library"
          onClick={onOpenLibrary}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 text-xs font-semibold shadow-lg shadow-amber-500/25 transition cursor-pointer border border-amber-400/40"
        >
          <FolderOpen className="w-4 h-4" />
          <span>{hasSelectedImage ? 'Đổi ảnh' : 'Chọn ảnh'}</span>
        </button>

        {/* Grid toggle */}
        <button
          type="button"
          id="btn-toggle-grid"
          onClick={onToggleGrid}
          title={isGridOn ? 'Tắt lưới toạ độ' : 'Bật lưới toạ độ căn giấy'}
          className={`p-2 rounded-xl border backdrop-blur-md transition cursor-pointer ${
            isGridOn
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/60'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>

        {/* Snapshot / capture */}
        <button
          type="button"
          id="btn-capture-snapshot"
          onClick={onCaptureSnapshot}
          title="Chụp lưu lại góc căn ke hiện tại"
          className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 backdrop-blur-md transition cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Guide button */}
        <button
          type="button"
          id="btn-open-guide"
          onClick={onOpenGuide}
          title="Hướng dẫn cách kê máy để vẽ"
          className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 backdrop-blur-md transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
