import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../../services/bannerService';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  LayoutTemplate
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BannerIndex = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Banners:', err);
      toast.error('Không thể tải danh sách Banners từ máy chủ!');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await bannerService.toggleStatus(id);
      toast.success(`Đã chuyển trạng thái Banner sang ${currentStatus === 'ACTIVE' ? 'TẮT (INACTIVE)' : 'BẬT (ACTIVE)'}!`);
      fetchBanners();
    } catch (err) {
      console.error('Lỗi đổi trạng thái:', err);
      toast.error('Không thể đổi trạng thái banner');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa Banner "${title}" này không?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await bannerService.deleteBanner(id);
      toast.success('Đã xóa Banner thành công!');
      fetchBanners();
    } catch (err) {
      console.error('Lỗi xóa banner:', err);
      toast.error('Không thể xóa banner');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Nút Thêm Mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Quản Lý Hero Banner (Banner Carousel)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tùy biến tiêu đề, ảnh và các nút kêu gọi hành động hiển thị trên Slider trang chủ.
          </p>
        </div>

        <Link
          to="/admin/banners/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner Mới</span>
        </Link>
      </div>

      {/* Danh sách Banners */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs font-bold text-gray-700">
            Tổng cộng: <strong className="text-teal-800">{banners.length}</strong> slide banner
          </span>
          <span className="text-[11px] text-gray-400">
            Sắp xếp theo thứ tự hiển thị tăng dần (Thứ tự nhỏ hơn hiển thị trước)
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500">Đang tải danh sách banner...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-800">Chưa có Hero Banner nào</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Hãy tạo banner đầu tiên để hiển thị trên slider trang chủ của bạn.
            </p>
            <Link
              to="/admin/banners/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Banner Đầu Tiên</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16 text-center">Thứ tự</th>
                  <th className="py-3.5 px-4 w-40">Hình ảnh</th>
                  <th className="py-3.5 px-4">Tiêu đề & Nội dung</th>
                  <th className="py-3.5 px-4 w-48">Nút hành động (CTA)</th>
                  <th className="py-3.5 px-4 w-28 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 w-28 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {banners.map((banner) => {
                  const isActive = banner.status === 'ACTIVE';
                  return (
                    <tr key={banner.id} className="hover:bg-gray-50/80 transition">
                      {/* Thứ tự */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200">
                          {banner.displayOrder}
                        </span>
                      </td>

                      {/* Hình ảnh */}
                      <td className="py-4 px-4">
                        <div className="w-36 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs relative group">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      </td>

                      {/* Tiêu đề & Nội dung */}
                      <td className="py-4 px-4 space-y-1.5">
                        {banner.badgeText && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {banner.badgeText}
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 text-sm whitespace-pre-line leading-tight">
                          {banner.title}
                        </h3>
                        {banner.subtitle && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {banner.subtitle}
                          </p>
                        )}
                      </td>

                      {/* Nút hành động */}
                      <td className="py-4 px-4 space-y-1">
                        {banner.buttonText && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                            <span className="font-semibold text-orange-600">Nút 1:</span>
                            <span className="font-medium bg-orange-50 text-orange-800 px-2 py-0.5 rounded border border-orange-200">
                              {banner.buttonText} ➔ {banner.buttonLink}
                            </span>
                          </div>
                        )}
                        {banner.secondaryButtonText && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                            <span className="font-semibold text-teal-700">Nút 2:</span>
                            <span className="font-medium bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                              {banner.secondaryButtonText} ➔ {banner.secondaryButtonLink}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(banner.id, banner.status)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                          }`}
                          title="Bấm để bật/tắt hiển thị"
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Hiển thị</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-gray-400" />
                              <span>Đã ẩn</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Hành động */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/banners/update/${banner.id}`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Chỉnh sửa Banner"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(banner.id, banner.title)}
                            disabled={deletingId === banner.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                            title="Xóa Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerIndex;

