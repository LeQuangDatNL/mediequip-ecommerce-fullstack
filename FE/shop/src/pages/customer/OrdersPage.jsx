import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import {
  PackageCheck,
  Search,
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
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const OrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State: 'track' hoặc 'my_orders'
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'my_orders' && isAuthenticated ? 'my_orders' : 'track'
  );

  // Tracking Form State
  const [trackId, setTrackId] = useState(searchParams.get('orderId') || searchParams.get('id') || '');
  const [trackPhone, setTrackPhone] = useState(searchParams.get('phone') || user?.phone || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // My Orders State
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Excel Download loading state
  const [downloadingId, setDownloadingId] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Hàm tra cứu đơn hàng
  const handleTrackSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    const cleanIdStr = trackId.toString().replace(/[^0-9]/g, '');
    const cleanPhoneStr = trackPhone.trim();

    if (!cleanIdStr) {
      toast.error('Vui lòng nhập Mã đơn hàng cần tra cứu');
      return;
    }

    setTrackingLoading(true);
    setTrackedOrder(null);
    try {
      let data;
      if (cleanPhoneStr) {
        data = await orderService.trackOrder(Number(cleanIdStr), cleanPhoneStr);
      } else {
        // Nếu không nhập SĐT nhưng đã đăng nhập hoặc thử xem trực tiếp
        data = await orderService.getCustomerOrderById(Number(cleanIdStr));
      }
      setTrackedOrder(data);
      toast.success(`Đã tìm thấy thông tin đơn hàng #MD-${data.id}!`);
      // Cập nhật search params
      setSearchParams({ orderId: data.id, phone: cleanPhoneStr });
    } catch (error) {
      console.error('Lỗi tra cứu đơn hàng:', error);
      const msg = error.response?.data?.message || 'Không tìm thấy đơn hàng hoặc Số điện thoại không khớp!';
      toast.error(msg);
    } finally {
      setTrackingLoading(false);
    }
  }, [trackId, trackPhone, setSearchParams]);

  // Tự động tra cứu nếu có query param trên URL
  useEffect(() => {
    const urlOrderId = searchParams.get('orderId') || searchParams.get('id');
    const urlPhone = searchParams.get('phone') || user?.phone;
    if (urlOrderId) {
      setTrackId(urlOrderId);
      if (urlPhone) setTrackPhone(urlPhone);
      const cleanId = urlOrderId.replace(/[^0-9]/g, '');
      if (cleanId) {
        setTrackingLoading(true);
        const fetchMethod = urlPhone
          ? orderService.trackOrder(Number(cleanId), urlPhone)
          : orderService.getCustomerOrderById(Number(cleanId));
        fetchMethod
          .then((data) => setTrackedOrder(data))
          .catch((err) => console.warn('Không thể tự động tải đơn hàng:', err))
          .finally(() => setTrackingLoading(false));
      }
    }
  }, [searchParams, user]);

  // Tải danh sách đơn hàng cá nhân
  const fetchMyOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setMyOrdersLoading(true);
    try {
      const list = await orderService.getMyOrders();
      setMyOrders(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Lỗi tải danh sách đơn hàng:', error);
      toast.error('Không thể tải lịch sử đơn hàng của bạn!');
    } finally {
      setMyOrdersLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'my_orders' && isAuthenticated) {
      fetchMyOrders();
    }
  }, [activeTab, isAuthenticated, fetchMyOrders]);

  // Xử lý tải file Excel báo giá
  const handleDownloadExcel = async (orderId) => {
    setDownloadingId(orderId);
    try {
      await orderService.downloadQuotation(orderId);
      toast.success(`Đã tải xuống Bảng báo giá Excel cho Đơn hàng #MD-${orderId}!`);
    } catch (error) {
      console.error('Lỗi tải bảng báo giá Excel:', error);
      toast.error('Không thể xuất file Excel báo giá. Vui lòng thử lại sau!');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('0914066662');
    setCopiedBank(true);
    toast.success('Đã sao chép số Zalo/Hotline thanh toán!');
    setTimeout(() => setCopiedBank(false), 2500);
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
            Chờ xử lý / Đang lập báo giá
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
            Đã xác nhận & Chốt đơn
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <PackageCheck className="w-3.5 h-3.5 text-indigo-600" />
            Đang chuẩn bị & Kiểm định máy
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Truck className="w-3.5 h-3.5 text-cyan-600 animate-bounce" />
            Đang vận chuyển & Lắp đặt
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã bàn giao & Nghiệm thu
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Đã hủy đơn hàng
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">Đã thanh toán đủ</span>;
      case 'UNPAID':
        return <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">Chưa thanh toán (COD / Chờ CK)</span>;
      case 'PENDING':
        return <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">Đang chờ xác nhận giao dịch</span>;
      case 'REFUNDED':
        return <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">Đã hoàn tiền</span>;
      default:
        return <span className="text-xs text-gray-600">{status}</span>;
    }
  };

  // Timeline Step Status Index (0 -> 4)
  const getTimelineStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPING': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const timelineSteps = [
    { title: 'Tiếp nhận đơn hàng', desc: 'Đã gửi yêu cầu báo giá lên hệ thống' },
    { title: 'Kỹ sư Kim Liên xác nhận', desc: 'Tư vấn thông số & chốt giá ưu đãi' },
    { title: 'Kiểm định & Đóng gói', desc: 'Kiểm tra CO/CQ & tiêu chuẩn y tế' },
    { title: 'Đang vận chuyển', desc: 'Giao hàng & điều động kỹ sư lắp đặt' },
    { title: 'Bàn giao & Nghiệm thu', desc: 'Hướng dẫn sử dụng & kích hoạt bảo hành' }
  ];

  const filteredMyOrders = myOrders.filter((ord) => {
    if (statusFilter === 'ALL') return true;
    return ord.orderStatus === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Header Banner Giới Thiệu */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Hệ Thống Theo Dõi Đơn Hàng & Báo Giá Trực Tuyến</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Theo Dõi Tiến Độ & Báo Giá Đơn Hàng
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Tra cứu nhanh chóng tình trạng đơn hàng, lịch trình giao nhận thiết bị và <strong>tải bảng báo giá Excel (.xlsx)</strong> chính thức từ Kỹ sư Kim Liên Medical.
          </p>
        </div>

        {/* Tab Switching Buttons */}
        <div className="flex items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-teal-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Tra cứu nhanh theo Mã đơn</span>
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setActiveTab('my_orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'my_orders'
                  ? 'bg-white text-teal-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Đơn hàng của tôi ({myOrders.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== TAB 1: TRA CỨU NHANH ĐƠN HÀNG ==================== */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Form Tra cứu */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-700" />
              <span>Nhập thông tin tra cứu tiến độ</span>
            </h2>

            <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mã đơn hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 12 hoặc MD-12"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none bg-gray-50/50"
                  required
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số điện thoại người nhận <span className="text-gray-400 font-normal">(Xác thực bảo mật)</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0914066662"
                  value={trackPhone}
                  onChange={(e) => setTrackPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none bg-gray-50/50"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {trackingLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Tra cứu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Hiển thị chi tiết đơn hàng tra cứu */}
          {trackedOrder && (
            <div className="space-y-6 animate-fade-in">
              {/* Card Tổng quan đơn hàng */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-teal-100 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        Đơn hàng #MD-{trackedOrder.id}
                      </span>
                      {getOrderStatusBadge(trackedOrder.orderStatus)}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Ngày đặt: {new Date(trackedOrder.createdAt).toLocaleString('vi-VN')}</span>
                    </p>
                  </div>

                  {/* Nút Tải Excel Báo Giá */}
                  <button
                    type="button"
                    onClick={() => handleDownloadExcel(trackedOrder.id)}
                    disabled={downloadingId === trackedOrder.id}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {downloadingId === trackedOrder.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                        <span>Tải Bảng Báo Giá Excel (.xlsx)</span>
                        <Download className="w-3.5 h-3.5 text-emerald-200 ml-0.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Visual Timeline 5 Bước */}
                {trackedOrder.orderStatus !== 'CANCELLED' ? (
                  <div className="p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4 text-teal-700" />
                      <span>Tiến độ thực hiện & Giao nhận</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                      {timelineSteps.map((step, idx) => {
                        const currentStep = getTimelineStepIndex(trackedOrder.orderStatus);
                        const isDone = currentStep >= idx;
                        const isCurrent = currentStep === idx;

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-center relative transition flex flex-col items-center justify-center gap-1.5 ${
                              isDone
                                ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                                : 'bg-white border-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-2 ring-teal-600 shadow-xs' : ''}`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isDone ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className="text-[11px] font-bold leading-tight line-clamp-1">{step.title}</span>
                            <span className="text-[9px] text-gray-500 leading-tight line-clamp-2">{step.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3 text-red-800 text-xs font-medium">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>Đơn hàng này đã được hủy theo yêu cầu hoặc do thay đổi kế hoạch dự án.</span>
                  </div>
                )}

                {/* 3. Thông tin Giao nhận & Thanh toán */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <p className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-700" />
                      <span>Thông tin người nhận & Địa chỉ</span>
                    </p>
                    <p className="text-gray-700">Người nhận: <strong className="text-gray-900">{trackedOrder.recipientName}</strong></p>
                    <p className="text-gray-700">Số điện thoại: <strong className="text-gray-900">{trackedOrder.recipientPhone}</strong></p>
                    <p className="text-gray-700">Địa chỉ: <strong className="text-gray-900">{trackedOrder.fullAddress}</strong></p>
                    {trackedOrder.note && (
                      <p className="text-gray-700">Ghi chú: <em className="text-teal-900">{trackedOrder.note}</em></p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <p className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-teal-700" />
                      <span>Thông tin thanh toán & Báo giá</span>
                    </p>
                    <p className="text-gray-700">
                      Hình thức: <strong className="text-teal-900">
                        {trackedOrder.paymentMethod === 'VNPAY' || trackedOrder.paymentMethod === 'QR'
                          ? 'Chuyển khoản QR / ZaloPay'
                          : 'Tiền mặt khi nhận hàng (COD)'}
                      </strong>
                    </p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>Tình trạng:</span>
                      {getPaymentStatusBadge(trackedOrder.paymentStatus)}
                    </div>
                    <p className="text-gray-700">
                      Tổng thanh toán: <strong className="text-emerald-700 font-bold text-sm">{formatPrice(trackedOrder.totalAmount)}</strong>
                    </p>
                    <p className="text-[11px] text-gray-500 italic">
                      * Báo giá đã bao gồm chi phí đóng gói y tế và bảo hành chính hãng.
                    </p>
                  </div>
                </div>

                {/* 4. Bảng danh sách thiết bị y tế */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-teal-700" />
                    <span>Danh sách thiết bị y tế trong đơn ({trackedOrder.items?.length || 0})</span>
                  </h3>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100/70 text-gray-700 border-b border-gray-200 font-bold">
                        <tr>
                          <th className="p-3">Sản phẩm / Thiết bị</th>
                          <th className="p-3 text-center">Số lượng</th>
                          <th className="p-3 text-right">Đơn giá</th>
                          <th className="p-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trackedOrder.items?.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={item.productImage || DEFAULT_NO_IMAGE}
                                alt={item.productName}
                                onError={handleImageError}
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-gray-900 block">{item.productName}</span>
                                <span className="text-[10px] text-gray-400">Thiết bị y tế chính hãng</span>
                              </div>
                            </td>
                            <td className="p-3 text-center font-bold text-gray-700">{item.quantity}</td>
                            <td className="p-3 text-right text-gray-600">{formatPrice(item.price)}</td>
                            <td className="p-3 text-right font-bold text-teal-900">
                              {formatPrice((item.price || 0) * (item.quantity || 1))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50/80 border-t border-gray-200 font-bold text-xs text-gray-800">
                        <tr>
                          <td colSpan="3" className="p-3 text-right">Tổng cộng tiền hàng / Báo giá:</td>
                          <td className="p-3 text-right text-emerald-700 text-sm">{formatPrice(trackedOrder.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* 5. Khối QR Thanh Toán Nếu Khách Chọn Chuyển Khoản & Chưa Thanh Toán */}
                {trackedOrder.paymentStatus !== 'PAID' && (
                  <div className="p-5 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-full">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>KÊNH THANH TOÁN CHUYỂN KHOẢN / QR CODE</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">Hỗ trợ 24/7</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <div className="w-32 h-32 bg-white p-3 rounded-2xl border-2 border-dashed border-teal-300 shadow-xs flex flex-col items-center justify-center shrink-0 text-teal-700">
                        <QrCode className="w-10 h-10 text-teal-600/70 mb-1 animate-pulse" />
                        <span className="text-[10px] font-black text-teal-900">MÃ QR BÁO GIÁ</span>
                        <span className="text-[8px] text-gray-500 font-medium">Đơn #MD-{trackedOrder.id}</span>
                      </div>

                      <div className="text-left text-xs space-y-1.5 flex-1">
                        <p className="text-gray-600">Chủ tài khoản: <strong className="text-gray-900 uppercase">THIẾT BỊ Y TẾ KIM LIÊN</strong></p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Số ĐT & Zalo thanh toán: <strong className="text-teal-900 font-mono text-sm">0914 066 662</strong></span>
                          <button
                            type="button"
                            onClick={handleCopyBank}
                            className="p-1 text-teal-700 hover:text-teal-900 hover:bg-teal-100 rounded transition cursor-pointer"
                            title="Sao chép số Zalo"
                          >
                            {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-gray-600">Nội dung chuyển khoản: <strong className="text-teal-800 font-mono">THANH TOAN DON {trackedOrder.id} - {trackedOrder.recipientPhone}</strong></p>
                        <p className="text-[11px] text-gray-500 pt-1">
                          Kỹ sư Kim Liên sẽ liên hệ trực tiếp để xác nhận ngay sau khi nhận được chuyển khoản hoặc quý khách có thể gửi biên lai qua Zalo <strong>0914 066 662</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: ĐƠN HÀNG CỦA TÔI (MY ORDERS) ==================== */}
      {activeTab === 'my_orders' && (
        <div className="space-y-6">
          {/* Bộ lọc trạng thái */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'PENDING', label: 'Chờ duyệt' },
                { key: 'CONFIRMED', label: 'Đã xác nhận' },
                { key: 'PROCESSING', label: 'Đang xử lý' },
                { key: 'SHIPPING', label: 'Đang giao' },
                { key: 'DELIVERED', label: 'Hoàn thành' },
                { key: 'CANCELLED', label: 'Đã hủy' }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    statusFilter === f.key
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchMyOrders}
              disabled={myOrdersLoading}
              className="p-2 text-gray-500 hover:text-teal-700 rounded-xl hover:bg-teal-50 transition cursor-pointer shrink-0"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${myOrdersLoading ? 'animate-spin text-teal-700' : ''}`} />
            </button>
          </div>

          {/* Danh sách đơn hàng */}
          {myOrdersLoading ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Đang tải lịch sử đơn hàng của bạn...</p>
            </div>
          ) : filteredMyOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Chưa có đơn hàng nào</h3>
                <p className="text-xs text-gray-500">
                  {statusFilter === 'ALL'
                    ? 'Bạn chưa tạo đơn hàng hoặc yêu cầu báo giá nào tại MediEquip Vietnam.'
                    : 'Không tìm thấy đơn hàng nào ở trạng thái đã chọn.'}
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-800 transition"
              >
                <span>Xem danh mục thiết bị y tế</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMyOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-gray-900">#MD-{ord.id}</span>
                      {getOrderStatusBadge(ord.orderStatus)}
                      {getPaymentStatusBadge(ord.paymentStatus)}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(ord.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {/* Danh sách items rút gọn */}
                  <div className="space-y-2">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <img
                            src={item.productImage || DEFAULT_NO_IMAGE}
                            alt={item.productName}
                            onError={handleImageError}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <span className="font-semibold text-gray-800 truncate">{item.productName}</span>
                          <span className="text-gray-400 font-medium shrink-0">x{item.quantity}</span>
                        </div>
                        <span className="font-bold text-gray-900 shrink-0">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="text-xs">
                      <span className="text-gray-500">Tổng thanh toán: </span>
                      <strong className="text-emerald-700 font-bold text-sm">{formatPrice(ord.totalAmount)}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadExcel(ord.id)}
                        disabled={downloadingId === ord.id}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {downloadingId === ord.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Tải Excel Báo Giá</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTrackId(ord.id);
                          setTrackPhone(ord.recipientPhone || user?.phone || '');
                          setActiveTab('track');
                          setTrackedOrder(ord);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>Xem tiến độ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
