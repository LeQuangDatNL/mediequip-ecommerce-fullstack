import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import categoryService from '../../../services/categoryService';
import { Layers, ArrowLeft, CheckCircle2, Edit2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tải chi tiết danh mục theo ID
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getCategoryById(id);
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          status: data.status || 'ACTIVE',
        });
      } catch (error) {
        console.error('Lỗi khi tải chi tiết danh mục:', error);
        toast.error('Không tìm thấy danh mục yêu cầu!');
        navigate('/admin/categories');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Vui lòng nhập Tên danh mục và Slug!');
      return;
    }

    setSubmitting(true);
    try {
      await categoryService.updateCategory(id, formData);
      toast.success('Cập nhật danh mục thành công!');
      navigate('/admin/categories');
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục!';
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
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Edit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Chỉnh Sửa Danh Mục (Category Update #{id})</h1>
            <p className="text-xs text-gray-500">Cập nhật thông tin chi tiết danh mục trong cơ sở dữ liệu.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải thông tin danh mục...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên Danh Mục */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Thiết bị theo dõi nhịp tim"
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
                placeholder="thiet-bi-theo-doi-nhip-tim"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Mô Tả */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mô tả danh mục
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả thông tin chi tiết về danh mục..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Trạng Thái */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Trạng thái hoạt động
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
              >
                <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                <option value="INACTIVE">Tạm ẩn (INACTIVE)</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <Link
                to="/admin/categories"
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
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CategoryUpdate;

