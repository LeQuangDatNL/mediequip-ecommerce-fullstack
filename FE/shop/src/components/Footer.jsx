import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  ExternalLink,
  MessageCircle,
  Clock,
  Heart,
  Code2
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-16 border-t border-gray-800 select-none">
      {/* 1. Cam kết chất lượng (Policy highlights) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50">
            <Truck className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">Giao hàng nhanh</h4>
              <p className="text-xs text-gray-400">Toàn quốc & nội thành</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">100% Chính Hãng</h4>
              <p className="text-xs text-gray-400">Đầy đủ hóa đơn CO/CQ</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50">
            <RefreshCw className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">Bảo hành chính hãng</h4>
              <p className="text-xs text-gray-400">Lỗi 1 đổi 1 trong 30 ngày</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50">
            <Headphones className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">Tư vấn Kỹ sư 24/7</h4>
              <p className="text-xs text-gray-400">Hotline 0914 066 662</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Thông tin cửa hàng */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
                KL
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight block">
                  THIẾT BỊ Y TẾ KIM LIÊN
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                  KIM LIEN MEDICAL STORE
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Cung cấp các dòng máy đo huyết áp, máy đo đường huyết, nhiệt kế hồng ngoại, bình rửa mũi và thiết bị y tế gia đình chính hãng.
            </p>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>7/54 Dương Thiệu Tước</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Hotline / Zalo: <strong className="text-white">0914 066 662</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Email: <strong className="text-white">lienkehoach@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Giờ mở cửa: 08:00 - 21:30 (Cả T7 & CN)</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh mục nổi bật */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Danh Mục Nổi Bật</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/products" className="hover:text-indigo-400 transition">Máy đo huyết áp Omron</Link></li>
              <li><Link to="/products" className="hover:text-indigo-400 transition">Nhiệt kế hồng ngoại đo trán</Link></li>
              <li><Link to="/products" className="hover:text-indigo-400 transition">Máy đo đường huyết Accu-Chek</Link></li>
              <li><Link to="/products" className="hover:text-indigo-400 transition">Khẩu trang N95 y tế kháng khuẩn</Link></li>
              <li><Link to="/products" className="hover:text-indigo-400 transition">Thiết bị massage & phục hồi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Chính sách & Hướng dẫn */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-indigo-400 transition">Chính sách bảo hành sản phẩm</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition">Chính sách đổi trả & hoàn tiền</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition">Hướng dẫn mua hàng & thanh toán</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition">Chính sách bảo mật thông tin</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition">Kiểm tra xuất xứ & hóa đơn CO/CQ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Kênh Liên Hệ Mạng Xã Hội (Facebook, Zalo, Gmail) */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Kết Nối Với Chúng Tôi</h4>
            <p className="text-xs text-gray-400">
              Liên hệ tư vấn kỹ thuật y tế, đặt hàng sỉ hoặc giải đáp thắc mắc:
            </p>

            <div className="space-y-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/kim.lien.ngo.304193"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-semibold text-blue-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-[11px]">f</span>
                  <span>Facebook Kim Liên</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Zalo */}
              <a
                href="https://zalo.me/0914066662"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-xs font-semibold text-cyan-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center font-black text-[10px]">Z</span>
                  <span>Zalo: 0914 066 662</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Gmail */}
              <a
                href="mailto:lienkehoach@gmail.com"
                className="flex items-center justify-between p-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-xs font-semibold text-red-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>lienkehoach@gmail.com</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Creator Credit */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 <strong>Thiết Bị Y Tế Kim Liên</strong>. Tất cả các quyền được bảo hộ.</p>

          {/* Designer / Developer Credit */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Thiết kế & Phát triển website:</span>
            <a
              href="https://github.com/LeQuangDatNL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-teal-400 hover:text-teal-300 font-bold border border-gray-700 hover:border-teal-500/50 transition shadow-xs group"
              title="Xem GitHub của người thiết kế web"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>@LeQuangDat</span>
            </a>
          </div>

          <p className="flex items-center gap-1 text-gray-400">
            Đồng hành cùng sức khỏe gia đình bạn <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
