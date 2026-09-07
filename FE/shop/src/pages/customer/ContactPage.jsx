import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  User,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    topic: '1. Báo lỗi website / Sự cố kỹ thuật (Không đặt được hàng, lỗi tính năng...)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // Tự động điền thông tin nếu khách hàng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || user.username || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Vui lòng điền họ tên, số điện thoại và nội dung cần tư vấn!');
      return;
    }
    setSubmitted(true);
    toast.success('Gửi yêu cầu tư vấn thành công! Dược sĩ Kim Liên sẽ liên hệ lại bạn trong 15 phút.');
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
          <Headphones className="w-4 h-4" />
          <span>TRUNG TÂM HỖ TRỢ & TƯ VẤN Y TẾ KIM LIÊN 24/7</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Liên Hệ & Tư Vấn Kỹ Thuật Y Khoa
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 font-light max-w-2xl leading-relaxed">
          Chúng tôi luôn sẵn sàng lắng nghe, tư vấn lựa chọn thiết bị y tế phù hợp và hướng dẫn sử dụng máy đo chuẩn y khoa cho bạn và gia đình.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột 1 & 2 (Trái): Form gửi tin nhắn tư vấn */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Gửi Yêu Cầu Tư Vấn Trực Tuyến</h2>
            <p className="text-xs text-gray-500">
              Điền thông tin bên dưới để nhận được cuộc gọi tư vấn miễn phí từ đội ngũ Dược sĩ.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Yêu Cầu Đã Được Ghi Nhận!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                Cảm ơn <strong>{formData.fullName}</strong>. Chuyên viên y tế của <strong>Thiết Bị Y Tế Kim Liên</strong> sẽ liên hệ trực tiếp qua số điện thoại <strong>{formData.phone}</strong> trong ít phút tới.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: isAuthenticated ? (user?.fullName || user?.username || '') : '',
                    phone: isAuthenticated ? (user?.phone || '') : '',
                    email: isAuthenticated ? (user?.email || '') : '',
                    topic: '1. Báo lỗi website / Sự cố kỹ thuật (Không đặt được hàng, lỗi tính năng...)',
                    message: '',
                  });
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isAuthenticated && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>Đang tự động điền từ tài khoản: <strong>{user?.fullName || user?.username}</strong></span>
                  </div>
                  <span className="font-mono text-teal-700 text-[11px] bg-white px-2 py-0.5 rounded border border-teal-200">{user?.email}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0914 066 662"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Địa chỉ Email (nếu có)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Chủ đề cần hỗ trợ
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="1. Báo lỗi website / Sự cố kỹ thuật (Không đặt được hàng, lỗi tính năng...)">
                      1. 💻 Báo lỗi website / Sự cố kỹ thuật
                    </option>
                    <option value="2. Tìm kiếm sản phẩm chưa có trên web (Hỏi mua thiết bị theo yêu cầu)">
                      2. 🔍 Tìm kiếm sản phẩm chưa có trên web
                    </option>
                    <option value="3. Phản ánh chất lượng sản phẩm / Khiếu nại đổi trả">
                      3. ⚠️ Phản ánh chất lượng sản phẩm / Đổi trả
                    </option>
                    <option value="4. Góp ý & Thắc mắc khác">
                      4. 📝 Góp ý & Thắc mắc khác
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nội dung chi tiết câu hỏi *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Mô tả nhu cầu sử dụng hoặc tình trạng sức khỏe cần hỗ trợ chọn thiết bị..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
              </button>
            </form>
          )}
        </div>

        {/* Cột 3 (Phải): Thông tin Showroom & Kênh kết nối */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
              Thông Tin Showroom Trưng Bày
            </h3>

            <div className="space-y-3.5 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Địa chỉ Showroom:</strong>
                  <span>7/54 Dương Thiệu Tước</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Hotline & Zalo:</strong>
                  <a href="tel:0914066662" className="text-indigo-600 font-bold text-sm hover:underline">0914 066 662</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Hòm Thư Hỗ Trợ:</strong>
                  <a href="mailto:lienkehoach@gmail.com" className="text-indigo-600 font-semibold hover:underline">lienkehoach@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Giờ Làm Việc:</strong>
                  <span>08:00 - 21:30 (Tất cả các ngày trong tuần)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kênh mạng xã hội kết nối trực tiếp */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100/80 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-indigo-950 text-sm">
              Kênh Chat Trực Tiếp Nhanh
            </h3>

            <div className="space-y-2">
              <a
                href="https://zalo.me/0914066662"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-white hover:bg-cyan-50 border border-cyan-200 rounded-2xl text-xs font-bold text-cyan-700 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center font-black text-xs">Z</span>
                  <span>Nhắn tin Zalo: 0914 066 662</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              <a
                href="https://www.facebook.com/kim.lien.ngo.304193"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 border border-blue-200 rounded-2xl text-xs font-bold text-blue-700 transition shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs">f</span>
                  <span>Facebook Kim Liên</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

