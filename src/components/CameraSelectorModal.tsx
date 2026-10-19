import React from 'react';
import { CameraDeviceOption } from '../types';
import { X, Camera, Smartphone, Check, Sparkles, AlertCircle } from 'lucide-react';

interface CameraSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  facingMode: 'environment' | 'user';
  selectedDeviceId?: string;
  availableCameras: CameraDeviceOption[];
  onSelectFacingMode: (mode: 'environment' | 'user') => void;
  onSelectDevice: (deviceId: string, facing: 'environment' | 'user') => void;
}

export const CameraSelectorModal: React.FC<CameraSelectorModalProps> = ({
  isOpen,
  onClose,
  facingMode,
  selectedDeviceId,
  availableCameras,
  onSelectFacingMode,
  onSelectDevice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Tùy Chọn Camera Thiết Bị
              </h3>
              <p className="text-[11px] text-neutral-400">
                Chọn camera trước hoặc camera sau để vẽ thuận tiện nhất
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Main 2 Options: Camera Sau vs Camera Trước */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Chọn chế độ camera:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Camera Sau (Mặt lưng / Giấy vẽ) */}
              <button
                type="button"
                id="opt-camera-back"
                onClick={() => {
                  onSelectFacingMode('environment');
                }}
                className={`relative flex flex-col items-start p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  facingMode === 'environment' && !selectedDeviceId
                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 text-neutral-100'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  {facingMode === 'environment' && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-neutral-100">
                  Camera Sau
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                  Khuyên dùng để vẽ giấy
                </span>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  Hướng mặt lưng xuống bàn để nhìn thấy tờ giấy vẽ và tay bút.
                </p>
              </button>

              {/* Camera Trước (Màn hình / Selfie) */}
              <button
                type="button"
                id="opt-camera-front"
                onClick={() => {
                  onSelectFacingMode('user');
                }}
                className={`relative flex flex-col items-start p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  facingMode === 'user' && !selectedDeviceId
                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 text-neutral-100'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-sky-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  {facingMode === 'user' && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-neutral-100">
                  Camera Trước
                </span>
                <span className="text-[10px] text-sky-400/90 font-medium mt-0.5">
                  Camera selfie mặt trước
                </span>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  Thích hợp khi đặt máy dựng đứng hoặc căn ke theo góc nhìn trước.
                </p>
              </button>
            </div>
          </div>

          {/* Detailed camera hardware list if multiple lenses are detected */}
          {availableCameras.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Danh sách ống kính nhận diện ({availableCameras.length}):
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {availableCameras.map((cam, idx) => {
                  const isCurrent =
                    selectedDeviceId === cam.deviceId ||
                    (!selectedDeviceId && cam.facing === facingMode);

                  return (
                    <button
                      key={cam.deviceId || idx}
                      type="button"
                      onClick={() => onSelectDevice(cam.deviceId, cam.facing === 'user' ? 'user' : 'environment')}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition cursor-pointer text-left ${
                        isCurrent
                          ? 'bg-neutral-800 border-amber-500/60 text-amber-300'
                          : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-300 hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
                          cam.facing === 'user'
                            ? 'bg-sky-500/20 text-sky-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {cam.facing === 'user' ? <Smartphone className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                        </div>
                        <div className="truncate">
                          <span className="font-medium block truncate">
                            {cam.label || (cam.facing === 'user' ? `Camera Trước ${idx + 1}` : `Camera Sau ${idx + 1}`)}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {cam.facing === 'user' ? 'Mặt trước (Selfie)' : 'Mặt sau (Khuyên dùng)'}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Đang dùng
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advice card */}
          <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-neutral-400 text-xs flex gap-2.5 items-start">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-neutral-200">Mẹo căn ke:</strong> Nếu điện thoại của bạn có nhiều ống kính sau (như góc rộng 0.5x, 1x), bạn có thể chuyển đổi để chọn góc nhìn rộng hoặc hẹp phù hợp nhất với khổ giấy vẽ (A4, A5).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 text-xs font-semibold shadow-lg transition cursor-pointer"
          >
            Áp dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
