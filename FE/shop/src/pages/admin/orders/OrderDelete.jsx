import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import orderService from '../../../services/orderService';
import { XCircle, ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Lỗi tải đơn hàng:', error);
        toast.error('Không tìm thấy đơn hàng để hủy!');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderService.cancelOrder(id);
      toast.success(`Đã xóa mềm / hủy đơn hàng #${id} thành công!`);
      navigate('/admin/orders');
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể hủy đơn hàng này!';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Đơn hàng</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <XCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Xác Nhận Hủy / Xóa Mềm Đơn Hàng</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống áp dụng <strong>Xóa Mềm (Soft Delete)</strong>: Đơn hàng sẽ được chuyển sang trạng thái <code>CANCELLED</code> để bảo toàn lịch sử giao dịch và kế toán.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Đang tải thông tin đơn hàng...</p>
          </div>
        ) : order && (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Mã đơn:</span>
              <span className="font-bold text-indigo-600">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Khách hàng:</span>
              <span className="font-bold text-gray-900">{order.recipientName || order.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tổng tiền:</span>
              <span className="font-extrabold text-indigo-600">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Phương thức:</span>
              <span className="font-medium text-gray-700">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Trạng thái hiện tại:</span>
              <span className="font-semibold text-amber-600">{order.orderStatus}</span>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/admin/orders"
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition text-center"
          >
            Quay Lại
          </Link>
          <button
            type="button"
            disabled={cancelling || loading}
            onClick={handleCancel}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {cancelling ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>Xác Nhận Hủy Đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDelete;

