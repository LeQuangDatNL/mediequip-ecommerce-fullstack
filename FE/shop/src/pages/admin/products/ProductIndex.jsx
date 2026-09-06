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
  Eye
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

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
            Giao diện xem danh sách thiết bị y tế và quản lý giá bán, tồn kho.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 disabled:opacity-50"
            title="Xuất danh sách sản phẩm ra Excel"
          >
            {exporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-slate-500" />
            )}
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer shrink-0"
            title="Nhập hàng loạt sản phẩm bằng file Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Thêm Hàng Loạt (Excel)</span>
          </button>

          <Link
            to="/admin/products/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </Link>
        </div>
      </div>

      {/* Thanh Tìm Kiếm + Thông Tin Tổng Số */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96 flex items-center gap-2">
          <SearchBar
            value={keyword}
            onSearch={onSearch}
            placeholder="Tìm kiếm sản phẩm theo tên..."
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
          Tổng cộng: <strong className="text-gray-900">{totalElements}</strong> sản phẩm
        </div>
      </div>

      {/* Bảng Danh Sách Sản Phẩm */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải sản phẩm từ Backend...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <PackageX className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Thử tìm với từ khóa khác hoặc bấm đặt lại bộ lọc.' : 'Hãy bấm "Thêm Sản Phẩm Mới" để tạo mặt hàng đầu tiên.'}
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
                  <th className="px-5 py-3.5">Tồn Kho</th>
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
                      <span className={prod.stock === 0 ? 'text-red-500 font-bold' : ''}>
                        {prod.stock} chiếc
                      </span>
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
                        title="Xóa sản phẩm (Delete)"
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

      {/* Modal Nhập Sản Phẩm Hàng Loạt Bằng Excel */}
      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchProducts}
      />

      {/* Modal Xem Chi Tiết Sản Phẩm & Bộ Sưu Tập Ảnh Phụ */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
      />
    </div>
  );
};

export default ProductIndex;

