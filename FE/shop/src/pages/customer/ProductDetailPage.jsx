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
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

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

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
      toast.error('Vui lòng đăng nhập tài khoản để gửi bình luận đánh giá!');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá của bạn!');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.submitReview(id, {
        userId: user.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success('Gửi đánh giá thành công! Cảm ơn ý kiến đóng góp của bạn. ⭐');
      setReviewComment('');
      setReviewRating(5);
      fetchReviews();
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err);
      toast.error('Không thể gửi đánh giá: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-medium">Đang tải thông tin chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-gray-200 p-8 max-w-xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-gray-400">Sản phẩm này có thể đã ngừng kinh doanh hoặc không tồn tại.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách sản phẩm</span>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-teal-700 transition">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/products" className="hover:text-teal-700 transition">Sản phẩm</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-teal-700 transition">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 1. KHU VỰC CHI TIẾT SẢN PHẨM & GALLERY NHIỀU ẢNH */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Cột trái: Gallery nhiều ảnh */}
        <div className="space-y-4">
          {/* Ảnh lớn chính */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-6 flex items-center justify-center group">
            <img
              src={selectedImage || product.primaryImageUrl}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
            />
            {product.category && (
              <span className="absolute top-4 left-4 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 shadow-2xs">
                {product.category.name}
              </span>
            )}

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
                  <img src={imgUrl} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Thông tin, Giá & Nút Thao Tác */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews counter */}
              <div className="flex items-center gap-3 text-xs">
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

            {/* Khung giá */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-teal-800 uppercase font-bold block">Giá phân phối chính hãng:</span>
                <span className="text-2xl sm:text-3xl font-black text-teal-800">
                  {formatPrice(product.price)}
                </span>
              </div>
              <span className="px-3 py-1 bg-teal-700 text-white text-[11px] font-bold rounded-lg shadow-2xs">
                Miễn phí giao hỏa tốc 2H
              </span>
            </div>

            {/* Mô tả tóm tắt */}
            <div className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-900 block">Đặc điểm nổi bật:</span>
              <p className="whitespace-pre-wrap">{product.description || 'Thiết bị y tế chính hãng, bảo hành 1 đổi 1 trong 30 ngày.'}</p>
            </div>

            {/* Chọn số lượng */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Số lượng đặt mua:</span>
                <span className="text-[11px] text-gray-500">
                  (Còn {product.stock || 0} sản phẩm trong kho • Tối đa 99/lần đặt)
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
                    max={Math.min(product.stock || 99, 99)}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      const maxLimit = Math.min(product.stock || 99, 99);
                      if (isNaN(val) || val < 1) {
                        setQuantity(1);
                      } else if (val > maxLimit) {
                        setQuantity(maxLimit);
                        toast.error(`Số lượng tối đa có thể đặt mua là ${maxLimit} sản phẩm`);
                      } else {
                        setQuantity(val);
                      }
                    }}
                    className="w-14 py-2 text-xs font-black text-gray-900 text-center focus:outline-none border-x border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const maxLimit = Math.min(product.stock || 99, 99);
                      if (quantity < maxLimit) {
                        setQuantity(quantity + 1);
                      } else {
                        toast.error(`Số lượng tối đa có thể đặt mua là ${maxLimit} sản phẩm`);
                      }
                    }}
                    disabled={quantity >= Math.min(product.stock || 99, 99)}
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
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-6 bg-[#ff5722] hover:bg-[#f4511e] text-white font-black rounded-2xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                <span>MUA NGAY (GIAO 2H)</span>
              </button>
            </div>

            <Link
              to="/consultation"
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Bạn cần mua số lượng lớn cho phòng khám? Gửi file yêu cầu báo giá sỉ →</span>
            </Link>
          </div>

          {/* Cam kết dịch vụ */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Giao hàng hỏa tốc 2H</span>
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
              <span>Đánh Giá & Bình Luận Khách Hàng ({reviews.length})</span>
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
              required
              rows="3"
              placeholder="Chia sẻ cảm nhận của bạn về độ chính xác, độ bền hoặc trải nghiệm sử dụng thiết bị..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              {isAuthenticated ? `Đang đánh giá với tên: ${user?.fullName || user?.username}` : 'Vui lòng đăng nhập để gửi bình luận'}
            </span>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}</span>
            </button>
          </div>
        </form>

        {/* Danh sách bình luận đã có */}
        <div className="space-y-4">
          {loadingReviews ? (
            <div className="py-8 text-center text-xs text-gray-400">Đang tải bình luận...</div>
          ) : reviews.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{rev.userName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã mua hàng chính hãng</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed pl-10">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SẢN PHẨM CÙNG DANH MỤC */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Sản Phẩm Cùng Danh Mục
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between group p-4"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                  <img
                    src={p.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-teal-700 transition">
                    {p.name}
                  </h3>
                  <span className="font-bold text-teal-800 text-xs sm:text-sm block">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

