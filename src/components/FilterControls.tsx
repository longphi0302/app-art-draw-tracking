import React, { useState } from 'react';
import { FilterSettings, TransformSettings } from '../types';
import {
  Sliders,
  Sun,
  Contrast,
  Droplets,
  Layers,
  Lock,
  Unlock,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  RefreshCw,
  FolderOpen,
  Camera
} from 'lucide-react';

interface FilterControlsProps {
  filters: FilterSettings;
  transforms: TransformSettings;
  onUpdateFilters: (updater: (prev: FilterSettings) => FilterSettings) => void;
  onUpdateTransforms: (updater: (prev: TransformSettings) => TransformSettings) => void;
  onResetFilters: () => void;
  onResetTransforms: () => void;
  onOpenLibrary: () => void;
  isToolsHidden: boolean;
  onToggleHideTools: () => void;
  facingMode?: 'environment' | 'user';
  onOpenSelectorModal?: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  transforms,
  onUpdateFilters,
  onUpdateTransforms,
  onResetFilters,
  onResetTransforms,
  onOpenLibrary,
  isToolsHidden,
  onToggleHideTools,
  facingMode,
  onOpenSelectorModal,
}) => {
  const [activeTab, setActiveTab] = useState<'opacity' | 'filters' | 'transform'>('opacity');

  if (isToolsHidden) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          type="button"
          id="btn-show-tools"
          onClick={onToggleHideTools}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 text-neutral-200 border border-neutral-700/80 shadow-2xl backdrop-blur-md hover:bg-neutral-800 text-xs font-medium transition active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-4 h-4 text-amber-400" />
          <span>Hiện công cụ vẽ</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col items-center pointer-events-auto">
      {/* Quick Collapse / Lock Header Bar */}
      <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-lg text-xs">
        <button
          type="button"
          id="btn-hide-tools"
          onClick={onToggleHideTools}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-neutral-300 hover:text-white rounded-full transition cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>Ẩn công cụ (Hide tools)</span>
        </button>

        <span className="w-px h-3.5 bg-neutral-700"></span>

        {/* Lock/Unlock Position Toggle */}
        <button
          type="button"
          id="btn-lock-toggle"
          onClick={() => onUpdateTransforms(prev => ({ ...prev, isLocked: !prev.isLocked }))}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition active:scale-95 cursor-pointer ${
            transforms.isLocked
              ? 'bg-amber-500 text-neutral-950 shadow-sm'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          {transforms.isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Đã khóa vị trí</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Chưa khóa</span>
            </>
          )}
        </button>

        {/* Quick Camera Option Button */}
        {onOpenSelectorModal && (
          <>
            <span className="w-px h-3.5 bg-neutral-700"></span>
            <button
              type="button"
              id="btn-bottom-camera-select"
              onClick={onOpenSelectorModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition cursor-pointer"
              title="Đổi camera trước / sau"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>{facingMode === 'environment' ? 'Cam Sau' : 'Cam Trước'}</span>
            </button>
          </>
        )}
      </div>

      {/* Main Drawer Panel */}
      <div className="w-full max-w-xl mx-auto bg-neutral-900/95 border-t sm:border border-neutral-800 sm:rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-1 mb-3 pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-1 bg-neutral-950/60 p-1 rounded-xl">
            <button
              type="button"
              id="tab-opacity"
              onClick={() => setActiveTab('opacity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'opacity'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Độ mờ ({Math.round(filters.opacity * 100)}%)</span>
            </button>

            <button
              type="button"
              id="tab-filters"
              onClick={() => setActiveTab('filters')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'filters'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sáng / Tương phản / Nét</span>
            </button>

            <button
              type="button"
              id="tab-transform"
              onClick={() => setActiveTab('transform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'transform'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Căn chỉnh</span>
            </button>
          </div>

          {/* Quick open image library button */}
          <button
            type="button"
            id="btn-open-library-shortcut"
            onClick={onOpenLibrary}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition active:scale-95 cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Đổi ảnh</span>
          </button>
        </div>

        {/* Tab 1: OPACITY (Độ mờ / Độ trong suốt) */}
        {activeTab === 'opacity' && (
          <div className="space-y-3 py-1">
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="w-4 h-4 text-amber-400" />
                Độ mờ ảnh (Opacity để nhìn xuyên thấu giấy vẽ)
              </span>
              <span className="font-mono text-amber-400 font-semibold">
                {Math.round(filters.opacity * 100)}%
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              id="slider-opacity"
              min="0.10"
              max="1.0"
              step="0.02"
              value={filters.opacity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateFilters(prev => ({ ...prev, opacity: val }));
              }}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Quick opacity presets */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[0.2, 0.35, 0.5, 0.75, 1.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onUpdateFilters(prev => ({ ...prev, opacity: preset }))}
                  className={`py-1 text-xs rounded-lg border transition cursor-pointer ${
                    Math.abs(filters.opacity - preset) < 0.04
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                      : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/50 hover:bg-neutral-800'
                  }`}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: FILTERS (Độ sáng, Tương phản, Làm mờ, Nét vẽ phác thảo) */}
        {activeTab === 'filters' && (
          <div className="space-y-3 py-1">
            {/* Brightness slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Độ sáng (Brightness)
                </span>
                <span className="font-mono text-neutral-400">{filters.brightness}%</span>
              </div>
              <input
                type="range"
                id="slider-brightness"
                min="40"
                max="200"
                step="5"
                value={filters.brightness}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdateFilters(prev => ({ ...prev, brightness: val }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Contrast slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-amber-400" />
                  Độ tương phản (Contrast)
                </span>
                <span className="font-mono text-neutral-400">{filters.contrast}%</span>
              </div>
              <input
                type="range"
                id="slider-contrast"
                min="50"
                max="250"
                step="5"
                value={filters.contrast}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdateFilters(prev => ({ ...prev, contrast: val }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Blur slider (Làm mờ ảnh) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Làm mờ nhòe (Blur)
                </span>
                <span className="font-mono text-neutral-400">{filters.blur}px</span>
              </div>
              <input
                type="range"
                id="slider-blur"
                min="0"
                max="15"
                step="0.5"
                value={filters.blur}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateFilters(prev => ({ ...prev, blur: val }));
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Toggles: Sketch Mode (Tách nét viền), Invert, Grayscale */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                id="btn-toggle-sketch"
                onClick={() => onUpdateFilters(prev => ({ ...prev, sketchMode: !prev.sketchMode }))}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  filters.sketchMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700/50 hover:bg-neutral-750'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tách nét vẽ</span>
              </button>

              <button
                type="button"
                id="btn-toggle-invert"
                onClick={() => onUpdateFilters(prev => ({ ...prev, invert: !prev.invert }))}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  filters.invert
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700/50 hover:bg-neutral-750'
                }`}
              >
                <span>Đảo màu nét</span>
              </button>

              <button
                type="button"
                id="btn-reset-filters"
                onClick={onResetFilters}
                className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700/50 hover:text-neutral-200 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: TRANSFORM & ALIGNMENT (Thu phóng, Xoay, Lật, Căn giữa) */}
        {activeTab === 'transform' && (
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-4 gap-2">
              {/* Zoom Out */}
              <button
                type="button"
                id="btn-zoom-out"
                onClick={() => onUpdateTransforms(prev => ({
                  ...prev,
                  scale: Math.max(0.2, Number((prev.scale - 0.15).toFixed(2)))
                }))}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-750 border border-neutral-700/50 text-xs transition cursor-pointer"
              >
                <Minimize2 className="w-4 h-4 text-neutral-400" />
                <span>Thu nhỏ</span>
              </button>

              {/* Zoom In */}
              <button
                type="button"
                id="btn-zoom-in"
                onClick={() => onUpdateTransforms(prev => ({
                  ...prev,
                  scale: Math.min(5, Number((prev.scale + 0.15).toFixed(2)))
                }))}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-750 border border-neutral-700/50 text-xs transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-neutral-400" />
                <span>Phóng to</span>
              </button>

              {/* Rotate 90 deg */}
              <button
                type="button"
                id="btn-rotate-90"
                onClick={() => onUpdateTransforms(prev => ({
                  ...prev,
                  rotation: (prev.rotation + 90) % 360
                }))}
                className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-750 border border-neutral-700/50 text-xs transition cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-neutral-400" />
                <span>Xoay 90°</span>
              </button>

              {/* Flip Horizontal */}
              <button
                type="button"
                id="btn-flip-h"
                onClick={() => onUpdateTransforms(prev => ({
                  ...prev,
                  flipH: !prev.flipH
                }))}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl border text-xs transition cursor-pointer ${
                  transforms.flipH
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700/50 hover:bg-neutral-750'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>Lật ảnh</span>
              </button>
            </div>

            {/* Reset position & scale */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-400">
                Tỉ lệ: {Math.round(transforms.scale * 100)}% | Góc: {transforms.rotation}°
              </span>
              <button
                type="button"
                id="btn-reset-transform"
                onClick={onResetTransforms}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/50 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Căn giữa & Đặt lại</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
