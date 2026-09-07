import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import MapAddressPicker from '../../components/MapAddressPicker';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  MapPin,
  Navigation,
  Sparkles,
  User,
  Phone,
  QrCode,
  Banknote,
  Copy,
  Check,
  FileSpreadsheet,
  Headphones
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: user?.fullName || user?.username || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'COD', // 'COD' hoặc 'QR'
    note: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  // Tự động điền thông tin người nhận nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        recipientName: prev.recipientName || user.fullName || user.username || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Tải danh sách địa chỉ đã lưu của khách hàng
  useEffect(() => {
    if (isAuthenticated) {
      addressService.getMyAddresses()
        .then((addrs) => {
          const list = Array.isArray(addrs) ? addrs : [];
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.defaultAddress) || list[0];
          if (defaultAddr) {
            setFormData((prev) => ({
              ...prev,
              recipientName: prev.recipientName || defaultAddr.recipientName,
              phone: prev.phone || defaultAddr.phone,
              address: prev.address || `${defaultAddr.addressDetail}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`,
            }));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSelectSavedAddress = (e) => {
    const selectedId = Number(e.target.value);
    if (!selectedId) return;
    const addr = savedAddresses.find((a) => a.id === selectedId);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        recipientName: addr.recipientName,
        phone: addr.phone,
        address: `${addr.addressDetail}, ${addr.ward}, ${addr.district}, ${addr.province}`,
      }));
      toast.success('Đã áp dụng địa chỉ từ sổ tay!');
    }
  };

  const handleSelectFromMap = (location) => {
    const full = [location.addressDetail, location.ward, location.district, location.province]
      .filter(Boolean)
      .join(', ') || location.fullAddress;

    setFormData((prev) => ({
      ...prev,
      address: full,
    }));
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('0914066662');
    setCopiedBank(true);
    toast.success('Đã sao chép số điện thoại / Zalo thanh toán!');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleDownloadQuotation = async () => {
    if (!createdOrder?.id) return;
    setDownloadingExcel(true);
    try {
      await orderService.downloadQuotation(createdOrder.id);
      toast.success(`Đã tải xuống Bảng báo giá Excel cho Đơn hàng #MD-${createdOrder.id}!`);
    } catch (error) {
      console.error('Lỗi tải bảng báo giá:', error);
      toast.error('Không thể xuất file Excel báo giá. Vui lòng thử lại!');
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        recipientName: formData.recipientName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        addressDetail: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        note: formData.note ? formData.note.trim() : '',
        items: cartItems.map((item) => ({
          productId: Number(item.id || item.productId),
          quantity: Number(item.quantity) || 1,
        })),
      };

      const result = await orderService.createOrder(orderPayload);
      setCreatedOrder(result);
      setOrderSuccess(true);
      clearCart();
      toast.success(`Gửi đơn hàng #MD-${result.id} thành công! Kỹ sư Kim Liên sẽ liên hệ báo giá & xác nhận.`);
    } catch (error) {
      console.error('Lỗi khi gửi đơn hàng:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    const orderId = createdOrder?.id || 'MỚI';
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-6 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <span>Mã đơn hàng: #MD-{orderId}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Gửi Đơn Hàng Thành Công!</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Cảm ơn bạn đã đặt hàng tại <strong>MediEquip Vietnam - Thiết Bị Y Tế Kim Liên</strong>. Đội ngũ Kỹ sư y tế sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> trong 15-30 phút để báo giá chiết khấu ưu đãi và chốt lịch giao hàng.
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-left space-y-2 max-w-lg mx-auto">
          <p className="font-bold text-gray-900 text-sm border-b border-gray-200 pb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-700" />
            <span>Thông tin đơn hàng & nhận thiết bị (#MD-{orderId}):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
            <p>Người nhận: <strong className="text-gray-900">{formData.recipientName}</strong></p>
            <p>Số điện thoại: <strong className="text-gray-900">{formData.phone}</strong></p>
          </div>
          <p className="text-gray-700">Địa chỉ giao: <strong className="text-gray-900">{formData.address}</strong></p>
          <p className="text-gray-700">
            Hình thức: <strong className="text-teal-800">
              {formData.paymentMethod === 'COD'
                ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                : 'Chuyển khoản qua mã QR Ngân Hàng'}
            </strong>
          </p>
          <p className="text-gray-700">
            Tình trạng thanh toán: <strong className="text-amber-700 font-bold">Chưa thanh toán (Chờ xác nhận)</strong>
          </p>
          <p className="text-gray-700">
            Giá thành: <strong className="text-emerald-700 font-black">Báo giá chiết khấu trực tiếp khi gọi xác nhận</strong>
          </p>
        </div>

        {/* Nút Tải File Báo Giá Excel và Xem Theo Dõi Đơn Hàng */}
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 max-w-lg mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="font-bold text-emerald-900 text-xs block">Bảng Báo Giá Thiết Bị Y Tế (.xlsx)</span>
              <span className="text-[11px] text-emerald-700">Tải về file Excel mẫu báo giá chính thức của đơn hàng</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadQuotation}
              disabled={downloadingExcel || !createdOrder?.id}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer shrink-0 disabled:opacity-50"
            >
              {downloadingExcel ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Tải Excel Báo Giá</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Nếu khách hàng chọn chuyển khoản QR thì hiện thông tin QR placeholder */}
        {formData.paymentMethod === 'QR' && (
          <div className="p-5 bg-teal-50/70 rounded-2xl border border-teal-200 max-w-lg mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-full">
              <QrCode className="w-3.5 h-3.5" />
              <span>MÃ QR THANH TOÁN (TẠM THỜI - ĐANG CẬP NHẬT)</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              <div className="w-36 h-36 bg-gray-50 p-3 rounded-2xl border-2 border-dashed border-teal-300 shadow-xs flex flex-col items-center justify-center shrink-0 text-teal-700">
                <QrCode className="w-12 h-12 text-teal-600/70 mb-1 animate-pulse" />
                <span className="text-[11px] font-black text-teal-900">QR THANH TOÁN</span>
                <span className="text-[9px] text-gray-500 font-medium">Đang cập nhật</span>
              </div>

              <div className="text-left text-xs space-y-1.5 flex-1">
                <p className="text-gray-600">Kênh thanh toán: <strong className="text-gray-900">Mã QR / ZaloPay / Chuyển khoản</strong></p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Số ĐT / Zalo: <strong className="text-teal-900 font-mono text-sm">0914 066 662</strong></span>
                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="p-1 text-teal-700 hover:text-teal-900 hover:bg-teal-100 rounded transition cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-gray-600">Chủ tài khoản: <strong className="text-gray-900 uppercase">THIẾT BỊ Y TẾ KIM LIÊN</strong></p>
                <p className="text-[11px] text-gray-500 italic">Nội dung chuyển khoản: <strong className="text-teal-800">THANH TOAN DON {orderId} - {formData.phone}</strong></p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Mã QR thanh toán chính thức sẽ được Kỹ sư Kim Liên gửi trực tiếp qua Zalo khi xác nhận đơn hàng.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={createdOrder ? `/orders?orderId=${createdOrder.id}&phone=${formData.phone}` : '/orders'}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs transition shadow-md flex items-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Theo dõi tiến độ đơn hàng #MD-{orderId}</span>
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition"
          >
            Tiếp tục xem thiết bị khác
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 bg-white rounded-3xl border border-gray-100 shadow-xs p-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-gray-900">Giỏ Hàng Của Bạn Đang Trống</h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Chưa có thiết bị y tế nào trong giỏ hàng. Hãy khám phá kho sản phẩm của Kim Liên Medical ngay!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khám phá sản phẩm ngay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-indigo-600" />
            <span>Giỏ Hàng Của Bạn ({totalCount} sản phẩm)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kiểm tra danh sách mặt hàng y tế và tiến hành thanh toán an toàn.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
        >
          Xóa sạch giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cột Trái (2 Phần): Danh Sách Sản Phẩm */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0">
                    <img
                      src={item.primaryImageUrl || DEFAULT_NO_IMAGE}
                      alt={item.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm max-w-sm">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/70 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        Báo giá ưu đãi theo số lượng
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                      title="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-gray-900">
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                      title="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tiếp tục chọn thêm thiết bị khác</span>
          </Link>
        </div>

        {/* Cột Phải (1 Phần): Tóm Tắt & Đặt Hàng */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-6">
          <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-teal-700" />
            <span>Tóm Tắt Đơn Đặt Hàng</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span>Tổng số lượng đặt:</span>
              <strong className="text-gray-900 font-bold">{totalCount} thiết bị</strong>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Vận chuyển & Bàn giao:</span>
              <span className="text-emerald-600 font-bold">Miễn phí toàn quốc</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Chính sách giá:</span>
              <span className="text-teal-700 font-bold">Chiết khấu trực tiếp theo đơn</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">Tổng tiền dự kiến:</span>
              <span className="font-black text-teal-800 text-sm sm:text-base">Liên hệ báo giá</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 text-[11px] text-teal-900 space-y-1">
            <strong className="block font-bold text-teal-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Lưu ý về giá & chiết khấu:
            </strong>
            <p className="text-teal-800 leading-relaxed font-light">
              Do đặc thù thiết bị y tế có mức giá ưu đãi tùy theo số lượng và cấu hình phụ kiện. Sau khi bạn gửi đơn, đội ngũ Kỹ sư Kim Liên sẽ gọi điện chốt bảng giá tốt nhất và xác nhận lịch giao.
            </p>
          </div>

          {/* Form Thông Tin Nhận Hàng Nhanh */}
          <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Thông Tin Giao Hàng
              </h3>
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                title="Mở bản đồ định vị"
              >
                <Navigation className="w-3 h-3 text-teal-700" />
                <span>Chọn trên Map</span>
              </button>
            </div>

            {/* Chọn từ sổ địa chỉ đã lưu nếu có */}
            {savedAddresses.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Chọn từ sổ địa chỉ của bạn
                </label>
                <select
                  onChange={handleSelectSavedAddress}
                  defaultValue=""
                  className="w-full px-3 py-2 bg-teal-50/50 border border-teal-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none font-medium"
                >
                  <option value="" disabled>-- Chọn địa chỉ đã lưu --</option>
                  {savedAddresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.recipientName} - {a.addressDetail}, {a.district}, {a.province} {a.defaultAddress ? '(Mặc định)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Họ và tên người nhận *
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn An"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Số điện thoại liên hệ *
              </label>
              <input
                type="tel"
                required
                placeholder="Ví dụ: 0914 066 662"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-700">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="text-[10px] text-teal-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Định vị GPS / Map</span>
                </button>
              </div>
              <textarea
                required
                rows="2"
                placeholder="Số nhà, ngõ/phố, phường/xã, quận/huyện..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-700"
              ></textarea>
            </div>

            {/* Lựa chọn phương thức thanh toán */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-gray-700">
                Phương thức thanh toán *
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label
                  className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                    formData.paymentMethod === 'COD'
                      ? 'border-teal-700 bg-teal-50/50 shadow-2xs'
                      : 'border-gray-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 text-teal-700 focus:ring-teal-600"
                  />
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-teal-700" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </strong>
                    <p className="text-[11px] text-gray-500">
                      Nhận hàng, kiểm tra thiết bị & giấy tờ kiểm định CO/CQ đầy đủ rồi mới thanh toán tiền mặt.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                    formData.paymentMethod === 'QR'
                      ? 'border-teal-700 bg-teal-50/50 shadow-2xs'
                      : 'border-gray-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QR"
                    checked={formData.paymentMethod === 'QR'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mt-1 text-teal-700 focus:ring-teal-600"
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>Chuyển khoản qua mã QR Ngân Hàng</span>
                      </strong>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Tiện lợi
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Quét mã QR bằng App Ngân hàng hoặc ví ZaloPay/MoMo sau khi chốt đơn.
                    </p>
                  </div>
                </label>
              </div>

              {/* Khung hiển thị thông tin QR nếu chọn chuyển khoản QR */}
              {formData.paymentMethod === 'QR' && (
                <div className="mt-2 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-2 rounded-xl border border-dashed border-emerald-300 shadow-2xs shrink-0 flex flex-col items-center justify-center text-teal-700">
                      <QrCode className="w-7 h-7 text-emerald-600/80 mb-0.5" />
                      <span className="text-[8px] font-bold text-teal-800">QR Code</span>
                    </div>
                    <div className="text-[11px] space-y-0.5 text-gray-700 flex-1">
                      <p>Kênh: <strong className="text-gray-900">Mã QR Thanh Toán / ZaloPay</strong></p>
                      <div className="flex items-center gap-1.5">
                        <span>Số ĐT / Zalo: <strong className="text-teal-900 font-mono text-xs">0914 066 662</strong></span>
                        <button
                          type="button"
                          onClick={handleCopyBank}
                          className="p-0.5 hover:bg-emerald-200/60 rounded text-teal-800 transition cursor-pointer"
                          title="Sao chép số điện thoại"
                        >
                          {copiedBank ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p>Chủ TK: <strong className="text-gray-900 uppercase text-[10px]">THIẾT BỊ Y TẾ KIM LIÊN</strong></p>
                      <p className="text-[10px] text-gray-500 italic">Mã QR chính thức sẽ được gửi qua Zalo cùng bảng giá chiết khấu.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>GỬI ĐƠN HÀNG & NHẬN BÁO GIÁ NGAY</span>
            </button>
          </form>

          <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-start gap-2.5 text-[11px] text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>MediEquip Vietnam cam kết bàn giao đúng model, đầy đủ CO/CQ và bảo hành chính hãng tận nơi.</span>
          </div>
        </div>
      </div>

      {/* Map Address Picker Modal */}
      <MapAddressPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectAddress={handleSelectFromMap}
      />
    </div>
  );
};

export default CartPage;

