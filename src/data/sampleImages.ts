import { ImageTemplate } from '../types';

// Helper to create clean vector sketch SVGs
function createSvgDataUrl(svgInner: string, viewBox = "0 0 500 500"): string {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="500" height="500" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect width="100%" height="100%" fill="transparent" stroke="none" />
    ${svgInner}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

export const SAMPLE_IMAGES: ImageTemplate[] = [
  {
    id: 'anime-warrior',
    title: 'Nhân vật Anime Shonen',
    category: 'anime',
    difficulty: 'Nâng cao',
    tags: ['Anime', 'Manga', 'Nhân vật', 'Chiến binh'],
    url: createSvgDataUrl(`
      <!-- Tóc & Khuôn mặt -->
      <path d="M 250 80 L 270 40 L 285 75 L 320 50 L 325 90 L 360 75 L 350 120 L 390 125 L 365 160 L 385 190 L 345 195 L 340 240 L 300 290 L 250 330 L 200 290 L 160 240 L 155 195 L 115 190 L 135 160 L 110 125 L 150 120 L 140 90 L 175 50 L 215 75 L 230 40 Z" fill="none" stroke-width="3" />
      <!-- Lọn tóc chi tiết phía trước -->
      <path d="M 230 75 L 245 150 L 255 120 L 270 160 L 280 110" stroke-width="2.5" />
      <path d="M 200 100 L 215 170 L 230 140" stroke-width="2.5" />
      <path d="M 290 100 L 285 165 L 305 130" stroke-width="2.5" />
      <!-- Cằm & Quai hàm -->
      <path d="M 180 210 L 210 270 L 250 300 L 290 270 L 320 210" stroke-width="3" />
      <!-- Mắt Anime sắc sảo -->
      <path d="M 195 205 Q 215 190 235 205" stroke-width="3.5" />
      <path d="M 200 210 Q 215 225 230 210" stroke-width="2" />
      <circle cx="215" cy="207" r="5" fill="#111827" />
      
      <path d="M 265 205 Q 285 190 305 205" stroke-width="3.5" />
      <path d="M 270 210 Q 285 225 300 210" stroke-width="2" />
      <circle cx="285" cy="207" r="5" fill="#111827" />
      <!-- Lông mày & Sống mũi -->
      <path d="M 190 190 L 235 185" stroke-width="3" />
      <path d="M 310 190 L 265 185" stroke-width="3" />
      <path d="M 248 215 L 245 240 L 255 242" stroke-width="2.5" />
      <!-- Miệng & Vết xăm mặt phong cách Sukuna -->
      <path d="M 235 265 Q 250 275 265 265" stroke-width="3" />
      <path d="M 245 252 L 255 252" stroke-width="1.5" />
      <!-- Hình xăm mặt đặc trưng -->
      <path d="M 190 220 Q 180 240 185 260" stroke-width="2.5" />
      <path d="M 310 220 Q 320 240 315 260" stroke-width="2.5" />
      <line x1="240" y1="180" x2="260" y2="180" stroke-width="3" />
      <line x1="242" y1="174" x2="258" y2="174" stroke-width="2" />
      <!-- Cổ & Cơ bắp ngực -->
      <path d="M 215 295 L 205 380 L 140 430" stroke-width="3" />
      <path d="M 285 295 L 295 380 L 360 430" stroke-width="3" />
      <path d="M 205 350 Q 250 370 295 350" stroke-width="2.5" />
      <path d="M 250 365 L 250 450" stroke-width="2.5" />
      <path d="M 210 410 Q 250 435 290 410" stroke-width="2.5" />
      <!-- Hình xăm ngực vai -->
      <path d="M 210 330 Q 180 340 160 370" stroke-width="3" stroke-dasharray="8 4" />
      <path d="M 290 330 Q 320 340 340 370" stroke-width="3" stroke-dasharray="8 4" />
    `)
  },
  {
    id: 'anime-eyes',
    title: 'Mắt Anime Cổ Điển',
    category: 'anime',
    difficulty: 'Dễ',
    tags: ['Anime', 'Mắt', 'Cơ bản'],
    url: createSvgDataUrl(`
      <!-- Mắt trái -->
      <path d="M 80 230 Q 140 160 210 210" stroke-width="5" />
      <path d="M 100 245 Q 150 290 195 240" stroke-width="3" />
      <ellipse cx="150" cy="225" rx="35" ry="45" stroke-width="3" />
      <circle cx="160" cy="205" r="14" fill="#111827" />
      <circle cx="140" cy="235" r="8" fill="#111827" />
      <path d="M 125 245 L 175 245" stroke-width="2" />
      <path d="M 70 170 Q 140 140 210 175" stroke-width="4" />
      <path d="M 115 190 L 130 193" stroke-width="2" />

      <!-- Mắt phải -->
      <path d="M 290 210 Q 360 160 420 230" stroke-width="5" />
      <path d="M 305 240 Q 350 290 400 245" stroke-width="3" />
      <ellipse cx="350" cy="225" rx="35" ry="45" stroke-width="3" />
      <circle cx="340" cy="205" r="14" fill="#111827" />
      <circle cx="360" cy="235" r="8" fill="#111827" />
      <path d="M 325 245 L 375 245" stroke-width="2" />
      <path d="M 290 175 Q 360 140 430 170" stroke-width="4" />
      <path d="M 370 193 L 385 190" stroke-width="2" />
    `)
  },
  {
    id: 'cute-cat',
    title: 'Mèo Con Chibi',
    category: 'animals',
    difficulty: 'Dễ',
    tags: ['Mèo', 'Động vật', 'Dễ thương', 'Chibi'],
    url: createSvgDataUrl(`
      <!-- Đầu mèo -->
      <path d="M 180 180 Q 250 140 320 180" stroke-width="3" />
      <path d="M 320 180 Q 370 230 370 280 Q 370 350 250 360 Q 130 350 130 280 Q 130 230 180 180" stroke-width="3" />
      <!-- Tai mèo -->
      <path d="M 170 190 L 130 100 L 220 165 Z" stroke-width="3" fill="none" />
      <path d="M 155 170 L 140 120 L 195 160" stroke-width="2" />
      <path d="M 330 190 L 370 100 L 280 165 Z" stroke-width="3" fill="none" />
      <path d="M 345 170 L 360 120 L 305 160" stroke-width="2" />
      <!-- Mắt tròn long lanh -->
      <ellipse cx="190" cy="260" rx="20" ry="25" fill="#111827" />
      <circle cx="183" cy="250" r="7" fill="#ffffff" />
      <circle cx="196" cy="270" r="3" fill="#ffffff" />
      <ellipse cx="310" cy="260" rx="20" ry="25" fill="#111827" />
      <circle cx="303" cy="250" r="7" fill="#ffffff" />
      <circle cx="316" cy="270" r="3" fill="#ffffff" />
      <!-- Mũi miệng -->
      <polygon points="245,280 255,280 250,287" fill="#111827" stroke="none" />
      <path d="M 250 287 Q 240 300 230 295" stroke-width="2.5" />
      <path d="M 250 287 Q 260 300 270 295" stroke-width="2.5" />
      <!-- Râu mèo -->
      <line x1="140" y1="270" x2="90" y2="260" stroke-width="2" />
      <line x1="135" y1="285" x2="80" y2="285" stroke-width="2" />
      <line x1="140" y1="300" x2="90" y2="310" stroke-width="2" />
      <line x1="360" y1="270" x2="410" y2="260" stroke-width="2" />
      <line x1="365" y1="285" x2="420" y2="285" stroke-width="2" />
      <line x1="360" y1="300" x2="410" y2="310" stroke-width="2" />
      <!-- Hai bàn chân trước nhỏ nhắn -->
      <ellipse cx="210" cy="380" rx="22" ry="30" stroke-width="3" />
      <ellipse cx="290" cy="380" rx="22" ry="30" stroke-width="3" />
      <line x1="202" y1="390" x2="202" y2="405" stroke-width="2" />
      <line x1="218" y1="390" x2="218" y2="405" stroke-width="2" />
      <line x1="282" y1="390" x2="282" y2="405" stroke-width="2" />
      <line x1="298" y1="390" x2="298" y2="405" stroke-width="2" />
    `)
  },
  {
    id: 'rose-flower',
    title: 'Hoa Hồng Căn Ke',
    category: 'nature',
    difficulty: 'Trung bình',
    tags: ['Hoa', 'Thực vật', 'Nghệ thuật', 'Hình xăm'],
    url: createSvgDataUrl(`
      <!-- Cánh tâm hoa -->
      <path d="M 250 180 Q 230 160 250 140 Q 270 160 250 180 Z" stroke-width="2.5" />
      <path d="M 240 155 Q 250 130 270 150 Q 260 175 235 180" stroke-width="2.5" />
      <!-- Các lớp cánh hoa xoắn ốc -->
      <path d="M 225 170 Q 210 140 245 125 Q 290 125 285 160 Q 280 200 240 205" stroke-width="3" />
      <path d="M 210 185 Q 185 150 220 110 Q 280 100 310 145 Q 315 190 270 215" stroke-width="3" />
      <path d="M 195 210 Q 160 180 180 130 Q 250 80 325 120 Q 345 180 295 230" stroke-width="3" />
      <path d="M 180 240 Q 140 210 150 160 Q 210 80 320 85 Q 365 140 330 235 Q 290 270 240 260" stroke-width="3" />
      <!-- Cánh ngoài bung to -->
      <path d="M 160 250 Q 120 280 180 320 Q 230 330 250 280" stroke-width="3" />
      <path d="M 250 280 Q 300 330 350 290 Q 370 240 320 250" stroke-width="3" />
      <!-- Cành hoa & Gai -->
      <path d="M 245 310 Q 240 380 255 450" stroke-width="4" />
      <path d="M 240 350 L 225 345 L 243 360" stroke-width="2.5" fill="#111827" />
      <path d="M 250 395 L 265 390 L 248 405" stroke-width="2.5" fill="#111827" />
      <!-- Lá hoa hồng -->
      <path d="M 240 360 Q 160 350 140 400 Q 200 410 242 380 Z" stroke-width="2.5" />
      <path d="M 140 400 Q 190 380 240 360" stroke-width="2" />
      <path d="M 250 375 Q 330 350 360 390 Q 310 420 250 395 Z" stroke-width="2.5" />
      <path d="M 250 375 Q 310 380 360 390" stroke-width="2" />
    `)
  },
  {
    id: 'dragon-tribal',
    title: 'Rồng Đông Phương',
    category: 'tattoo',
    difficulty: 'Nâng cao',
    tags: ['Rồng', 'Xăm', 'Huyền bí', 'Nâng cao'],
    url: createSvgDataUrl(`
      <!-- Đầu rồng -->
      <path d="M 150 140 Q 200 120 260 140 L 300 110 L 290 145 L 340 135 L 310 160 L 350 175 L 280 190 L 260 230 L 230 200 L 190 220 L 170 170 Z" stroke-width="3" />
      <!-- Sừng rồng -->
      <path d="M 240 130 Q 280 70 330 60 Q 300 90 280 110" stroke-width="3.5" />
      <path d="M 210 130 Q 230 80 270 70" stroke-width="2.5" />
      <!-- Râu rồng uốn lượn -->
      <path d="M 160 160 Q 100 140 70 180 Q 90 220 140 200" stroke-width="3" />
      <!-- Mắt rồng rực lửa -->
      <polygon points="220,155 245,150 235,165" fill="#111827" />
      <!-- Thân rồng uốn chữ S -->
      <path d="M 250 210 Q 360 250 360 330 Q 360 410 250 420 Q 140 430 130 350 Q 120 270 210 270" stroke-width="5" />
      <path d="M 260 230 Q 330 265 330 325 Q 330 385 250 395 Q 170 405 160 350 Q 150 300 210 295" stroke-width="2.5" />
      <!-- Vảy & Gai lưng rồng -->
      <path d="M 330 260 L 360 250 L 345 280" stroke-width="2.5" />
      <path d="M 355 290 L 390 295 L 360 320" stroke-width="2.5" />
      <path d="M 355 340 L 385 360 L 345 375" stroke-width="2.5" />
      <path d="M 315 400 L 335 435 L 295 425" stroke-width="2.5" />
      <path d="M 240 420 L 245 455 L 220 430" stroke-width="2.5" />
      <path d="M 170 415 L 150 445 L 140 410" stroke-width="2.5" />
      <!-- Móng vuốt rồng -->
      <path d="M 210 320 L 190 350 L 170 340" stroke-width="3" />
      <path d="M 190 350 L 185 370" stroke-width="3" />
    `)
  },
  {
    id: 'cute-panda',
    title: 'Gấu Trúc Đáng Yêu',
    category: 'animals',
    difficulty: 'Dễ',
    tags: ['Gấu trúc', 'Động vật', 'Dễ', 'Trẻ em'],
    url: createSvgDataUrl(`
      <!-- Thân & Đầu gấu trúc -->
      <ellipse cx="250" cy="270" rx="120" ry="110" stroke-width="3" />
      <!-- Tai đen -->
      <circle cx="160" cy="180" r="35" fill="#111827" />
      <circle cx="340" cy="180" r="35" fill="#111827" />
      <!-- Quầng mắt đặc trưng -->
      <ellipse cx="200" cy="260" rx="30" ry="24" transform="rotate(-20 200 260)" fill="#111827" />
      <circle cx="204" cy="255" r="7" fill="#ffffff" />
      <ellipse cx="300" cy="260" rx="30" ry="24" transform="rotate(20 300 260)" fill="#111827" />
      <circle cx="296" cy="255" r="7" fill="#ffffff" />
      <!-- Mũi & Miệng cười -->
      <ellipse cx="250" cy="295" rx="16" ry="10" fill="#111827" />
      <path d="M 250 305 L 250 318 Q 235 330 225 320" stroke-width="2.5" />
      <path d="M 250 318 Q 265 330 275 320" stroke-width="2.5" />
      <!-- Má hồng -->
      <circle cx="160" cy="295" r="12" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="340" cy="295" r="12" stroke-width="1.5" stroke-dasharray="3 3" />
      <!-- Bàn chân ôm cành trúc -->
      <ellipse cx="170" cy="370" rx="25" ry="30" fill="#111827" />
      <ellipse cx="330" cy="370" rx="25" ry="30" fill="#111827" />
      <!-- Cành lá trúc -->
      <line x1="90" y1="410" x2="410" y2="410" stroke-width="8" />
      <line x1="90" y1="410" x2="410" y2="410" stroke="#ffffff" stroke-width="2" />
      <path d="M 370 410 Q 420 380 440 370 Q 420 400 390 410" fill="#111827" />
    `)
  },
  {
    id: 'butterfly-sketch',
    title: 'Bướm Nghệ Thuật',
    category: 'beginner',
    difficulty: 'Dễ',
    tags: ['Bướm', 'Cơ bản', 'Đối xứng', 'Dễ vẽ'],
    url: createSvgDataUrl(`
      <!-- Thân bướm -->
      <ellipse cx="250" cy="250" rx="10" ry="60" fill="#111827" />
      <circle cx="250" cy="180" r="12" fill="#111827" />
      <!-- Râu bướm -->
      <path d="M 245 170 Q 210 130 180 135 Q 170 145 180 150" stroke-width="2.5" />
      <path d="M 255 170 Q 290 130 320 135 Q 330 145 320 150" stroke-width="2.5" />
      <!-- Cánh trên trái -->
      <path d="M 245 200 Q 150 110 90 150 Q 60 210 140 260 L 245 240" stroke-width="3.5" />
      <!-- Cánh dưới trái -->
      <path d="M 245 250 Q 120 280 140 350 Q 180 390 245 290" stroke-width="3" />
      <!-- Hoa văn cánh trái -->
      <ellipse cx="145" cy="200" rx="25" ry="18" stroke-width="2" />
      <circle cx="180" cy="330" r="14" stroke-width="2" />
      <!-- Cánh trên phải -->
      <path d="M 255 200 Q 350 110 410 150 Q 440 210 360 260 L 255 240" stroke-width="3.5" />
      <!-- Cánh dưới phải -->
      <path d="M 255 250 Q 380 280 360 350 Q 320 390 255 290" stroke-width="3" />
      <!-- Hoa văn cánh phải -->
      <ellipse cx="355" cy="200" rx="25" ry="18" stroke-width="2" />
      <circle cx="320" cy="330" r="14" stroke-width="2" />
    `)
  },
  {
    id: 'chibi-dino',
    title: 'Khủng Long Nhỏ',
    category: 'cartoon',
    difficulty: 'Dễ',
    tags: ['Khủng long', 'Chibi', 'Hoạt hình', 'Vui nhộn'],
    url: createSvgDataUrl(`
      <!-- Đầu & Thân khủng long -->
      <path d="M 200 370 L 160 370 Q 150 280 170 200 Q 200 130 280 130 Q 370 130 370 210 Q 370 270 330 300 Q 380 340 390 390 L 330 390" stroke-width="3.5" />
      <!-- Miệng & Mũi -->
      <circle cx="340" cy="180" r="4" fill="#111827" />
      <path d="M 320 210 Q 345 220 365 205" stroke-width="2.5" />
      <!-- Mắt tròn -->
      <circle cx="280" cy="180" r="15" fill="#111827" />
      <circle cx="275" cy="175" r="5" fill="#ffffff" />
      <!-- Gai lưng ngộ nghĩnh -->
      <polygon points="200,140 185,110 220,130" fill="#111827" />
      <polygon points="175,175 145,160 170,195" fill="#111827" />
      <polygon points="160,230 130,225 158,255" fill="#111827" />
      <polygon points="158,290 125,295 160,320" fill="#111827" />
      <!-- Tay nhỏ -->
      <path d="M 290 260 Q 330 270 315 285 Q 285 280 280 270 Z" stroke-width="2.5" />
      <!-- Đuôi khủng long -->
      <path d="M 160 370 Q 80 380 60 340 Q 90 310 160 330" stroke-width="3.5" />
      <polygon points="110,325 80,310 100,340" fill="#111827" />
    `)
  }
];
