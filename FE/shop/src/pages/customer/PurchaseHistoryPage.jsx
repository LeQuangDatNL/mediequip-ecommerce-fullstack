import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import reviewService from '../../services/reviewService';
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
  FileSpreadsheet,
  Download,
  Phone,
  User,
  MapPin,
  Calendar,
  Search,
  RefreshCw,
  ChevronRight,
  Star,
  ExternalLink,
  ShieldCheck,
  Check,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const PurchaseHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const list = await orderService.getMyOrders();
      setOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử mua hàng:', error);
      toast.error('Không thể tải lịch sử mua hàng của bạn!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDownloadExcel = async (orderId) => {
    setDownloadingId(orderId);
    try {
      await orderService.downloadQuotation(orderId);
      toast.success(`Đã tải xuống Bảng báo giá Excel #MD-${orderId}!`);
    } catch (error) {
      console.error('Lỗi tải bảng báo giá:', error);
      toast.error('Không thể xuất file Excel báo giá!');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenReview = (product, order) => {
    setReviewProduct({ ...product, orderId: order.id });
    setReviewRating(5);
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá của bạn!');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(reviewProduct.productId, {
        userId: user?.id,
        orderId: reviewProduct.orderId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success('Gửi đánh giá sản phẩm thành công! Cảm ơn bạn.');
      setReviewModalOpen(false);
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá!';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === 0) return 'Báo giá ưu đãi';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Chờ xác nhận (Báo giá)
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
            Đã xác nhận
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <PackageCheck className="w-3.5 h-3.5 text-indigo-600" />
            Đang đóng gói & kiểm định
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Truck className="w-3.5 h-3.5 text-cyan-600 animate-bounce" />
            Đang giao hàng
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã giao / Hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Đã hủy đơn
          </span>
        );
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Đã thanh toán</span>;
      case 'UNPAID':
        return <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Chưa thanh toán</span>;
      case 'PENDING':
        return <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Đang chờ xác nhận</span>;
      case 'REFUNDED':
        return <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">Đã hoàn tiền</span>;
      default:
        return <span className="text-xs text-gray-600">{status}</span>;
    }
  };

  // Lọc theo tabs trạng thái và ô tìm kiếm
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'ALL' && ord.orderStatus !== statusFilter) {
      return false;
    }
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      const matchId = `md-${ord.id}`.includes(q) || String(ord.id).includes(q);
      const matchRecipient = ord.recipientName?.toLowerCase().includes(q) || ord.recipientPhone?.includes(q);
      const matchProduct = ord.items?.some((item) => item.productName?.toLowerCase().includes(q));
      return matchId || matchRecipient || matchProduct;
    }
    return true;
  });

  const filterTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'PROCESSING', label: 'Đang xử lý' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
              <span>Lịch Sử Giao Dịch & Mua Hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Lịch Sử Mua Hàng Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              Theo dõi chi tiết tất cả đơn hàng đã mua, danh mục thiết bị, tổng kinh phí và tải bảng báo giá Excel trực tiếp từ hệ thống.
            </p>
          </div>

          <Link
            to="/user-reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur-md border border-white/15 transition self-start sm:self-center"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Xem Báo Cáo Excel Tổng Hợp</span>
          </Link>
        </div>
      </div>

      {/* 2. Thanh lọc Tabs & Tìm kiếm */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs Trạng Thái */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const count = tab.key === 'ALL'
                ? orders.length
                : orders.filter((o) => o.orderStatus === tab.key).length;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === tab.key
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      statusFilter === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ô Tìm Kiếm */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="Tìm theo mã đơn, thiết bị..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-700 focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 3. Danh sách đơn hàng */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Đang tải lịch sử mua hàng của bạn...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">Không tìm thấy đơn hàng nào</h3>
            <p className="text-xs text-gray-500">
              {searchKeyword
                ? 'Không có đơn hàng nào khớp với từ khóa tìm kiếm.'
                : 'Bạn chưa có đơn hàng nào ở trạng thái này.'}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-800 transition"
          >
            <span>Khám phá sản phẩm y tế</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-black text-gray-900">#MD-{ord.id}</span>
                  {getOrderStatusBadge(ord.orderStatus)}
                  {getPaymentStatusBadge(ord.paymentStatus)}
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(ord.createdAt).toLocaleString('vi-VN')}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadExcel(ord.id)}
                    disabled={downloadingId === ord.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === ord.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Tải Báo Giá Excel</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(ord)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    <span>Chi tiết & Tiến độ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body - Products List */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="divide-y divide-gray-100">
                  {ord.items?.map((item) => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage || DEFAULT_NO_IMAGE}
                          alt={item.productName}
                          onError={handleImageError}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <Link
                            to={`/products/${item.productId}`}
                            className="font-bold text-gray-900 text-xs hover:text-teal-700 transition line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          <span className="text-[11px] text-gray-500 block">Số lượng: x{item.quantity}</span>
                          <span className="text-[11px] text-emerald-700 font-semibold block">Hàng chính hãng CO/CQ</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-gray-400 block text-[11px]">Đơn giá: {formatPrice(item.price)}</span>
                          <strong className="text-teal-900 font-bold block text-sm">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </strong>
                        </div>

                        {/* Nút gửi đánh giá nếu đơn hàng đã hoàn thành */}
                        {ord.orderStatus === 'DELIVERED' && (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(item, ord)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Đánh giá</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tổng Tiền & Ghi Chú */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-gray-500">
                    Người nhận: <strong className="text-gray-900">{ord.recipientName}</strong> ({ord.recipientPhone}) - {ord.fullAddress}
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-gray-500">Tổng thanh toán đơn hàng: </span>
                    <strong className="text-lg font-black text-emerald-700">{formatPrice(ord.totalAmount)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Modal Chi Tiết Đơn Hàng & Tiến Độ Giao Hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <PackageCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Chi Tiết Đơn Hàng #MD-{selectedOrder.id}</h3>
                  <span className="text-xs text-teal-200">Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-teal-200 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs">
              {/* Trạng thái */}
              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-gray-600 block">Tình trạng đơn hàng:</span>
                  <div className="flex items-center gap-2">
                    {getOrderStatusBadge(selectedOrder.orderStatus)}
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadExcel(selectedOrder.id)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Tải Báo Giá Excel</span>
                </button>
              </div>

              {/* Thông tin giao nhận */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span>Địa chỉ nhận thiết bị y tế:</span>
                </h4>
                <p>Người nhận: <strong className="text-gray-900">{selectedOrder.recipientName}</strong></p>
                <p>Số điện thoại: <strong className="text-gray-900">{selectedOrder.recipientPhone}</strong></p>
                <p>Địa chỉ: <strong className="text-gray-900">{selectedOrder.fullAddress}</strong></p>
                {selectedOrder.note && <p>Ghi chú: <em className="text-teal-900">{selectedOrder.note}</em></p>}
              </div>

              {/* Bảng thiết bị */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-teal-700" />
                  <span>Danh sách thiết bị ({selectedOrder.items?.length || 0}):</span>
                </h4>

                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100/80 text-gray-700 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3">Thiết bị</th>
                        <th className="p-3 text-center">SL</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((it) => (
                        <tr key={it.id}>
                          <td className="p-3 font-semibold text-gray-900">{it.productName}</td>
                          <td className="p-3 text-center font-bold">{it.quantity}</td>
                          <td className="p-3 text-right text-gray-600">{formatPrice(it.price)}</td>
                          <td className="p-3 text-right font-bold text-teal-900">
                            {formatPrice((it.price || 0) * (it.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
                      <tr>
                        <td colSpan="3" className="p-3 text-right">Tổng thanh toán:</td>
                        <td className="p-3 text-right text-emerald-700 text-sm">{formatPrice(selectedOrder.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Gửi Đánh Giá Sản Phẩm */}
      {reviewModalOpen && reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Đánh Giá Sản Phẩm</span>
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
                <img
                  src={reviewProduct.productImage || DEFAULT_NO_IMAGE}
                  alt={reviewProduct.productName}
                  onError={handleImageError}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                />
                <span className="font-bold text-gray-900 line-clamp-2">{reviewProduct.productName}</span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Số sao đánh giá chất lượng:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-amber-700 font-bold ml-2">({reviewRating} / 5 sao)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nhận xét / Đánh giá của bạn: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận về chất lượng thiết bị, độ chính xác và dịch vụ bàn giao kỹ thuật của Kim Liên Medical..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-700 outline-none text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Gửi Đánh Giá</span>
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

export default PurchaseHistoryPage;

