import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../../services/orderService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  ShoppingBag,
  Plus,
  Eye,
  Trash2,
  RotateCcw,
  PackageCheck,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderIndex = () => {
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_orders_filter', {
    page: 0,
    keyword: '',
  });

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders(page, keyword, selectedStatus);
      if (response && response.content) {
        setOrders(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setOrders(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setOrders([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3"/> Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"><PackageCheck className="w-3 h-3"/> Đã xác nhận</span>;
      case 'PROCESSING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><PackageCheck className="w-3 h-3"/> Đang đóng gói</span>;
      case 'SHIPPING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200"><Truck className="w-3 h-3"/> Đang giao</span>;
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3"/> Đã giao hàng</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3 h-3"/> Đã hủy (Xóa mềm)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="text-[11px] font-bold text-emerald-600">Đã thanh toán</span>;
      case 'UNPAID':
        return <span className="text-[11px] font-bold text-amber-600">Chưa thanh toán</span>;
      case 'PENDING':
        return <span className="text-[11px] font-bold text-blue-600">Đang xử lý</span>;
      case 'FAILED':
        return <span className="text-[11px] font-bold text-red-600">Thất bại</span>;
      default:
        return <span className="text-[11px] text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Nút Thêm Mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Danh Sách Đơn Hàng (Order Index)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Giao diện quản lý đơn đặt hàng, cập nhật vận chuyển và trạng thái thanh toán.
          </p>
        </div>

        <Link
          to="/admin/orders/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Đơn Hàng Thủ Công (Create)</span>
        </Link>
      </div>

      {/* Thanh Tìm Kiếm + Bộ Lọc Trạng Thái */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <SearchBar
            value={keyword}
            onSearch={onSearch}
            placeholder="Tìm theo tên khách hoặc SĐT..."
            className="w-full sm:w-80"
          />

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">-- Tất cả trạng thái --</option>
            <option value="PENDING">Chờ duyệt (PENDING)</option>
            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
            <option value="PROCESSING">Đang đóng gói (PROCESSING)</option>
            <option value="SHIPPING">Đang giao (SHIPPING)</option>
            <option value="DELIVERED">Đã giao hàng (DELIVERED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>

          {(keyword || selectedStatus !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedStatus('ALL');
              }}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium self-end md:self-center">
          Tổng cộng: <strong className="text-gray-900">{totalElements}</strong> đơn hàng
        </div>
      </div>

      {/* Bảng Danh Sách Đơn Hàng */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải đơn hàng từ Backend...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Không tìm thấy đơn hàng nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Thử tìm với từ khóa khác hoặc chọn trạng thái khác.' : 'Chưa có đơn hàng nào trong hệ thống.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 w-16">Mã Đơn</th>
                  <th className="px-5 py-3.5">Khách Hàng / Người Nhận</th>
                  <th className="px-5 py-3.5">Số Sản Phẩm</th>
                  <th className="px-5 py-3.5">Tổng Tiền</th>
                  <th className="px-5 py-3.5">Thanh Toán</th>
                  <th className="px-5 py-3.5">Trạng Thái Đơn</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-4 font-bold text-indigo-600">#{ord.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{ord.recipientName || ord.customerName}</p>
                      <p className="text-[11px] text-gray-500">{ord.recipientPhone || ord.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">
                      {ord.items?.length || 0} món
                    </td>
                    <td className="px-5 py-4 font-extrabold text-indigo-600 text-sm">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {ord.paymentMethod === 'VNPAY' ? (
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="font-medium text-gray-800">{ord.paymentMethod}</span>
                      </div>
                      <div className="mt-0.5">{getPaymentStatusBadge(ord.paymentStatus)}</div>
                    </td>
                    <td className="px-5 py-4">
                      {getOrderStatusBadge(ord.orderStatus)}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      {/* Xem chi tiết & Cập nhật đơn hàng */}
                      <Link
                        to={`/admin/orders/update/${ord.id}`}
                        className="inline-flex p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chi tiết & Cập nhật trạng thái (Update)"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Xóa mềm / Hủy đơn hàng */}
                      <Link
                        to={`/admin/orders/delete/${ord.id}`}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa mềm / Hủy đơn hàng (Cancel/Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân Trang << < 1 2 3 ... n > >> */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;

