import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import orderService from '../../../services/orderService';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
  Calendar,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderStatus: 'PENDING',
    paymentStatus: 'UNPAID',
    shippingFee: 0,
    discountAmount: 0,
    note: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
        setFormData({
          orderStatus: data.orderStatus || 'PENDING',
          paymentStatus: data.paymentStatus || 'UNPAID',
          shippingFee: data.shippingFee || 0,
          discountAmount: data.discountAmount || 0,
          note: data.note || '',
        });
      } catch (error) {
        console.error('Lỗi tải đơn hàng:', error);
        toast.error('Không tìm thấy đơn hàng yêu cầu!');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await orderService.updateOrderStatus(id, formData);
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      navigate('/admin/orders');
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng!';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Đơn hàng</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Đang tải thông tin đơn hàng...</p>
        </div>
      ) : order && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Chi Tiết Đơn Hàng #{order.id}</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await orderService.downloadQuotation(order.id);
                    toast.success(`Đã xuất Bảng báo giá Excel #MD-${order.id}!`);
                  } catch (err) {
                    toast.error('Không thể xuất file Excel!');
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Xuất Báo Giá Excel</span>
                    <Download className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <Link
                to={`/admin/orders/delete/${order.id}`}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Hủy Đơn (Xóa mềm)</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột 1 & 2: Thông tin giao hàng & Danh sách mặt hàng */}
            <div className="md:col-span-2 space-y-6">
              {/* Thông tin người nhận */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Địa Chỉ Nhận Hàng</span>
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-800">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <strong>{order.recipientName || order.customerName}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{order.recipientPhone || order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{order.fullAddress || 'Chưa có địa chỉ chi tiết'}</span>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm mua */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                  <span>Sản Phẩm Đã Mua ({order.items?.length || 0})</span>
                </h2>
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                          <img
                            src={item.productImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{item.productName}</p>
                          <p className="text-[11px] text-gray-500">Số lượng: x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-indigo-600">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-[10px] text-gray-400">{formatPrice(item.price)} / món</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tóm tắt thanh toán */}
                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Phí vận chuyển:</span>
                    <span>+{formatPrice(order.shippingFee)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Tổng thanh toán:</span>
                    <span className="text-indigo-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột 3: Form Cập Nhật Trạng Thái */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-indigo-600" />
                  <span>Cập Nhật Trạng Thái</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Trạng thái đơn hàng */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Trạng thái đơn hàng
                    </label>
                    <select
                      value={formData.orderStatus}
                      onChange={(e) => setFormData({ ...formData, orderStatus: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="PENDING">Chờ duyệt (PENDING)</option>
                      <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                      <option value="PROCESSING">Đang đóng gói (PROCESSING)</option>
                      <option value="SHIPPING">Đang giao (SHIPPING)</option>
                      <option value="DELIVERED">Đã giao hàng (DELIVERED)</option>
                      <option value="CANCELLED">Hủy đơn (CANCELLED)</option>
                    </select>
                  </div>

                  {/* Trạng thái thanh toán */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Trạng thái thanh toán ({order.paymentMethod})
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
                      <option value="PENDING">Đang xử lý (PENDING)</option>
                      <option value="PAID">Đã thanh toán (PAID)</option>
                      <option value="FAILED">Thất bại (FAILED)</option>
                      <option value="REFUNDED">Hoàn tiền (REFUNDED)</option>
                    </select>
                  </div>

                  {/* Chiết khấu & Phí vận chuyển báo giá */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Chiết khấu (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.discountAmount}
                        onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phí vận chuyển (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.shippingFee}
                        onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ghi chú giao hàng hoặc lý do..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Lưu Cập Nhật Đơn Hàng</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderUpdate;

