import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, Zap, ZapOff, Pause, Play, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { CameraDeviceOption, CameraState } from '../types';

interface CameraViewProps {
  onCameraReady?: (videoEl: HTMLVideoElement) => void;
  showGrid?: boolean;
  facingMode: 'environment' | 'user';
  selectedDeviceId?: string;
  onFacingModeChange: (mode: 'environment' | 'user') => void;
  onDeviceChange: (deviceId: string, facing: 'environment' | 'user') => void;
  availableCameras: CameraDeviceOption[];
  onAvailableCamerasChange: (cameras: CameraDeviceOption[]) => void;
  onOpenSelectorModal: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onCameraReady,
  showGrid = false,
  facingMode,
  selectedDeviceId,
  onFacingModeChange,
  onDeviceChange,
  availableCameras,
  onAvailableCamerasChange,
  onOpenSelectorModal,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onCameraReadyRef = useRef(onCameraReady);
  const onAvailableCamerasChangeRef = useRef(onAvailableCamerasChange);
  const currentConfigRef = useRef<{ facing: 'environment' | 'user'; deviceId?: string } | null>(null);
  const requestIdRef = useRef<number>(0);
  const lastDiscoveredDevicesRef = useRef<string>('');

  // Keep callback refs updated to prevent re-render cascading
  useEffect(() => {
    onCameraReadyRef.current = onCameraReady;
  }, [onCameraReady]);

  useEffect(() => {
    onAvailableCamerasChangeRef.current = onAvailableCamerasChange;
  }, [onAvailableCamerasChange]);

  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    facingMode: facingMode,
    selectedDeviceId: selectedDeviceId,
    availableCameras: availableCameras,
    hasTorch: false,
    isTorchOn: false,
    isFrozen: false,
    error: null,
    permissionState: 'prompt',
  });

  const [frozenFrameUrl, setFrozenFrameUrl] = useState<string | null>(null);

  const stopCurrentStream = useCallback(() => {
    currentConfigRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Enumerate all video input devices (front/back/ultra-wide, etc.)
  const enumerateVideoDevices = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      const cameraOptions: CameraDeviceOption[] = videoInputs.map((d, index) => {
        const lowerLabel = d.label.toLowerCase();
        let facing: 'environment' | 'user' | 'unknown' = 'unknown';

        if (
          lowerLabel.includes('back') ||
          lowerLabel.includes('rear') ||
          lowerLabel.includes('environment') ||
          lowerLabel.includes('sau')
        ) {
          facing = 'environment';
        } else if (
          lowerLabel.includes('front') ||
          lowerLabel.includes('user') ||
          lowerLabel.includes('selfie') ||
          lowerLabel.includes('trước')
        ) {
          facing = 'user';
        } else {
          // If browser doesn't specify, default first to environment and second to user
          facing = index === 0 ? 'environment' : 'user';
        }

        let friendlyLabel = d.label;
        if (!friendlyLabel) {
          friendlyLabel = facing === 'user' ? `Camera Trước (${index + 1})` : `Camera Sau (${index + 1})`;
        }

        return {
          deviceId: d.deviceId,
          label: friendlyLabel,
          facing,
        };
      });

      const devicesKey = cameraOptions.map((c) => `${c.deviceId}-${c.label}`).join('|');
      if (cameraOptions.length > 0 && devicesKey !== lastDiscoveredDevicesRef.current) {
        lastDiscoveredDevicesRef.current = devicesKey;
        onAvailableCamerasChangeRef.current?.(cameraOptions);
      }
    } catch (err) {
      console.warn('enumerateDevices error:', err);
    }
  }, []);

  const initCamera = useCallback(
    async (targetFacing: 'environment' | 'user', targetDeviceId?: string) => {
      // If already active with the identical configuration, skip re-init
      if (
        currentConfigRef.current &&
        currentConfigRef.current.facing === targetFacing &&
        currentConfigRef.current.deviceId === targetDeviceId &&
        streamRef.current &&
        streamRef.current.active
      ) {
        return;
      }

      const reqId = ++requestIdRef.current;
      stopCurrentStream();
      setCameraState((prev) => ({ ...prev, error: null, isActive: false }));

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState((prev) => ({
          ...prev,
          error: 'Trình duyệt không hỗ trợ truy cập camera hoặc đang chạy trong môi trường bảo mật.',
          permissionState: 'unsupported',
        }));
        return;
      }

      try {
        const videoConstraint: MediaTrackConstraints = targetDeviceId
          ? {
              deviceId: { exact: targetDeviceId },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            }
          : {
              facingMode: { ideal: targetFacing },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraint,
          audio: false,
        });

        // Stale request check: user changed camera before previous request finished
        if (reqId !== requestIdRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        currentConfigRef.current = { facing: targetFacing, deviceId: targetDeviceId };

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((e: any) => {
              if (e?.name !== 'AbortError') {
                console.warn('Camera play warning:', e);
              }
            });
          }
          if (onCameraReadyRef.current) {
            onCameraReadyRef.current(videoRef.current);
          }
        }

        // Check for torch capability (usually on rear camera)
        const videoTrack = stream.getVideoTracks()[0];
        let hasTorch = false;
        if (videoTrack && 'getCapabilities' in videoTrack) {
          const capabilities = (videoTrack as any).getCapabilities();
          if (capabilities && capabilities.torch) {
            hasTorch = true;
          }
        }

        setCameraState((prev) => ({
          ...prev,
          isActive: true,
          facingMode: targetFacing,
          selectedDeviceId: targetDeviceId,
          hasTorch,
          isTorchOn: false,
          error: null,
          permissionState: 'granted',
        }));

        // Enumerate devices now that permission is granted
        enumerateVideoDevices();
      } catch (err: any) {
        if (reqId !== requestIdRef.current) return;
        console.warn('Camera init error, trying fallback:', err);
        // Fallback attempt with generic constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetFacing },
            audio: false,
          });

          if (reqId !== requestIdRef.current) {
            fallbackStream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = fallbackStream;
          currentConfigRef.current = { facing: targetFacing, deviceId: undefined };

          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((e: any) => {
                if (e?.name !== 'AbortError') {
                  console.warn('Fallback play warning:', e);
                }
              });
            }
            if (onCameraReadyRef.current) {
              onCameraReadyRef.current(videoRef.current);
            }
          }

          setCameraState((prev) => ({
            ...prev,
            isActive: true,
            facingMode: targetFacing,
            error: null,
            permissionState: 'granted',
          }));
          enumerateVideoDevices();
        } catch (fallbackErr: any) {
          if (reqId !== requestIdRef.current) return;
          const message =
            fallbackErr.name === 'NotAllowedError'
              ? 'Quyền truy cập Camera bị từ chối. Vui lòng cho phép quyền máy ảnh trong cài đặt trình duyệt để căn ke trực tiếp trên giấy vẽ.'
              : 'Không thể khởi động camera: ' + (fallbackErr.message || 'Lỗi không xác định.');
          setCameraState((prev) => ({
            ...prev,
            isActive: false,
            error: message,
            permissionState: 'denied',
          }));
        }
      }
    },
    [stopCurrentStream, enumerateVideoDevices]
  );

  // Trigger init ONLY when facingMode or selectedDeviceId explicitly change
  useEffect(() => {
    initCamera(facingMode, selectedDeviceId);
    return () => {
      stopCurrentStream();
    };
  }, [facingMode, selectedDeviceId, initCamera, stopCurrentStream]);

  // Quick Switch camera between front and rear
  const handleQuickToggleFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    onFacingModeChange(nextMode);
  };

  // Toggle flashlight / torch if available
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextTorch = !cameraState.isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setCameraState((prev) => ({ ...prev, isTorchOn: nextTorch }));
    } catch (err) {
      console.warn('Torch failed:', err);
    }
  };

  // Freeze frame (pause video or snap picture)
  const toggleFreezeFrame = () => {
    if (cameraState.isFrozen) {
      // Unfreeze
      setFrozenFrameUrl(null);
      setCameraState((prev) => ({ ...prev, isFrozen: false }));
      if (videoRef.current) {
        videoRef.current.play().catch(console.warn);
      }
    } else {
      // Freeze by capturing current video frame to canvas
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setFrozenFrameUrl(dataUrl);
          videoRef.current.pause();
          setCameraState((prev) => ({ ...prev, isFrozen: true }));
        }
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950 select-none pointer-events-none">
      {/* Live Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          cameraState.isFrozen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Frozen Frame View if enabled */}
      {cameraState.isFrozen && frozenFrameUrl && (
        <img
          src={frozenFrameUrl}
          alt="Khung hình đóng băng"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Grid Overlay for paper alignment */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 border border-white/20">
          <div className="border-r border-b border-white/25"></div>
          <div className="border-r border-b border-white/25"></div>
          <div className="border-b border-white/25"></div>
          <div className="border-r border-b border-white/25"></div>
          <div className="border-r border-b border-white/25"></div>
          <div className="border-b border-white/25"></div>
          <div className="border-r border-b border-white/25"></div>
          <div className="border-r border-b border-white/25"></div>
          <div></div>
        </div>
      )}

      {/* Fallback Simulation Background when camera is not available */}
      {!cameraState.isActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-radial from-neutral-900 via-neutral-950 to-neutral-950 pointer-events-auto">
          {/* Subtle simulated paper texture background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-md p-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CameraOff className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-semibold text-neutral-100 mb-2">
              Chế độ Mô phỏng / Chưa bật Camera
            </h3>
            <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
              {cameraState.error ||
                'Vui lòng cấp quyền máy ảnh để nhìn thấy tờ giấy vẽ và tay thực tế bên dưới.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => initCamera(facingMode, selectedDeviceId)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-medium text-sm rounded-xl transition shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Cấp quyền & Thử lại
              </button>

              <button
                type="button"
                onClick={onOpenSelectorModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm rounded-xl transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                Tùy chọn Camera Trước/Sau
              </button>
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              Mẹo: Bạn vẫn có thể tải ảnh, chỉnh độ mờ, xoay và phóng to bình thường ngay trên màn hình này.
            </p>
          </div>
        </div>
      )}

      {/* Camera status badges - Clickable to open Option Selector */}
      <div className="absolute top-16 sm:top-20 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          id="btn-status-camera-picker"
          onClick={onOpenSelectorModal}
          title="Bấm để chọn camera trước hoặc camera sau"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition cursor-pointer active:scale-95 shadow-md ${
            cameraState.isActive
              ? 'bg-neutral-900/90 text-neutral-100 border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-850'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              cameraState.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          ></span>
          <span>
            {cameraState.isActive
              ? facingMode === 'environment'
                ? '📷 Camera Sau (Giấy)'
                : '🤳 Camera Trước (Selfie)'
              : 'Mô phỏng giấy vẽ'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
        </button>

        {cameraState.isFrozen && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            Đã cố định hình
          </span>
        )}
      </div>

      {/* Quick Camera Action Controls (Options, Switch Cam, Flash, Freeze) */}
      <div className="absolute top-16 sm:top-20 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {cameraState.isActive && (
          <>
            {/* Quick 1-tap Switch camera (Front <-> Back) */}
            <button
              type="button"
              id="btn-switch-camera"
              onClick={handleQuickToggleFacing}
              title={`Đổi nhanh sang ${facingMode === 'environment' ? 'Camera Trước (Selfie)' : 'Camera Sau (Vẽ giấy)'}`}
              className="p-2.5 rounded-full bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>

            {/* Flashlight / Torch */}
            {cameraState.hasTorch && (
              <button
                type="button"
                id="btn-toggle-torch"
                onClick={toggleTorch}
                title={cameraState.isTorchOn ? 'Tắt đèn pin' : 'Bật đèn pin chiếu sáng giấy vẽ'}
                className={`p-2.5 rounded-full border backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer ${
                  cameraState.isTorchOn
                    ? 'bg-amber-500 text-neutral-950 border-amber-400'
                    : 'bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 border-neutral-700/60'
                }`}
              >
                {cameraState.isTorchOn ? (
                  <Zap className="w-4 h-4 fill-current" />
                ) : (
                  <ZapOff className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Freeze frame button */}
            <button
              type="button"
              id="btn-freeze-frame"
              onClick={toggleFreezeFrame}
              title={
                cameraState.isFrozen
                  ? 'Tiếp tục camera trực tiếp'
                  : 'Đóng băng khung hình để cố định góc'
              }
              className={`p-2.5 rounded-full border backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer ${
                cameraState.isFrozen
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400'
                  : 'bg-neutral-900/85 hover:bg-neutral-800 text-neutral-200 border-neutral-700/60'
              }`}
            >
              {cameraState.isFrozen ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
