import React from 'react';
import { X, Smartphone, Pencil, Eye, CheckCircle2, Sliders, Lock } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
            <Pencil className="w-4 h-4 text-amber-400" />
            Hướng Dẫn Căn Ke Vẽ Trực Tiếp Qua Màn Hình
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-neutral-300">
          {/* Step 1 */}
          <div className="flex gap-3 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 text-sm mb-1">
                Kê cố định điện thoại / máy tính bảng
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Dùng một chiếc cốc thủy tinh, giá đỡ điện thoại hoặc chồng sách để đặt điện thoại nằm ngang song song với mặt bàn. Camera sau hướng thẳng xuống tờ giấy vẽ.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 text-sm mb-1">
                Chọn ảnh & Điều chỉnh kích thước
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Nhấn <strong>"Chọn ảnh từ thư viện"</strong> hoặc tải ảnh từ máy. Dùng 1 hoặc 2 ngón tay kéo, phóng to thu nhỏ và xoay bức hình sao cho vừa vặn với kích thước tờ giấy bên dưới camera.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 text-sm mb-1">
                Chỉnh Độ Mờ, Độ Sáng & Tương Phản
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Kéo thanh trượt <strong>"Độ mờ (Opacity)"</strong> khoảng 40% - 60% để nhìn rõ đồng thời cả nét vẽ mẫu và đầu bút chì thực tế. Tăng <strong>Độ tương phản</strong> để nét vẽ nổi bật hơn.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 text-sm mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Khóa vị trí & Bắt đầu vẽ theo nét!
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Nhấn nút <strong>"Khóa vị trí"</strong> để tranh không bị xê dịch. Nhìn vào màn hình điện thoại và đưa bút chì trên giấy vẽ theo các đường viền hiển thị trên màn hình.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-semibold shadow-lg transition active:scale-95 cursor-pointer"
        >
          Đã hiểu, bắt đầu vẽ ngay
        </button>
      </div>
    </div>
  );
};
