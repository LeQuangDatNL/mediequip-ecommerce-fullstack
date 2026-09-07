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
  CheckCircle2,
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đang kinh doanh (ACTIVE)</span>
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Chi Tiết Sản Phẩm {product ? `#${product.id}` : ''}
              </h2>
              <p className="text-[11px] text-gray-500">Xem đầy đủ hình ảnh, xuất xứ và thông số kỹ thuật</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading || !product ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột Trái: Gallery Hình Ảnh */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group shadow-inner">
                  {allImages.length > 0 ? (
                    <img
                      src={allImages[activeImageIndex] || DEFAULT_NO_IMAGE}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
                      <p className="text-xs">Chưa có hình ảnh sản phẩm</p>
                    </div>
                  )}

                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? allImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === allImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Ảnh tiếp theo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white rounded-full text-[10px] font-semibold backdrop-blur-xs pointer-events-none">
                        {activeImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails list */}
                {allImages.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-indigo-600 ring-2 ring-indigo-200'
                            : 'border-slate-200 hover:border-indigo-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumb ${idx}`}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột Phải: Thông Tin Chi Tiết Sản Phẩm */}
              <div className="space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(product.status)}
                      {product.origin && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full text-xs font-semibold">
                          <Globe className="w-3.5 h-3.5 text-teal-600" />
                          <span>Xuất xứ: {product.origin.name} {product.origin.code ? `(${product.origin.code})` : ''}</span>
                        </span>
                      )}
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{product.slug}</span>
                    </div>
                  </div>

                  {/* Thông tin báo giá */}
                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl">
                    <span className="text-[11px] font-bold text-teal-800 block">Hình thức cung cấp:</span>
                    <span className="text-base font-bold text-teal-900 mt-1 block">
                      Liên hệ báo giá theo dự án & số lượng
                    </span>
                    <p className="text-[11px] text-teal-700 mt-1">
                      Hỗ trợ xuất hóa đơn VAT, chứng nhận xuất xứ CO/CQ và bảo hành chính hãng.
                    </p>
                  </div>

                  {/* Thuộc tính Danh Mục & Ngày Tạo */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <span className="text-gray-400 flex items-center gap-1 font-medium">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Danh mục:</span>
                      </span>
                      <p className="font-semibold text-gray-800">
                        {product.category?.name || product.categoryName || 'Chưa phân loại'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Ngày tạo:</span>
                      </span>
                      <p className="font-semibold text-gray-800">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                      </p>
                    </div>
                  </div>

                  {/* Mô Tả */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Mô tả & Thông số:
                    </h3>
                    <div className="p-4 bg-white border border-gray-200 rounded-2xl text-xs text-gray-600 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                      {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <a
                    href={`/products/${product.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Xem trên trang khách hàng</span>
                  </a>

                  <Link
                    to={`/admin/products/update/${product.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa sản phẩm</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
