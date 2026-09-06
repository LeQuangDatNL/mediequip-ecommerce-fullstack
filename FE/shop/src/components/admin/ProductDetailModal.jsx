import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import {
  Package,
  X,
  ExternalLink,
  Edit2,
  Calendar,
  Layers,
  Tag,
  Boxes,
  CheckCircle2,
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const ProductDetailModal = ({ isOpen, onClose, productId, initialProduct = null }) => {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      setActiveImageIndex(0);
      productService
        .getProductById(productId)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Lỗi khi tải chi tiết sản phẩm:', err);
          setLoading(false);
        });
    } else if (isOpen && initialProduct) {
      setProduct(initialProduct);
      setActiveImageIndex(0);
    }
  }, [isOpen, productId, initialProduct]);

  if (!isOpen) return null;

  // Lấy danh sách toàn bộ ảnh (Ảnh chính + các ảnh phụ)
  const allImages = [];
  if (product) {
    if (product.primaryImageUrl && product.primaryImageUrl.trim()) {
      allImages.push(product.primaryImageUrl.trim());
    }
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && img.trim() && !allImages.includes(img.trim())) {
          allImages.push(img.trim());
        }
      });
    }
  }

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đang kinh doanh (ACTIVE)</span>
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Hết hàng (OUT OF STOCK)</span>
          </span>
        );
      case 'INACTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Tạm ngừng kinh doanh</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Chi Tiết Sản Phẩm Đầy Đủ</h2>
              <p className="text-xs text-gray-500">Mã sản phẩm: #{product?.id || productId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-140px)]">
          {loading || !product ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500">Đang tải thông tin sản phẩm và hình ảnh...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cột Trái: Thư Viện Ảnh (Ảnh chính + Các ảnh phụ) (5 Cột) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Ảnh xem trước lớn */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 group">
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[activeImageIndex] || allImages[0] || DEFAULT_NO_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 bg-white transition duration-300 group-hover:scale-105"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-slate-50">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                      <span className="text-xs">Chưa có hình ảnh</span>
                    </div>
                  )}

                  {/* Badge số ảnh */}
                  {allImages.length > 0 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-[10px] font-semibold">
                      {activeImageIndex === 0 ? 'Ảnh chính' : `Ảnh phụ #${activeImageIndex}`} ({activeImageIndex + 1}/{allImages.length})
                    </div>
                  )}

                  {/* Nút Previous/Next ảnh */}
                  {allImages.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                        className="pointer-events-auto p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                        className="pointer-events-auto p-1.5 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Danh sách thumbnails tất cả ảnh phụ & ảnh chính */}
                {allImages.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Bộ sưu tập ảnh ({allImages.length} ảnh):</span>
                      <span className="text-[10px] text-indigo-600">Click để chuyển ảnh</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl border-2 shrink-0 transition cursor-pointer bg-white ${
                            activeImageIndex === idx
                              ? 'border-indigo-600 ring-2 ring-indigo-200'
                              : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img || DEFAULT_NO_IMAGE}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] font-bold text-center py-0.5">
                              Chính
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cột Phải: Thông Tin Chi Tiết & Tồn Kho (7 Cột) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Tên & Trạng Thái */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
                      {product.categoryName || product.category?.name || 'Chưa phân loại'}
                    </span>
                    {getStatusBadge(product.status)}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 leading-snug">{product.name}</h1>
                </div>

                {/* Khối Giá & Tồn Kho */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                      Giá niêm yết
                    </span>
                    <p className="text-lg font-bold text-indigo-600">{formatPrice(product.price)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                      Số lượng tồn kho
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">{product.stock || 0}</p>
                      <span className="text-xs text-gray-500">sản phẩm</span>
                    </div>
                  </div>
                </div>

                {/* Thông Số Kỹ Thuật / Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1 shadow-2xs">
                    <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span>Slug URL</span>
                    </span>
                    <p className="font-mono text-gray-700 truncate">{product.slug}</p>
                  </div>

                  <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1 shadow-2xs">
                    <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>Ngày tạo</span>
                    </span>
                    <p className="text-gray-700">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleString('vi-VN')
                        : 'Không rõ'}
                    </p>
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mô tả sản phẩm</span>
                  </span>
                  <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs text-gray-600 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                    {product.description && product.description.trim() ? (
                      product.description
                    ) : (
                      <span className="italic text-gray-400">Chưa có mô tả chi tiết cho sản phẩm này.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            {product && (
              <Link
                to={`/products/${product.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trên Store</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>

            {product && (
              <Link
                to={`/admin/products/update/${product.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa sản phẩm</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

