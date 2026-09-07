import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import userReportService from '../../services/userReportService';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Calendar,
  Layers,
  ShieldCheck,
  FileText,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  DownloadCloud,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UserReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadQuotationTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Bieu_Mau_Co_The_Dung_Yeu_Cau_Bao_Gia_Thiet_Bi_Y_Te.xlsx';
    link.download = 'Bieu_Mau_Co_The_Dung_Yeu_Cau_Bao_Gia_Thiet_Bi_Y_Te.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã tải xuống Biểu Mẫu Yêu Cầu Báo Giá Thiết Bị Y Tế (.xlsx)!');
  };

  const [formData, setFormData] = useState({
    reportType: 'ORDER_SUMMARY',
    reportTitle: '',
    dateRange: 'Toàn bộ thời gian',
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const list = await userReportService.getMyReports();
      setReports(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách báo cáo:', error);
      toast.error('Không thể tải lịch sử báo cáo Excel của bạn!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newReport = await userReportService.requestReport(formData);
      toast.success('Hệ thống đã tạo và hoàn tất báo cáo Excel của bạn!');
      setIsModalOpen(false);
      setFormData({
        reportType: 'ORDER_SUMMARY',
        reportTitle: '',
        dateRange: 'Toàn bộ thời gian',
      });
      fetchReports();
    } catch (error) {
      console.error('Lỗi yêu cầu báo cáo:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo báo cáo Excel!';
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (report) => {
    setDownloadingId(report.id);
    try {
      await userReportService.downloadReport(report.id, report.fileName || `Bao_Cao_${report.id}.xlsx`);
      toast.success(`Đã tải xuống ${report.reportTitle}!`);
    } catch (error) {
      console.error('Lỗi tải file báo cáo:', error);
      toast.error('Không thể tải file báo cáo. Vui lòng thử lại!');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi báo cáo này?')) return;
    try {
      await userReportService.deleteReport(reportId);
      toast.success('Đã xóa báo cáo khỏi danh sách!');
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      toast.error('Không thể xóa báo cáo!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã hoàn thành
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            Đang xử lý
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Đang chờ tạo
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Tạo thất bại
          </span>
        );
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Đang cập nhật';
    const kb = (bytes / 1024).toFixed(1);
    return `${kb} KB`;
  };

  const completedCount = reports.filter((r) => r.status === 'COMPLETED').length;
  const processingCount = reports.filter((r) => r.status === 'PROCESSING' || r.status === 'PENDING').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Báo Cáo & Dữ Liệu Excel Cá Nhân</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Theo Dõi Báo Cáo Excel Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Quản lý, theo dõi trạng thái và tải về các file báo cáo Excel (.xlsx) tổng hợp đơn hàng, lịch sử mua sắm và dự toán chi phí thiết bị y tế của tài khoản <strong>{user?.fullName || user?.username}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadQuotationTemplate}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs transition border border-white/20 shadow-md cursor-pointer"
              title="Tải biểu mẫu Excel yêu cầu báo giá thiết bị y tế"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-300" />
              <span>Tải Biểu Mẫu Báo Giá (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs transition shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yêu Cầu Xuất Báo Cáo Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Thống kê trạng thái nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Tổng số báo cáo đã tạo</span>
            <strong className="text-2xl font-black text-gray-900">{reports.length}</strong>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Báo cáo sẵn sàng tải về</span>
            <strong className="text-2xl font-black text-emerald-700">{completedCount}</strong>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Đang xử lý / Chờ tạo</span>
            <strong className="text-2xl font-black text-blue-700">{processingCount}</strong>
          </div>
        </div>
      </div>

      {/* 2.5 Banner Biểu Mẫu Yêu Cầu Báo Giá Excel Chuẩn */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border border-teal-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-teal-950">
                Biểu Mẫu Yêu Cầu Báo Giá Thiết Bị Y Tế (.xlsx)
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                File Mẫu Chuẩn
              </span>
            </div>
            <p className="text-xs text-teal-800/90 leading-relaxed">
              Tải biểu mẫu Excel chuẩn, điền danh sách thiết bị cần mua rồi gửi cho shop qua form hoặc Zalo <strong>0914 066 662</strong> để nhận báo giá chiết khấu trong 30 phút.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadQuotationTemplate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-md shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Tải Biểu Mẫu (.xlsx)</span>
        </button>
      </div>

      {/* 3. Danh sách báo cáo Excel */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-700" />
              <span>Lịch Sử Yêu Cầu Xuất Báo Cáo Excel</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Dữ liệu được cập nhật tự động khi hệ thống hoàn tất quá trình tổng hợp.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReports}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition cursor-pointer shrink-0"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-700' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500">Đang tải danh sách báo cáo của bạn...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Chưa có báo cáo Excel nào</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bạn chưa yêu cầu xuất báo cáo nào. Hãy bấm nút bên dưới để tạo báo cáo tổng hợp đơn hàng & chi phí thiết bị y tế của bạn.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo báo cáo đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-4">Tên & Loại Báo Cáo</th>
                  <th className="p-4">Thời Gian Yêu Cầu</th>
                  <th className="p-4">Thời Gian Hoàn Thành</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4">Dung Lượng</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-gray-900 block font-bold">{r.reportTitle}</strong>
                          <span className="text-[11px] text-gray-500">
                            Loại: {r.reportType} | Phạm vi: {r.dateRange || 'Toàn bộ'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {r.requestedAt ? new Date(r.requestedAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {r.completedAt ? (
                        <span className="text-emerald-700 font-medium">
                          {new Date(r.completedAt).toLocaleString('vi-VN')}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Đang xử lý...</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">{getStatusBadge(r.status)}</td>

                    <td className="p-4 text-gray-600 font-medium whitespace-nowrap">
                      {formatFileSize(r.fileSize)}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-2">
                      {r.status === 'COMPLETED' ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(r)}
                          disabled={downloadingId === r.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer disabled:opacity-50"
                          title="Tải file Excel"
                        >
                          {downloadingId === r.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Tải Excel</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Chờ hoàn tất</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Xóa khỏi lịch sử"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Modal Yêu Cầu Tạo Báo Cáo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-700 rounded-2xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Yêu Cầu Xuất Báo Cáo Excel</h3>
                  <p className="text-xs text-gray-500">Hệ thống sẽ tổng hợp dữ liệu đơn hàng thành file .xlsx</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Loại báo cáo <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none bg-gray-50/50 cursor-pointer"
                >
                  <option value="ORDER_SUMMARY">1. Báo Cáo Tổng Hợp Đơn Hàng & Báo Giá Y Tế (Khuyên dùng)</option>
                  <option value="PURCHASE_HISTORY">2. Báo Cáo Chi Tiết Lịch Sử Mua Hàng & Danh Mục Thiết Bị</option>
                  <option value="EQUIPMENT_EXPENSE">3. Báo Cáo Thống Kê Dự Toán Chi Phí Thiết Bị Y Tế</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tên tùy chỉnh báo cáo (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Báo Cáo Chi Phí Thiết Bị Phòng Khám Q1/2026"
                  value={formData.reportTitle}
                  onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phạm vi thời gian
                </label>
                <select
                  value={formData.dateRange}
                  onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none bg-gray-50/50 cursor-pointer"
                >
                  <option value="Toàn bộ thời gian">Toàn bộ thời gian (Tất cả đơn hàng)</option>
                  <option value="30 ngày gần nhất">30 ngày gần nhất</option>
                  <option value="90 ngày gần nhất (Quý gần nhất)">90 ngày gần nhất (Quý gần nhất)</option>
                  <option value="Năm hiện tại 2026">Năm hiện tại (2026)</option>
                </select>
              </div>

              <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200 text-[11px] text-teal-900 leading-relaxed space-y-2">
                <div className="flex items-center justify-between">
                  <span>ℹ️ <strong>Lưu ý bảo mật:</strong> File Excel chỉ chứa dữ liệu đơn hàng và danh mục thiết bị của chính tài khoản của bạn.</span>
                </div>
                <div className="pt-1 border-t border-teal-200/80 flex items-center justify-between">
                  <span className="text-teal-800">Cần biểu mẫu gửi yêu cầu báo giá thiết bị?</span>
                  <button
                    type="button"
                    onClick={handleDownloadQuotationTemplate}
                    className="font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Tải file mẫu (.xlsx)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Xác Nhận & Xuất Báo Cáo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReportsPage;

