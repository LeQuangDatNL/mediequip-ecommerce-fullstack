import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import {
  Package,
  Layers,
  RotateCcw,
  ShoppingBag,
  Heart,
  Star,
  PackageX,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || '';
  const urlCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;

  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(urlKeyword);
  const [selectedCategoryId, setSelectedCategoryId] = useState(urlCategoryId);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải danh mục khi mount
  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.warn('Lỗi tải danh mục:', err));
  }, []);

  // Cập nhật khi URL đổi
  useEffect(() => {
    const k = searchParams.get('keyword') || '';
    const c = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;
    setKeyword(k);
    setSelectedCategoryId(c);
  }, [searchParams]);

  // Tải sản phẩm theo page, keyword và categoryId
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(page, keyword, selectedCategoryId);
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
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, keyword, selectedCategoryId]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSearch = (newKeyword) => {
    setPage(0);
    setKeyword(newKeyword);
    const params = {};
    if (newKeyword.trim()) params.keyword = newKeyword.trim();
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    setSearchParams(params);
  };

  const handleCategorySelect = (catId) => {
    setPage(0);
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(null);
      const params = {};
      if (keyword) params.keyword = keyword;
      setSearchParams(params);
    } else {
      setSelectedCategoryId(catId);
      const params = {};
      if (keyword) params.keyword = keyword;
      if (catId) params.categoryId = catId;
      setSearchParams(params);
    }
  };

  const handleReset = () => {
    setPage(0);
    setKeyword('');
    setSelectedCategoryId(null);
    setSearchParams({});
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-8">
      {/* Header & Bộ lọc tìm kiếm */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Kho Thiết Bị Y Tế MediEquip Kim Liên
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Khám phá danh mục thiết bị chính hãng đạt chứng nhận kiểm định CO/CQ.
            </p>
          </div>

          {/* SearchBar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchBar
              value={keyword}
              onSearch={handleSearch}
              placeholder="Tìm theo tên máy, model, mã hiệu..."
              className="w-full md:w-80"
            />
            {(keyword || selectedCategoryId) && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Wrap */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
            <span>Lọc theo nhóm danh mục ({categories.length}):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                selectedCategoryId === null
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tất cả ({totalElements})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-teal-400 hover:text-teal-700 hover:bg-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thông báo bộ lọc đang áp dụng */}
      {(keyword || selectedCategoryObj) && (
        <div className="flex items-center justify-between bg-teal-50/80 border border-teal-200 px-5 py-3 rounded-xl text-xs text-teal-950 shadow-2xs">
          <span>
            Đang lọc theo:{' '}
            {selectedCategoryObj && (
              <strong className="text-teal-800 font-bold mr-2">
                [Danh mục: {selectedCategoryObj.name}]
              </strong>
            )}
            {keyword && (
              <span>
                Từ khóa: <strong className="text-teal-800 font-bold">"{keyword}"</strong>
              </span>
            )}{' '}
            ({totalElements} sản phẩm)
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Grid danh sách sản phẩm */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-9 h-9 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Đang tải sản phẩm từ MediEquip Kim Liên...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-gray-200 text-center space-y-4 shadow-xs">
          <PackageX className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm nào phù hợp</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Không có mặt hàng nào khớp với tiêu chí tìm kiếm. Hãy thử tìm từ khóa khác hoặc xóa bộ lọc.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                  <Link to={`/products/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 pointer-events-none">
                      {product.category.name}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition cursor-pointer ${
                      inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                    }`}
                    title="Yêu thích"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-gray-100">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= Math.round(product.rating || 5) ? 'fill-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-teal-700 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                      {product.description || 'Thiết bị y tế chính hãng CO/CQ.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <span className="font-bold text-teal-800 text-xs sm:text-sm">
                      {formatPrice(product.price)}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                      title="Thêm vào giỏ hàng"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Mua</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân Trang Reusable Component */}
      <div className="pt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isZeroIndexed={true}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
