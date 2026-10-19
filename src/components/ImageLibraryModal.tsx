import React, { useState, useRef } from 'react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { ImageTemplate } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  Sparkles,
  Camera,
  FolderOpen
} from 'lucide-react';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, template?: ImageTemplate) => void;
  selectedImageUrl: string | null;
}

export const ImageLibraryModal: React.FC<ImageLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedImageUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'anime', label: 'Anime & Manga' },
    { id: 'animals', label: 'Động vật' },
    { id: 'nature', label: 'Hoa lá' },
    { id: 'cartoon', label: 'Hoạt hình' },
    { id: 'tattoo', label: 'Hình xăm & Rồng' },
    { id: 'beginner', label: 'Người mới bắt đầu' },
  ];

  const filteredImages = SAMPLE_IMAGES.filter((img) => {
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setUploadedPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const applyUploadedImage = () => {
    if (uploadedPreview) {
      onSelectImage(uploadedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <div>
            <h2 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              Chọn Ảnh Để Căn Ke Vẽ
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Chọn từ thư viện phác thảo có sẵn hoặc tải ảnh từ thiết bị của bạn
            </p>
          </div>
          <button
            type="button"
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/30 px-5 pt-3 gap-3">
          <button
            type="button"
            id="tab-modal-presets"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'presets'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Thư viện mẫu có sẵn ({SAMPLE_IMAGES.length})
          </button>

          <button
            type="button"
            id="tab-modal-upload"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-neutral-400 border-transparent hover:text-neutral-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Tải ảnh từ thiết bị
          </button>
        </div>

        {/* Tab 1: PRESET SKETCH TEMPLATES */}
        {activeTab === 'presets' && (
          <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
            {/* Search & Categories */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="search-library-input"
                  placeholder="Tìm kiếm mẫu vẽ (anime, mèo, hoa, dragon...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-neutral-950 font-semibold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredImages.map((template) => {
                  const isSelected = selectedImageUrl === template.url;
                  return (
                    <div
                      key={template.id}
                      id={`template-card-${template.id}`}
                      onClick={() => {
                        onSelectImage(template.url, template);
                        onClose();
                      }}
                      className={`group relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer bg-neutral-950/60 hover:bg-neutral-850 hover:border-amber-500/50 ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-neutral-800'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-lg bg-white/95 flex items-center justify-center p-2 mb-2 overflow-hidden shadow-inner">
                        <img
                          src={template.url}
                          alt={template.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-neutral-200 truncate group-hover:text-amber-400 transition-colors">
                          {template.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">
                          {template.difficulty}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredImages.length === 0 && (
                <div className="py-12 text-center text-neutral-500 text-xs">
                  Không tìm thấy mẫu vẽ phù hợp. Hãy thử tìm từ khóa khác hoặc tải ảnh của riêng bạn!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: UPLOAD CUSTOM IMAGE */}
        {activeTab === 'upload' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              id="file-input-element"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {!uploadedPreview ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 min-h-[260px] flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition text-center ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-neutral-750 hover:border-amber-500/50 bg-neutral-950/40 hover:bg-neutral-950/70'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 shadow-md">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-1">
                  Nhấn để chọn ảnh hoặc Kéo thả vào đây
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mb-4">
                  Hỗ trợ định dạng JPG, PNG, WebP, SVG từ album ảnh điện thoại hoặc máy tính.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-medium border border-neutral-700 transition">
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  Mở Thư Viện Ảnh Thiết Bị
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-300">
                    Xem trước ảnh đã tải lên:
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Chọn ảnh khác
                  </button>
                </div>

                <div className="aspect-video w-full rounded-xl bg-neutral-950 border border-neutral-800 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={uploadedPreview}
                    alt="Xem trước ảnh tải lên"
                    className="max-h-64 object-contain rounded-lg shadow"
                  />
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-400">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-neutral-200">Gợi ý căn ke:</strong> Nếu là ảnh chụp thực tế có nhiều chi tiết, bạn có thể bật tính năng <strong className="text-amber-400">"Tách nét vẽ"</strong> trong thanh công cụ sau khi tải để chuyển ảnh thành nét phác thảo đen trắng dễ vẽ theo nhất!
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadedPreview(null)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-medium border border-neutral-700 transition cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    id="btn-apply-uploaded-image"
                    onClick={applyUploadedImage}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-semibold shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    Dùng ảnh này để căn ke vẽ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
