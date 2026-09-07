import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import originService from '../../../services/originService';
import ImageSelectorModal from '../../../components/ImageSelectorModal';
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Image as ImageIcon,
  FolderOpen,
  Loader2,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    originId: '',
    name: '',
    slug: '',
    description: '',
    primaryImageUrl: '',
    images: [],
    status: 'ACTIVE',
  });
  const [tempSubImageUrl, setTempSubImageUrl] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isSubMediaModalOpen, setIsSubMediaModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tải danh mục, xuất xứ và chi tiết sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, origs, prod] = await Promise.all([
          categoryService.getAllCategories(),
          originService.getAllOrigins(),
          productService.getProductById(id),
        ]);
        setCategories(cats || []);
        setOrigins(origs || []);
        setFormData({
          categoryId: prod.category?.id || prod.categoryId || (cats.length > 0 ? cats[0].id : ''),
          originId: prod.origin?.id || prod.originId || '',
          name: prod.name || '',
          slug: prod.slug || '',
          description: prod.description || '',
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

    const payload = {
      categoryId: Number(formData.categoryId),
      originId: formData.originId ? Number(formData.originId) : null,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description?.trim() || null,
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

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
            <p className="text-xs text-gray-500">Cập nhật thông tin chi tiết, xuất xứ và hình ảnh sản phẩm.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chọn Danh Mục & Xuất Xứ (Grid 2 cột) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="" disabled>-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Xuất xứ / Quốc gia sản xuất</span>
              </label>
              <select
                value={formData.originId}
                onChange={(e) => setFormData({ ...formData, originId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
              >
                <option value="">-- Chưa chọn xuất xứ --</option>
                {origins.map((orig) => (
                  <option key={orig.id} value={orig.id}>
                    {orig.name} {orig.code ? `(${orig.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* 1. Ảnh Đại Diện Chính */}
          <div className="space-y-2 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>Ảnh đại diện chính của sản phẩm</span>
              </label>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-indigo-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thư viện Media</span>
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
                    alt="Primary Preview"
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

          {/* 2. Bộ Sưu Tập Ảnh Phụ */}
          <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Bộ sưu tập ảnh phụ ({formData.images.length} ảnh)</span>
                </label>
                <p className="text-[11px] text-gray-500">Các góc chụp khác, chi tiết thông số</p>
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
                placeholder="Dán link ảnh phụ rồi bấm Thêm..."
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Thêm
              </button>
            </div>

            {/* Danh sách ảnh phụ */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-square">
                    <img
                      src={imgUrl}
                      alt={`Sub ${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                      <button
                        type="button"
                        onClick={() => handleSetAsPrimary(imgUrl)}
                        className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-md hover:bg-indigo-700 transition"
                      >
                        Đặt ảnh chính
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubImage(idx)}
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md hover:bg-red-700 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">Chưa có ảnh phụ nào được thêm.</p>
            )}
          </div>

          {/* Mô Tả */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả sản phẩm</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            ></textarea>
          </div>

          {/* Trạng Thái */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái kinh doanh</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
            >
              <option value="ACTIVE">Đang kinh doanh (ACTIVE)</option>
              <option value="INACTIVE">Tạm ẩn khỏi trang chủ (INACTIVE)</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Đang cập nhật...' : 'Cập Nhật Sản Phẩm'}</span>
            </button>

            <Link
              to="/admin/products"
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition text-center"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>

      {/* Modal Chọn Ảnh Chính */}
      <ImageSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(img) => {
          setFormData((prev) => ({ ...prev, primaryImageUrl: img.url }));
        }}
      />

      {/* Modal Chọn Ảnh Phụ */}
      <ImageSelectorModal
        isOpen={isSubMediaModalOpen}
        onClose={() => setIsSubMediaModalOpen(false)}
        onSelect={(img) => {
          handleAddSubImage(img.url);
        }}
      />
    </div>
  );
};

export default ProductUpdate;
