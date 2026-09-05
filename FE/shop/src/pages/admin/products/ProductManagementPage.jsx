import React, { useState, useEffect, useCallback } from 'react';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  CheckCircle2,
  PackageX,
  RotateCcw,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductManagementPage = () => {
  // Quản lý Phân trang & Tìm kiếm có lưu trạng thái trong sessionStorage
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_products_filter', {
    page: 0,
    keyword: '',
  });

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE' | 'EDIT'
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    primaryImageUrl: '',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Tải danh mục phục vụ chọn trong dropdown
  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.warn('Lỗi tải danh mục cho dropdown:', err));
  }, []);

  // Tải danh sách sản phẩm theo phân trang và từ khóa
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

  // Sinh slug thân thiện
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: modalMode === 'CREATE' ? generateSlug(name) : prev.slug,
    }));
  };

  // Mở modal Thêm mới
  const handleOpenCreate = () => {
    setModalMode('CREATE');
    setCurrentId(null);
    setFormData({
      categoryId: categories.length > 0 ? categories[0].id : '',
      name: '',
      slug: '',
      description: '',
      price: '',
      stock: '10',
      primaryImageUrl: '',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  // Mở modal Chỉnh sửa
  const handleOpenEdit = (product) => {
    setModalMode('EDIT');
    setCurrentId(product.id);
    setFormData({
      categoryId: product.category?.id || (categories.length > 0 ? categories[0].id : ''),
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price !== undefined ? product.price : '',
      stock: product.stock !== undefined ? product.stock : '',
      primaryImageUrl: product.primaryImageUrl || '',
      status: product.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  // Submit Form Thêm / Sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.categoryId) {
      toast.error('Vui lòng nhập Tên sản phẩm, Slug và chọn Danh mục!');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      toast.error('Giá bán không được để trống hoặc âm!');
      return;
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      toast.error('Số lượng tồn kho không hợp lệ!');
      return;
    }

    const payload = {
      categoryId: Number(formData.categoryId),
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description?.trim() || null,
      price: Number(formData.price),
      stock: Number(formData.stock),
      primaryImageUrl: formData.primaryImageUrl?.trim() || null,
      status: formData.status || 'ACTIVE',
    };

    setSubmitting(true);
    try {
      if (modalMode === 'CREATE') {
        await productService.createProduct(payload);
        toast.success('Thêm sản phẩm mới thành công!');
      } else {
        await productService.updateProduct(currentId, payload);
        toast.success('Cập nhật thông tin sản phẩm thành công!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa sản phẩm
  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      toast.success(`Đã xóa sản phẩm "${productToDelete.name}" thành công!`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
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
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Quản Lý Sản Phẩm (Hàng Hóa)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tìm kiếm, phân trang, thêm mới và quản lý giá bán, tồn kho các thiết bị y tế.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar with SessionStorage */}
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

      {/* Product Table */}
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
                  <th className="px-5 py-3.5">Giá Bán</th>
                  <th className="px-5 py-3.5">Tồn Kho</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-4 font-bold text-indigo-600">#{prod.id}</td>
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={prod.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 line-clamp-1 max-w-xs">{prod.name}</p>
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
                    <td className="px-5 py-4 font-extrabold text-indigo-600 text-sm">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      <span className={prod.stock === 0 ? 'text-red-500 font-bold' : ''}>
                        {prod.stock}
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
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(prod)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Modal Thêm Mới / Chỉnh Sửa Sản Phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-gray-100 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{modalMode === 'CREATE' ? 'Thêm Sản Phẩm Mới' : 'Cập Nhật Sản Phẩm'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
              {/* Danh Mục */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Danh mục loại hàng <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
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
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Máy đo huyết áp bắp tay Omron HEM-7120"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Giá Bán & Tồn Kho */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="890000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Ảnh Đại Diện */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span>URL Hình ảnh sản phẩm</span>
                </label>
                <input
                  type="url"
                  value={formData.primaryImageUrl}
                  onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Mô Tả */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Thông số kỹ thuật, nguồn gốc xuất xứ, bảo hành..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
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
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  <option value="ACTIVE">Đang bán (ACTIVE)</option>
                  <option value="INACTIVE">Tạm ngừng bán (INACTIVE)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{modalMode === 'CREATE' ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Xác nhận xóa sản phẩm?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bạn có chắc chắn muốn xóa sản phẩm{' '}
                <strong className="text-gray-900">"{productToDelete?.name}"</strong>? Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                {deleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Xóa Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;

