import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import productService from '../../services/productService';
import reviewService from '../../services/reviewService';
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Send,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Award,
  Globe,
  FileSpreadsheet,
  Building2,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prodData = await productService.getProductById(id);
        setProduct(prodData);
        if (prodData.images && prodData.images.length > 0) {
          setSelectedImage(prodData.images[0]);
        } else {
          setSelectedImage(prodData.primaryImageUrl || '');
        }

        // Tải sản phẩm liên quan theo danh mục
        if (prodData.categoryId) {
          productService.getProducts(0, '', prodData.categoryId)
            .then((res) => {
              const list = res.content || (Array.isArray(res) ? res : []);
              setRelatedProducts(list.filter((p) => p.id !== Number(id)).slice(0, 4));
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết sản phẩm:', err);
        toast.error('Không tìm thấy thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Tải danh sách bình luận đánh giá
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewService.getReviews(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Lỗi tải bình luận:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để gửi đánh giá sản phẩm');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success('Đã gửi đánh giá thành công! Cảm ơn bạn đã phản hồi.');
      setReviewComment('');
      setReviewRating(5);
      fetchReviews();
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể gửi đánh giá lúc này';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Đang tải thông tin chi tiết thiết bị...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy thiết bị</h2>
        <p className="text-xs text-gray-500">Mặt hàng này có thể đã tạm ngừng kinh doanh hoặc không tồn tại.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Sản phẩm</span>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const imagesList = product.images && product.images.length > 0
    ? product.images
    : (product.primaryImageUrl ? [product.primaryImageUrl] : []);
  const originName = product.origin?.name || product.originName;
  const originCode = product.origin?.code || product.originCode;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-teal-700 transition">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link to="/products" className="hover:text-teal-700 transition">Sản phẩm y tế</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link to={`/products?categoryId=${product.category.id}`} className="hover:text-teal-700 transition">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">{product.name}</span>
      </nav>

      {/* 1. KHU VỰC CHI TIẾT SẢN PHẨM & BÁO GIÁ */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Cột trái: Gallery nhiều ảnh */}
        <div className="space-y-4">
          {/* Ảnh lớn chính */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-6 flex items-center justify-center group">
            <img
              src={selectedImage || product.primaryImageUrl || DEFAULT_NO_IMAGE}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start pointer-events-none">
              {product.category && (
                <span className="bg-teal-50/95 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 shadow-2xs">
                  {product.category.name}
                </span>
              )}
              {originName && (
                <span className="bg-indigo-50/95 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 shadow-2xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Xuất xứ: {originName} {originCode ? `(${originCode})` : ''}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition cursor-pointer ${
                inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
              }`}
              title={inWishlist ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Dải ảnh thu nhỏ (Thumbnails) */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 p-1.5 shrink-0 transition cursor-pointer ${
                    selectedImage === imgUrl ? 'border-teal-700 shadow-md scale-105' : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  <img
                    src={imgUrl || DEFAULT_NO_IMAGE}
                    alt={`${product.name} ${idx + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin, Báo giá & Nút Thao Tác */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews counter & Origin */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>5.0</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium">{reviews.length} đánh giá từ khách hàng</span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Kiểm định CO/CQ</span>
                </span>
              </div>
            </div>

            {/* Khung Báo Giá */}
            <div className="p-5 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-teal-800 uppercase font-bold block">Hình thức cung cấp:</span>
                  <span className="text-xl sm:text-2xl font-black text-teal-900">
                    Liên hệ nhận bảng báo giá
                  </span>
                </div>
                <span className="px-3 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-lg shadow-2xs">
                  Giao nhanh toàn quốc
                </span>
              </div>
              <p className="text-xs text-teal-700">
                Chiết khấu đặc biệt cho bệnh viện, phòng khám, công ty & đơn hàng dự án số lượng lớn.
              </p>
            </div>

            {/* Thông số xuất xứ & tiêu chuẩn */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Xuất xứ / Quốc gia:</span>
                <span className="font-bold text-gray-800 mt-0.5 block flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  {originName || 'Chính hãng theo lô'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Tình trạng nguồn hàng:</span>
                <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sẵn sàng cung ứng
                </span>
              </div>
            </div>

            {/* Mô tả tóm tắt */}
            <div className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-900 block">Đặc điểm nổi bật:</span>
              <p className="whitespace-pre-wrap">{product.description || 'Thiết bị y tế chính hãng, bảo hành 1 đổi 1 trong 30 ngày.'}</p>
            </div>

            {/* Chọn số lượng */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Số lượng cần báo giá:</span>
                <span className="text-[11px] text-gray-500">
                  (Tối đa 99/lần thêm vào danh sách)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 transition rounded-l-xl cursor-pointer disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={99}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) {
                        setQuantity(1);
                      } else if (val > 99) {
                        setQuantity(99);
                        toast.error('Số lượng tối đa là 99 sản phẩm');
                      } else {
                        setQuantity(val);
                      }
                    }}
                    className="w-14 py-2 text-xs font-black text-gray-900 text-center focus:outline-none border-x border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (quantity < 99) {
                        setQuantity(quantity + 1);
                      } else {
                        toast.error('Số lượng tối đa là 99 sản phẩm');
                      }
                    }}
                    disabled={quantity >= 99}
                    className="p-2.5 text-gray-600 hover:bg-gray-100 transition rounded-r-xl cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-6 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-extrabold rounded-2xl text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm Vào Danh Sách Báo Giá</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-2xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>YÊU CẦU BÁO GIÁ NGAY</span>
              </button>
            </div>

            <Link
              to={`/consultation?product=${encodeURIComponent(product.name)}`}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Bạn cần báo giá dự án lớn cho phòng khám? Bấm vào đây để gửi file Excel →</span>
            </Link>
          </div>

          {/* Cam kết dịch vụ */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Giao hàng nhanh</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Bảo hành 1 đổi 1 (30 ngày)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>100% Chính hãng CO/CQ</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Dược sĩ tư vấn 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KHU VỰC ĐÁNH GIÁ & BÌNH LUẬN CỦA KHÁCH HÀNG (REVIEWS / COMMENTS) */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-teal-700" />
              <span>Đánh Giá & Phản Hồi Khách Hàng ({reviews.length})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Phản hồi thực tế từ những khách hàng đã mua và sử dụng thiết bị này.
            </p>
          </div>

          {/* Rating Summary Box */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-2xl font-black text-amber-600">5.0</span>
            <div className="text-xs">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-gray-500 text-[10px] font-medium">{reviews.length} lượt đánh giá</span>
            </div>
          </div>
        </div>

        {/* Form Viết Đánh Giá Mới */}
        <form onSubmit={handleSubmitReview} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Gửi Đánh Giá Của Bạn Về Sản Phẩm
            </h3>

            {/* Chọn số sao */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-600 mr-2">Đánh giá của bạn:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-gray-300 hover:text-amber-400 transition cursor-pointer"
                  title={`${star} sao`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              rows="3"
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về độ chính xác, độ bền, chất lượng của thiết bị này..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá'}</span>
            </button>
          </div>
        </form>

        {/* Danh Sách Bình Luận Đã Gửi */}
        <div className="space-y-4">
          {loadingReviews ? (
            <p className="text-xs text-gray-400 text-center py-6">Đang tải bình luận...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400 space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs font-medium">Chưa có bình luận nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {rev.userName || 'Khách Hàng'}
                      </span>
                      <div className="flex text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= (rev.rating || 5) ? 'fill-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed pl-10">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Thiết Bị Cùng Danh Mục</h2>
              <p className="text-xs text-gray-500">Các sản phẩm tương tự bạn có thể tham khảo thêm</p>
            </div>
            <Link to={`/products?categoryId=${product.categoryId}`} className="text-xs font-bold text-teal-700 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <div
                key={relProd.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group p-4"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                  <Link to={`/products/${relProd.id}`} className="block w-full h-full p-2">
                    <img
                      src={relProd.primaryImageUrl || DEFAULT_NO_IMAGE}
                      alt={relProd.name}
                      onError={handleImageError}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  {relProd.originName && (
                    <span className="absolute top-2 left-2 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200">
                      {relProd.originName}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Link to={`/products/${relProd.id}`}>
                    <h3 className="font-bold text-gray-900 text-xs line-clamp-2 group-hover:text-teal-700 transition">
                      {relProd.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-teal-800">
                      Liên hệ báo giá
                    </span>
                    <Link
                      to={`/products/${relProd.id}`}
                      className="text-[11px] font-bold text-teal-700 hover:underline"
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
