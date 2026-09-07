import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../../services/productService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import ProductImportModal from '../../../components/admin/ProductImportModal';
import ProductDetailModal from '../../../components/admin/ProductDetailModal';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  PackageX,
  Layers,
  FileSpreadsheet,
  Download,
  RefreshCw,
  Eye,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../../utils/imageHelper';

export const ProductIndex = () => {
  // Quản lý Phân trang & Tìm kiếm có lưu trạng thái trong sessionStorage
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_products_filter', {
    page: 0,
    keyword: '',
  });

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Tải danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(page, keyword);
      if (response && response.content) {
        setProducts(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      toast.error('Không thể tải danh sách sản phẩm từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await productService.exportProductsExcel();
      toast.success('Đã xuất danh sách sản phẩm ra file Excel!');
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      toast.error('Không thể xuất file Excel!');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Nút Thao Tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Danh Sách Hàng Hóa (Product Index)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tổng cộng: <strong className="text-indigo-600">{totalElements}</strong> sản phẩm y tế trong hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút Làm mới */}
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Làm mới</span>
          </button>

          {/* Nút Xuất Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting || products.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Xuất toàn bộ danh sách ra file Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{exporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
          </button>

          {/* Nút Nhập Excel */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Nhập hàng loạt sản phẩm từ file Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>Nhập Excel</span>
          </button>

          {/* Nút Thêm Mới */}
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm</span>
          </Link>
        </div>
      </div>

      {/* Thanh Tìm Kiếm & Lọc */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={keyword}
          onSearch={onSearch}
          placeholder="Tìm kiếm theo tên sản phẩm, danh mục, xuất xứ..."
          className="w-full sm:w-96"
        />

        {keyword && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Kết quả cho từ khóa: <strong>"{keyword}"</strong>
            </span>
            <button
              type="button"
              onClick={reset}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs transition cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bảng Dữ Liệu Sản Phẩm */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <PackageX className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-800">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Thử tìm kiếm với từ khóa khác.' : 'Chưa có sản phẩm nào. Hãy bấm nút "Thêm Sản Phẩm" để tạo mới.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 w-16">ID</th>
                  <th className="px-5 py-3.5">Ảnh</th>
                  <th className="px-5 py-3.5">Tên Sản Phẩm</th>
                  <th className="px-5 py-3.5">Danh Mục</th>
                  <th className="px-5 py-3.5">Xuất Xứ</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition group">
                    <td className="px-5 py-4 font-bold text-indigo-600">#{prod.id}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setIsDetailModalOpen(true);
                        }}
                        className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0 block hover:ring-2 hover:ring-indigo-300 transition cursor-pointer"
                        title="Click để xem chi tiết ảnh và thông tin"
                      >
                        <img
                          src={prod.primaryImageUrl || DEFAULT_NO_IMAGE}
                          alt={prod.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-left font-bold text-gray-900 hover:text-indigo-600 line-clamp-1 max-w-xs transition cursor-pointer"
                        title="Click để xem chi tiết đầy đủ"
                      >
                        {prod.name}
                      </button>
                      <p className="font-mono text-[10px] text-gray-400 truncate max-w-xs">{prod.slug}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-700">
                      {prod.category?.name ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          <Layers className="w-3 h-3" />
                          {prod.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chưa phân loại</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {prod.origin?.name || prod.originName ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200">
                          <Globe className="w-3 h-3 text-teal-600" />
                          {prod.origin?.name || prod.originName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Chưa rõ xuất xứ</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {prod.status === 'ACTIVE' ? 'Đang bán' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Xem chi tiết đầy đủ (Quick View / Modal) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setIsDetailModalOpen(true);
                        }}
                        className="inline-flex p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        title="Xem chi tiết đầy đủ & ảnh phụ (Quick View)"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Chuyển sang Giao diện Sửa (Update) */}
                      <Link
                        to={`/admin/products/update/${prod.id}`}
                        className="inline-flex p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa sản phẩm (Update)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Chuyển sang Giao diện Xóa (Delete) */}
                      <Link
                        to={`/admin/products/delete/${prod.id}`}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa mềm sản phẩm (Delete)"
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

        {/* Phân Trang Reusable Component */}
        <div className="p-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>

      {/* Modal Import Excel */}
      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          fetchProducts();
        }}
      />

      {/* Modal Quick View Chi Tiết Sản Phẩm & Thư Viện Ảnh */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        productId={selectedProductId}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
};

export default ProductIndex;
