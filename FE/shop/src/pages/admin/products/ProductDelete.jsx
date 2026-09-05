import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productService from '../../../services/productService';
import { Trash2, ArrowLeft, AlertCircle, EyeOff, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        toast.error('Không tìm thấy sản phẩm để xóa!');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.deleteProduct(id);
      toast.success(`Đã xóa mềm sản phẩm "${product?.name}" (Chuyển sang INACTIVE)!`);
      navigate('/admin/products');
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể xóa sản phẩm này!';
      toast.error(msg);
    } finally {
      setDeleting(false);
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
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Sản phẩm</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <EyeOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Xác Nhận Xóa Mềm Sản Phẩm</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống áp dụng <strong>Xóa Mềm (Soft Delete)</strong>: Sản phẩm sẽ được chuyển sang trạng thái <code>INACTIVE</code> (Ngừng bán) và bảo toàn trọn vẹn lịch sử đơn hàng cũ.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Đang tải thông tin sản phẩm...</p>
          </div>
        ) : product && (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-gray-200 shrink-0">
                <img
                  src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-[11px] text-gray-500">Mã ID: #{product.id}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Danh mục:</span>
                <span className="font-semibold text-gray-800">{product.category?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tồn kho:</span>
                <span className="font-semibold text-gray-800">{product.stock} chiếc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="font-semibold text-emerald-600">{product.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/admin/products"
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition text-center"
          >
            Hủy Bỏ
          </Link>
          <button
            type="button"
            disabled={deleting || loading}
            onClick={handleDelete}
            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {deleting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Xác Nhận Xóa Mềm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDelete;
