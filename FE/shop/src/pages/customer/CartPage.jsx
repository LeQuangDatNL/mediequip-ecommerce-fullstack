import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import addressService from '../../services/addressService';
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
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalCount, totalAmount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'COD',
    note: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!');
      return;
    }

    setOrderSuccess(true);
    clearCart();
    toast.success('Đặt hàng thành công! Đội ngũ Kim Liên Medical sẽ liên hệ xác nhận.');
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Đặt Hàng Thành Công!</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Cảm ơn bạn đã tin tưởng <strong>Thiết Bị Y Tế Kim Liên</strong>. Đơn hàng của bạn đã được ghi nhận vào hệ thống và đang được xử lý giao hỏa tốc.
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-left space-y-1.5 max-w-md mx-auto">
          <p className="font-bold text-gray-800">Thông tin nhận hàng:</p>
          <p>Người nhận: <span className="font-semibold text-gray-900">{formData.recipientName}</span></p>
          <p>Số điện thoại: <span className="font-semibold text-gray-900">{formData.phone}</span></p>
          <p>Địa chỉ: <span className="font-semibold text-gray-900">{formData.address}</span></p>
          <p>Hình thức: <span className="font-semibold text-indigo-600">{formData.paymentMethod === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Thanh toán VNPay QR'}</span></p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/products"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition shadow-md"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/orders"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs transition"
          >
            Xem đơn hàng của tôi
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
                      src={item.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm max-w-sm">{item.name}</h3>
                    <p className="text-xs font-black text-indigo-700 mt-1">
                      {formatPrice(item.price)}
                    </p>
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
          <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-gray-500">
              <span>Tổng số lượng:</span>
              <strong className="text-gray-900 font-bold">{totalCount} sản phẩm</strong>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-600 font-bold">Miễn phí (Hỏa tốc 2H)</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>Tạm tính:</span>
              <strong className="text-gray-900 font-bold">{formatPrice(totalAmount)}</strong>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">Tổng thanh toán:</span>
              <span className="font-black text-teal-800 text-lg">{formatPrice(totalAmount)}</span>
            </div>
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
                placeholder="Ví dụ: 0901000003"
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

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Phương thức thanh toán
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-700 font-medium"
              >
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="VNPAY">Thanh toán trực tuyến VNPay QR</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-2xl text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Đặt Hàng Ngay</span>
            </button>
          </form>

          <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-start gap-2.5 text-[11px] text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>Thiết Bị Y Tế Kim Liên cam kết kiểm tra hàng trước khi thanh toán & bảo hành 1 đổi 1.</span>
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

