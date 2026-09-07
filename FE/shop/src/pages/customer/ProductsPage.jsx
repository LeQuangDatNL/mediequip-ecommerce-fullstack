import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import originService from '../../services/originService';
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
  FileSpreadsheet,
  Globe,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlKeyword = searchParams.get('keyword') || '';
  const urlCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;
  const urlOriginId = searchParams.get('originId') ? Number(searchParams.get('originId')) : null;

  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState(urlKeyword);
  const [selectedCategoryId, setSelectedCategoryId] = useState(urlCategoryId);
  const [selectedOriginId, setSelectedOriginId] = useState(urlOriginId);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải danh mục và xuất xứ khi mount
  useEffect(() => {
    Promise.all([
      categoryService.getAllCategories(),
      originService.getAllOrigins()
    ])
      .then(([cats, origs]) => {
        setCategories(cats || []);
        setOrigins(origs || []);
      })
      .catch((err) => console.warn('Lỗi tải danh mục/xuất xứ:', err));
  }, []);

  // Cập nhật khi URL đổi
  useEffect(() => {
    const k = searchParams.get('keyword') || '';
    const c = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;
    const o = searchParams.get('originId') ? Number(searchParams.get('originId')) : null;
    setKeyword(k);
    setSelectedCategoryId(c);
    setSelectedOriginId(o);
  }, [searchParams]);

  // Tải sản phẩm theo page, keyword, categoryId và originId
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(page, keyword, selectedCategoryId, selectedOriginId);
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
  }, [page, keyword, selectedCategoryId, selectedOriginId]);

  const handleSearch = (newKeyword) => {
    setPage(0);
    setKeyword(newKeyword);
    updateSearchParams(newKeyword, selectedCategoryId, selectedOriginId);
  };

  const handleCategorySelect = (catId) => {
    setPage(0);
    setSelectedCategoryId(catId);
    updateSearchParams(keyword, catId, selectedOriginId);
  };

  const handleOriginSelect = (origId) => {
    setPage(0);
    setSelectedOriginId(origId);
    updateSearchParams(keyword, selectedCategoryId, origId);
  };

  const updateSearchParams = (k, c, o) => {
    const params = {};
    if (k && k.trim()) params.keyword = k.trim();
    if (c) params.categoryId = c;
    if (o) params.originId = o;
    setSearchParams(params);
  };

  const handleReset = () => {
    setPage(0);
    setKeyword('');
    setSelectedCategoryId(null);
    setSelectedOriginId(null);
    setSearchParams({});
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const selectedOriginObj = origins.find((o) => o.id === selectedOriginId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner Báo Giá Thiết Bị */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-teal-200 text-xs font-semibold backdrop-blur-md">
            <Package className="w-3.5 h-3.5" />
            <span>Phân Phối Thiết Bị Y Tế & Báo Giá Trực Tiếp</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Danh Mục Thiết Bị Y Tế & Vật Tư
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Hàng chính hãng 100% nhập khẩu từ Nhật Bản, Đức, Mỹ, Thụy Sĩ, Hàn Quốc. Cung cấp hóa đơn VAT, chứng nhận CO/CQ và hỗ trợ gửi bảng báo giá dự án nhanh chóng.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full md:w-auto shrink-0">
          <Link
            to="/consultation"
            className="px-5 py-3 bg-white hover:bg-teal-50 text-teal-900 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-700" />
            <span>Gửi File Yêu Cầu Báo Giá</span>
          </Link>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Bộ Lọc & Tìm Kiếm Thiết Bị</h2>
            <p className="text-xs text-gray-500">Tìm kiếm theo tên sản phẩm, danh mục, xuất xứ quốc gia</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchBar
              value={keyword}
              onSearch={handleSearch}
              placeholder="Nhập tên máy đo, model, thương hiệu..."
              className="w-full md:w-80"
            />
            {(keyword || selectedCategoryId || selectedOriginId) && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
                title="Đặt lại toàn bộ bộ lọc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Wrap */}
        <div className="space-y-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
            <span>Theo nhóm danh mục ({categories.length}):</span>
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
              Tất cả danh mục
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

        {/* Origins Filter Wrap (Xuất xứ / Quốc gia) */}
        {origins.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Theo xuất xứ / Quốc gia ({origins.length}):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOriginSelect(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                  selectedOriginId === null
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tất cả xuất xứ
              </button>
              {origins.map((orig) => (
                <button
                  key={orig.id}
                  type="button"
                  onClick={() => handleOriginSelect(orig.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border cursor-pointer flex items-center gap-1 ${
                    selectedOriginId === orig.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-white'
                  }`}
                >
                  <span>{orig.name}</span>
                  {orig.code && <span className="text-[10px] opacity-75 font-mono">({orig.code})</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thông báo bộ lọc đang áp dụng */}
      {(keyword || selectedCategoryObj || selectedOriginObj) && (
        <div className="flex items-center justify-between bg-teal-50/80 border border-teal-200 px-5 py-3 rounded-xl text-xs text-teal-950 shadow-2xs">
          <span>
            Đang lọc theo:{' '}
            {selectedCategoryObj && (
              <strong className="text-teal-800 font-bold mr-2">
                [Danh mục: {selectedCategoryObj.name}]
              </strong>
            )}
            {selectedOriginObj && (
              <strong className="text-indigo-800 font-bold mr-2">
                [Xuất xứ: {selectedOriginObj.name}]
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
          <p className="text-xs text-gray-500 font-medium">Đang tải danh sách thiết bị y tế...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-gray-200 text-center space-y-4 shadow-xs">
          <PackageX className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm nào phù hợp</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Không có mặt hàng nào khớp với tiêu chí tìm kiếm. Hãy thử chọn xuất xứ khác hoặc xóa bộ lọc.
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
            const originLabel = product.origin?.name || product.originName;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                  <Link to={`/products/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.primaryImageUrl || DEFAULT_NO_IMAGE}
                      onError={handleImageError}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </Link>

                  {/* Badges Top Left: Category & Origin */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
                    {product.category && (
                      <span className="bg-teal-50/95 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 shadow-2xs">
                        {product.category.name}
                      </span>
                    )}
                    {originLabel && (
                      <span className="bg-indigo-50/95 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200 shadow-2xs flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5 text-indigo-600" />
                        <span>{originLabel}</span>
                      </span>
                    )}
                  </div>

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
                      {product.description || 'Thiết bị y tế chính hãng đạt chuẩn kiểm định CO/CQ.'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-medium">Báo giá dự án:</span>
                      <span className="font-bold text-teal-800 text-xs sm:text-sm">
                        Liên hệ báo giá
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                      title="Thêm vào danh sách yêu cầu báo giá"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Chọn báo giá</span>
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
