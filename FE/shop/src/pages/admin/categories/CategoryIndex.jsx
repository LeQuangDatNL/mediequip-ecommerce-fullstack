import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../../services/categoryService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Layers3
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CategoryIndex = () => {
  // Quản lý Phân trang & Tìm kiếm có lưu trạng thái trong sessionStorage
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_categories_filter', {
    page: 0,
    keyword: '',
  });

  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Tải danh sách danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategories(page, keyword);
      if (response && response.content) {
        setCategories(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setCategories(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setCategories([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      toast.error('Không thể tải danh sách danh mục từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="space-y-6">
      {/* Header & Nút Thêm Mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Danh Sách Danh Mục (Category Index)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Giao diện xem danh sách các loại hàng hóa y tế trong hệ thống.
          </p>
        </div>

        <Link
          to="/admin/categories/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới (Create)</span>
        </Link>
      </div>

      {/* Thanh Tìm Kiếm + Thông Tin Tổng Số */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96 flex items-center gap-2">
          <SearchBar
            value={keyword}
            onSearch={onSearch}
            placeholder="Tìm kiếm danh mục theo tên..."
            className="w-full"
          />
          {keyword && (
            <button
              type="button"
              onClick={reset}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
              title="Đặt lại tìm kiếm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium self-end md:self-center">
          Tổng cộng: <strong className="text-gray-900">{totalElements}</strong> danh mục
        </div>
      </div>

      {/* Bảng Danh Sách Danh Mục */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải danh mục từ Backend...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Layers3 className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Không tìm thấy danh mục nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Thử tìm với từ khóa khác hoặc bấm đặt lại bộ lọc.' : 'Hãy bấm "Thêm Danh Mục Mới" để tạo danh mục đầu tiên.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 w-16">ID</th>
                  <th className="px-6 py-3.5">Tên Danh Mục</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Mô Tả</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-bold text-indigo-600">#{cat.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                      {cat.description || <span className="text-gray-300 italic">Chưa có mô tả</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          cat.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {cat.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {/* Chuyển sang Giao diện Sửa (Update) */}
                      <Link
                        to={`/admin/categories/update/${cat.id}`}
                        className="inline-flex p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa danh mục (Update)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Chuyển sang Giao diện Xóa (Delete) */}
                      <Link
                        to={`/admin/categories/delete/${cat.id}`}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa danh mục (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân Trang << < 1 2 3 ... n > >> */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryIndex;

