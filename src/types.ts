export interface ImageTemplate {
  id: string;
  title: string;
  category: 'anime' | 'animals' | 'cartoon' | 'nature' | 'beginner' | 'tattoo';
  url: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao';
  tags: string[];
}

export interface FilterSettings {
  opacity: number; // 0.1 to 1.0 (default 0.5)
  brightness: number; // 30 to 200 (%) (default 100)
  contrast: number; // 30 to 250 (%) (default 100)
  blur: number; // 0 to 20 (px) (default 0)
  invert: boolean;
  grayscale: boolean;
  sketchMode: boolean; // edge detection / sketch effect
  sketchThreshold: number; // 0 - 255 for binarization/edge
}

export interface TransformSettings {
  x: number; // px offset from center
  y: number; // px offset from center
  scale: number; // 0.2 to 5.0
  rotation: number; // -180 to 180 deg
  flipH: boolean;
  flipV: boolean;
  isLocked: boolean; // lock position to prevent accidental touch moves
}

export interface CameraDeviceOption {
  deviceId: string;
  label: string;
  facing: 'environment' | 'user' | 'unknown';
}

export interface CameraState {
  isActive: boolean;
  facingMode: 'environment' | 'user';
  selectedDeviceId?: string;
  availableCameras: CameraDeviceOption[];
  hasTorch: boolean;
  isTorchOn: boolean;
  isFrozen: boolean;
  error: string | null;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
}
