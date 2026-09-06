import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import consultationService from '../../services/consultationService';
import {
  FileSpreadsheet,
  UploadCloud,
  FileText,
  X,
  Send,
  Clock,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Headphones,
  FileCheck,
  Download,
  HelpCircle,
  Sparkles,
  Building2,
  FileQuestion
} from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadQuoteExcelTemplate } from '../../utils/quoteTemplateExport';

export const ConsultationPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error('Dung lượng file tối đa là 25MB!');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: isAuthenticated ? (user?.fullName || user?.username || '') : '',
      phone: isAuthenticated ? (user?.phone || '') : '',
      email: isAuthenticated ? (user?.email || '') : '',
      title: '',
      content: '',
    });
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast.error(`Vui lòng chờ ${cooldown} giây trước khi gửi tiếp!`);
      return;
    }
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.title.trim() || !formData.content.trim()) {
      toast.error('Vui lòng điền họ tên, số điện thoại, tiêu đề và nội dung yêu cầu!');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName.trim());
      data.append('phone', formData.phone.trim());
      data.append('email', formData.email.trim());
      data.append('title', formData.title.trim());
      data.append('content', formData.content.trim());
      if (user?.id) {
        data.append('userId', user.id);
      }
      if (selectedFile) {
        data.append('file', selectedFile);
      }

      await consultationService.submitConsultation(data);
      setSubmitted(true);
      toast.success('Gửi yêu cầu báo giá / tư vấn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setCooldown(30);
    } catch (err) {
      console.error('Lỗi gửi tư vấn:', err);
      toast.error('Không thể gửi yêu cầu: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#13636b] to-[#0d4f56] text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
          <FileSpreadsheet className="w-4 h-4" />
          <span>DỊCH VỤ BÁO GIÁ THIẾT BỊ Y TẾ QUA FILE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Gửi Yêu Cầu Báo Giá & Tư Vấn Kỹ Thuật Y Khoa
        </h1>
        <p className="text-xs sm:text-sm text-teal-100 font-light max-w-2xl leading-relaxed">
          Quý khách hàng, phòng khám hoặc cơ quan có thể gửi trực tiếp bảng kê danh mục thiết bị (Excel, PDF, Word) để nhận báo giá sỉ chiết khấu cao kèm chứng nhận CO/CQ.
        </p>
      </div>

      {/* Hướng dẫn mục đích tính năng & Tải mẫu Excel */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-teal-700 font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Khi nào bạn nên sử dụng tính năng này?
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gray-900">
              Giải Pháp Báo Giá Y Tế Nhanh & Chuyên Nghiệp
            </h2>
          </div>

          <button
            type="button"
            onClick={downloadQuoteExcelTemplate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>TẢI MẪU EXCEL BÁO GIÁ (.XLSX/.CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
              Sản phẩm chưa có trên Web
            </h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Bạn cần tìm các dòng máy chuyên dụng, vật tư tiêu hao đặc thù, model mới hoặc thiết bị đặt hàng nhập khẩu riêng theo yêu cầu của bệnh viện/phòng khám.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
              Báo Giá Sỉ & Dự Án Phòng Khám
            </h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Cung cấp gói thầu setup trọn gói phòng khám đa khoa, nha khoa, xét nghiệm hoặc mua số lượng lớn với mức chiết khấu thương mại cao nhất.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
              Báo Giá Trực Tiếp & Hợp Đồng
            </h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Nhận file báo giá chính thức có mộc đỏ công ty, xuất hóa đơn VAT điện tử, đầy đủ hồ sơ pháp lý kiểm định CO/CQ và bảo hành chính hãng tận nơi.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Yêu Cầu Đã Được Tiếp Nhận Thành Công!</h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Cảm ơn <strong>{formData.fullName}</strong>. Yêu cầu báo giá của bạn đã được ghi nhận vào hệ thống. Đội ngũ Dược sĩ & Chuyên viên y tế Kim Liên sẽ liên hệ trực tiếp qua số điện thoại <strong>{formData.phone}</strong> trong vòng 15-30 phút.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              handleReset();
            }}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            Gửi yêu cầu báo giá khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          {isAuthenticated && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
              <span>Đang tự động điền từ tài khoản: <strong>{user?.fullName || user?.username}</strong></span>
              <span className="font-mono text-teal-700 text-[11px]">{user?.email}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Họ và tên người liên hệ *
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn An"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
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
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email nhận báo giá
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tiêu đề yêu cầu báo giá / tư vấn *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Báo giá sỉ thiết bị phòng khám nha khoa / Đơn hàng máy đo đường huyết"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nội dung mô tả yêu cầu *
            </label>
            <textarea
              required
              rows="4"
              placeholder="Liệt kê danh sách thiết bị, model mong muốn, số lượng hoặc tình trạng bệnh nhân cần tư vấn..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
            ></textarea>
          </div>

          {/* Upload file đính kèm */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Đính kèm file danh mục thiết bị (Excel .xlsx, .xls, Word, PDF, Ảnh - Tối đa 25MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-teal-600 rounded-2xl p-5 text-center bg-gray-50 transition">
              {selectedFile ? (
                <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs text-teal-900">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-6 h-6 text-teal-600 shrink-0" />
                    <div>
                      <p className="font-bold truncate">{selectedFile.name}</p>
                      <p className="text-gray-500 text-[10px]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer shrink-0"
                    title="Xóa file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <UploadCloud className="w-10 h-10 text-teal-600 mx-auto" />
                  <p className="text-xs font-bold text-gray-800">
                    Bấm để chọn file hoặc kéo thả file danh sách thiết bị vào đây
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Định dạng hỗ trợ: .xlsx, .xls, .docx, .doc, .pdf, .jpg, .png
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.doc,.docx,.pdf,image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1.5 px-1">
              <span>Chưa có danh sách sẵn?</span>
              <button
                type="button"
                onClick={downloadQuoteExcelTemplate}
                className="font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Mẫu Báo Giá Excel Chuẩn (.CSV/.XLSX)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới form</span>
            </button>

            <button
              type="submit"
              disabled={submitting || cooldown > 0}
              className="w-full sm:w-auto px-8 py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white font-black rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tải lên & gửi...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Vui lòng chờ {cooldown}s...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Cam kết hỗ trợ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3 shadow-2xs">
          <Clock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-bold">Phản Hồi Trong 30 Phút</strong>
            <span className="text-gray-500 text-[11px]">Đội ngũ Dược sĩ gọi lại tư vấn kỹ thuật ngay lập tức.</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3 shadow-2xs">
          <FileCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-bold">Báo Giá Có Dấu Đỏ & VAT</strong>
            <span className="text-gray-500 text-[11px]">Cung cấp hợp đồng, hóa đơn VAT và giấy kiểm định CO/CQ.</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3 shadow-2xs">
          <Headphones className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block font-bold">Hotline 24/7</strong>
            <span className="text-gray-500 text-[11px]">Hỗ trợ khẩn cấp & Zalo: 0914 066 662.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;

