import React, { useState } from 'react';
import {
  PhoneCall,
  MessageCircle,
  X,
  Headphones,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Số Zalo, Messenger & Hotline
  const ZALO_URL = 'https://zalo.me/0914066662';
  const MESSENGER_URL = 'https://www.facebook.com/kim.lien.ngo.304193';
  const HOTLINE_TEL = 'tel:0914066662';

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 select-none">
      {/* Cụm các nút liên hệ nổi khi mở rộng */}
      <div
        className={`flex flex-col items-start gap-3 transition-all duration-300 transform ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* 1. NÚT GỌI HOTLINE */}
        <div className="relative group flex items-center gap-2.5">
          <a
            href={HOTLINE_TEL}
            className="relative w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/50 hover:scale-110 transition duration-300"
            title="Gọi Hotline 0914 066 662"
          >
            {/* Vòng xung nhịp rung */}
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <PhoneCall className="w-5 h-5 relative z-10 animate-bounce" />
          </a>

          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
            Hotline: 0914 066 662 (8h - 21h)
          </span>
        </div>

        {/* 2. NÚT CHAT MESSENGER */}
        <div className="relative group flex items-center gap-2.5">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084ff] via-[#833ab4] to-[#e1306c] hover:opacity-95 text-white flex items-center justify-center shadow-lg hover:scale-110 transition duration-300"
            title="Chat Messenger Facebook"
          >
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-ping"></span>
            {/* SVG Messenger Icon */}
            <svg
              className="w-6 h-6 relative z-10 fill-white"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.736 7.205V22l3.39-1.862c.907.251 1.873.388 2.874.388 5.523 0 10-4.145 10-9.268C22 6.145 17.523 2 12 2zm1.066 12.454l-2.73-2.91-5.328 2.91 5.86-6.222 2.798 2.91 5.26-2.91-5.86 6.222z" />
            </svg>
          </a>

          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
            Chat Facebook Messenger
          </span>
        </div>

        {/* 3. NÚT CHAT ZALO */}
        <div className="relative group flex items-center gap-2.5">
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0055d4] text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/50 hover:scale-110 transition duration-300"
            title="Chat Zalo hỗ trợ"
          >
            <span className="absolute inset-0 rounded-full bg-blue-400 opacity-60 animate-ping"></span>
            {/* Zalo Text Badge */}
            <span className="font-black text-sm tracking-tighter relative z-10 text-white drop-shadow-sm">
              Zalo
            </span>
          </a>

          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
            Tư vấn qua Zalo
          </span>
        </div>
      </div>

      {/* 4. NÚT TRỤ CHÍNH (FAB TOGGLE BUTTON) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/80 cursor-pointer group"
        title={isOpen ? 'Thu gọn hỗ trợ' : 'Mở kênh tư vấn trực tuyến'}
      >
        {/* Glow halo */}
        <span className="absolute -inset-1 rounded-full bg-teal-400 opacity-40 blur-xs group-hover:opacity-75 transition"></span>

        {isOpen ? (
          <X className="w-6 h-6 relative z-10 transition-transform duration-300 rotate-0 group-hover:rotate-90" />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Headphones className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] font-extrabold tracking-tighter uppercase leading-none mt-0.5">
              Tư vấn
            </span>
          </div>
        )}

        {/* Badge chấm đỏ online */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};

export default FloatingContactWidget;

