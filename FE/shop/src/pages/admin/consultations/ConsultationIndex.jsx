import React, { useState, useEffect } from 'react';
import consultationService from '../../../services/consultationService';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  PhoneCall,
  XCircle,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  X,
  RotateCcw,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ConsultationIndex = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Chi tiết & Cập nhật
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [updateStatusVal, setUpdateStatusVal] = useState('PENDING');
  const [adminNotesVal, setAdminNotesVal] = useState('');
  const [updating, setUpdating] = useState(false);

  // Modal Xóa
  const [deleteId, setDeleteId] = useState(null);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await consultationService.getConsultations(page, keyword, statusFilter);
      if (res && res.content) {
        setConsultations(res.content);
        setTotalPages(res.totalPages || 0);
        setTotalElements(res.totalElements || 0);
      } else {
        setConsultations([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Lỗi tải yêu cầu tư vấn:', err);
      toast.error('Không thể tải danh sách yêu cầu tư vấn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [page, keyword, statusFilter]);

  const handleOpenDetail = (item) => {
    setSelectedConsultation(item);
    setUpdateStatusVal(item.status);
    setAdminNotesVal(item.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) return;
    setUpdating(true);
    try {
      await consultationService.updateStatus(selectedConsultation.id, {
        status: updateStatusVal,
        adminNotes: adminNotesVal,
      });
      toast.success('Cập nhật trạng thái yêu cầu thành công!');
      setSelectedConsultation(null);
      fetchConsultations();
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      toast.error('Không thể cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await consultationService.deleteConsultation(deleteId);
      toast.success('Đã xóa yêu cầu tư vấn thành công');
      setDeleteId(null);
      fetchConsultations();
    } catch (err) {
      console.error('Lỗi xóa:', err);
      toast.error('Không thể xóa yêu cầu');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Chờ xử lý</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Đã liên hệ</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hoàn thành</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-gray-900">
              Quản Lý Yêu Cầu Tư Vấn & Báo Giá File
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi, xử lý danh mục thiết bị khách hàng gửi và tải file đính kèm (Excel, PDF...).
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={keyword}
            onSearch={(kw) => {
              setPage(0);
              setKeyword(kw);
            }}
            placeholder="Tìm theo tên khách, SĐT, tiêu đề..."
            className="w-full sm:w-72"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(0);
              setStatusFilter(e.target.value);
            }}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:bg-white focus:outline-none focus:border-teal-600"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý (PENDING)</option>
            <option value="CONTACTED">Đã liên hệ (CONTACTED)</option>
            <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500">Đang tải danh sách yêu cầu...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="py-16 text-center space-y-3 text-gray-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-sm font-bold text-gray-700">Chưa có yêu cầu tư vấn / báo giá nào</p>
            <p className="text-xs text-gray-400">Các file báo giá khách hàng gửi sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Mã / Ngày gửi</th>
                  <th className="py-3.5 px-4">Khách hàng liên hệ</th>
                  <th className="py-3.5 px-4">Tiêu đề & Nội dung</th>
                  <th className="py-3.5 px-4">File đính kèm</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consultations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-teal-800">#{item.id}</span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="text-gray-900 block font-bold">{item.fullName}</strong>
                      <span className="text-[11px] text-teal-700 font-semibold block">{item.phone}</span>
                      {item.email && <span className="text-[10px] text-gray-400 block">{item.email}</span>}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.content}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.attachmentUrl ? (
                        <a
                          href={`http://localhost:8080${item.attachmentUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-teal-600" />
                          <span className="max-w-[120px] truncate">{item.attachmentName || 'Tải file'}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Không có file</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="p-1.5 bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white rounded-lg transition cursor-pointer"
                          title="Xem chi tiết & Xử lý"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition cursor-pointer"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        <div className="p-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>

      {/* Modal Chi Tiết & Cập Nhật Trạng Thái */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-700 font-mono">
                  YÊU CẦU #{selectedConsultation.id}
                </span>
                <h2 className="text-lg font-black text-gray-900 mt-0.5">
                  Chi Tiết Báo Giá & Tư Vấn
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConsultation(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin khách hàng */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
              <div className="space-y-0.5">
                <span className="text-gray-500 font-medium">Họ tên khách:</span>
                <p className="font-bold text-gray-900">{selectedConsultation.fullName}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 font-medium">Số điện thoại:</span>
                <p className="font-bold text-teal-700">{selectedConsultation.phone}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 font-medium">Email:</span>
                <p className="font-bold text-gray-900">{selectedConsultation.email || 'Không cung cấp'}</p>
              </div>
            </div>

            {/* Tiêu đề & Nội dung */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-500 font-bold block mb-1">Tiêu đề:</span>
                <p className="font-bold text-gray-900 text-sm">{selectedConsultation.title}</p>
              </div>
              <div>
                <span className="text-gray-500 font-bold block mb-1">Nội dung yêu cầu chi tiết:</span>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedConsultation.content}
                </div>
              </div>
            </div>

            {/* File đính kèm */}
            {selectedConsultation.attachmentUrl && (
              <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-teal-700 shrink-0" />
                  <div>
                    <p className="font-bold text-teal-950">{selectedConsultation.attachmentName}</p>
                    <p className="text-[11px] text-teal-700">
                      {selectedConsultation.fileSize ? `${(selectedConsultation.fileSize / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                </div>
                <a
                  href={`http://localhost:8080${selectedConsultation.attachmentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file về</span>
                </a>
              </div>
            )}

            {/* Form Cập nhật trạng thái */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Xử Lý & Cập Nhật Trạng Thái
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Trạng thái xử lý</label>
                  <select
                    value={updateStatusVal}
                    onChange={(e) => setUpdateStatusVal(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="PENDING">Chờ xử lý (PENDING)</option>
                    <option value="CONTACTED">Đã liên hệ tư vấn (CONTACTED)</option>
                    <option value="COMPLETED">Đã hoàn thành / Báo giá xong (COMPLETED)</option>
                    <option value="CANCELLED">Đã hủy (CANCELLED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ghi chú của Admin</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đã gọi điện chiết khấu 15%..."
                    value={adminNotesVal}
                    onChange={(e) => setAdminNotesVal(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50"
                >
                  {updating ? 'Đang lưu...' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Xác nhận xóa yêu cầu?</h3>
              <p className="text-xs text-gray-500 mt-1">Yêu cầu này sẽ được chuyển vào mục lưu trữ đã xóa.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationIndex;

