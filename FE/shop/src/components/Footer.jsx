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
  Heart
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
              <h4 className="font-bold text-white text-sm">Giao hỏa tốc 2H</h4>
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
              <h4 className="font-bold text-white text-sm">Tư vấn Dược sĩ 24/7</h4>
              <p className="text-xs text-gray-400">Hotline 1900 1234</p>
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
                <span>Số 18, Ngõ 86 Phố Duy Tân, Cầu Giấy, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Hotline: <strong className="text-white">1900 1234</strong> | <strong>0901 000 001</strong></span>
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
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-semibold text-blue-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-[11px]">f</span>
                  <span>Facebook Kim Liên Medical</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Zalo */}
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-xs font-semibold text-cyan-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-cyan-500 text-white rounded-full flex items-center justify-center font-black text-[10px]">Z</span>
                  <span>Zalo: 0901 000 001</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Gmail */}
              <a
                href="mailto:kimlienmedical@gmail.com"
                className="flex items-center justify-between p-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-xs font-semibold text-red-300 transition group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>kimlienmedical@gmail.com</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 <strong>Thiết Bị Y Tế Kim Liên</strong>. Tất cả các quyền được bảo hộ.</p>
          <p className="flex items-center gap-1">
            Đồng hành cùng sức khỏe gia đình bạn <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
