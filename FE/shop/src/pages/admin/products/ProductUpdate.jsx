import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import ImageSelectorModal from '../../../components/ImageSelectorModal';
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Image as ImageIcon,
  FolderOpen,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    primaryImageUrl: '',
    images: [],
    status: 'ACTIVE',
  });
  const [tempSubImageUrl, setTempSubImageUrl] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isSubMediaModalOpen, setIsSubMediaModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tải danh mục và chi tiết sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, prod] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getProductById(id),
        ]);
        setCategories(cats || []);
        setFormData({
          categoryId: prod.category?.id || prod.categoryId || (cats.length > 0 ? cats[0].id : ''),
          name: prod.name || '',
          slug: prod.slug || '',
          description: prod.description || '',
          price: prod.price !== undefined && prod.price !== null ? prod.price : '',
          stock: prod.stock !== undefined ? prod.stock : '',
          primaryImageUrl: prod.primaryImageUrl || '',
          images: prod.images || [],
          status: prod.status || 'ACTIVE',
        });
      } catch (error) {
        console.error('Lỗi tải thông tin sản phẩm:', error);
        toast.error('Không tìm thấy sản phẩm yêu cầu!');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleAddSubImage = (url) => {
    const cleanUrl = (url || tempSubImageUrl).trim();
    if (!cleanUrl) return;
    if (formData.images.includes(cleanUrl)) {
      toast.error('Ảnh phụ này đã có trong danh sách!');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, cleanUrl],
    }));
    setTempSubImageUrl('');
  };

  const handleRemoveSubImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSetAsPrimary = (imgUrl) => {
    setFormData((prev) => ({
      ...prev,
      primaryImageUrl: imgUrl,
    }));
    toast.success('Đã đổi làm ảnh chính!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.categoryId) {
      toast.error('Vui lòng nhập Tên sản phẩm, Slug và chọn Danh mục!');
      return;
    }

    const stockNum = Number(formData.stock);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      toast.error('Số lượng tồn kho không hợp lệ (phải >= 0)!');
      return;
    }
    if (stockNum > 100000) {
      toast.error('Số lượng tồn kho không được vượt quá 100,000 sản phẩm (chống spam số lớn)!');
      return;
    }

    let priceNum = null;
    if (formData.price !== '' && formData.price !== null) {
      priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        toast.error('Giá bán không hợp lệ (phải >= 0 VNĐ)!');
        return;
      }
      if (priceNum > 10000000000) {
        toast.error('Giá bán không được vượt quá 10 tỷ VNĐ!');
        return;
      }
    }

    const payload = {
      categoryId: Number(formData.categoryId),
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description?.trim() || null,
      price: priceNum,
      stock: stockNum,
      primaryImageUrl: formData.primaryImageUrl?.trim() || null,
      images: formData.images,
      status: formData.status || 'ACTIVE',
    };

    setSubmitting(true);
    try {
      await productService.updateProduct(id, payload);
      toast.success('Cập nhật sản phẩm thành công!');
      navigate('/admin/products');
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Nút Quay lại */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Sản phẩm</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Edit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Chỉnh Sửa Sản Phẩm (Product Update #{id})</h1>
            <p className="text-xs text-gray-500">Cập nhật thông tin chi tiết và chọn ảnh từ Thư viện.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Chọn Danh Mục */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Danh mục loại hàng <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tên Sản Phẩm */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Máy đo huyết áp bắp tay Omron HEM-7120"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Slug (Đường dẫn tĩnh) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="may-do-huyet-ap-bap-tay-omron-hem-7120"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Giá Bán & Số lượng tồn kho (Chống spam số lớn) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Giá bán niêm yết (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000000000"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ví dụ: 790000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <p className="text-[10px] text-gray-400 mt-1">Để trống nếu muốn hiển thị "Liên hệ báo giá"</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số lượng tồn kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <p className="text-[10px] text-indigo-600 font-medium mt-1">Tối đa 100,000 sản phẩm (chống spam)</p>
              </div>
            </div>

            {/* 1. Ảnh Đại Diện Chính */}
            <div className="space-y-2 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Ảnh đại diện sản phẩm</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-indigo-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Đổi từ Thư viện Media</span>
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={formData.primaryImageUrl}
                  onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                  placeholder="Nhập URL ảnh hoặc chọn từ Thư viện..."
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {formData.primaryImageUrl && (
                <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200 w-fit shadow-2xs">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 border border-gray-200 shrink-0">
                    <img
                      src={formData.primaryImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200';
                      }}
                    />
                  </div>
                  <div className="text-xs">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[10px]">
                      Ảnh chính
                    </span>
                    <p className="text-[10px] text-gray-400 font-mono truncate max-w-xs mt-1">
                      {formData.primaryImageUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Bộ Sưu Tập Ảnh Phụ (Secondary Images) */}
            <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Bộ sưu tập ảnh phụ ({formData.images.length} ảnh)</span>
                  </label>
                  <p className="text-[11px] text-gray-500">Các góc chụp khác, phụ kiện, hộp sản phẩm</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubMediaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-emerald-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chọn từ Media</span>
                </button>
              </div>

              {/* Input thêm URL ảnh phụ */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={tempSubImageUrl}
                  onChange={(e) => setTempSubImageUrl(e.target.value)}
                  placeholder="Dán link ảnh phụ URL vào đây..."
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubImage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSubImage()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 shadow-2xs"
                >
                  + Thêm ảnh
                </button>
              </div>

              {/* Danh sách ảnh phụ đã thêm */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group bg-white p-2 rounded-xl border border-gray-200 shadow-2xs space-y-1.5 text-center"
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 border border-gray-100">
                        <img
                          src={imgUrl}
                          alt={`Sub ${idx}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200';
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSetAsPrimary(imgUrl)}
                          className="text-[9px] px-1.5 py-0.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded font-medium truncate"
                          title="Đặt ảnh này làm ảnh chính"
                        >
                          Làm ảnh chính
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubImage(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          title="Xóa ảnh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mô Tả */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mô tả chi tiết sản phẩm
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Thông số kỹ thuật, hãng sản xuất, chính sách bảo hành..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Trạng Thái */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Trạng thái kinh doanh
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
              >
                <option value="ACTIVE">Đang bán (ACTIVE)</option>
                <option value="INACTIVE">Tạm ngừng bán (INACTIVE)</option>
                <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link
                to="/admin/products"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Modal Chọn Ảnh Chính Media Gallery */}
      <ImageSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={(url) => setFormData((prev) => ({ ...prev, primaryImageUrl: url }))}
        currentImageUrl={formData.primaryImageUrl}
      />

      {/* Modal Chọn Ảnh Phụ Media Gallery */}
      <ImageSelectorModal
        isOpen={isSubMediaModalOpen}
        onClose={() => setIsSubMediaModalOpen(false)}
        onSelectImage={(url) => handleAddSubImage(url)}
      />
    </div>
  );
};

export default ProductUpdate;
