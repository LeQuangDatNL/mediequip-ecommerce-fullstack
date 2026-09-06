import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';

export const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, totalWishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 bg-white rounded-3xl border border-gray-100 shadow-xs p-8">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
          <Heart className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-gray-900">Danh Sách Yêu Thích Trống</h2>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Bạn chưa lưu thiết bị y tế nào vào danh sách yêu thích. Hãy bấm vào icon trái tim ❤️ trên sản phẩm để lưu lại nhé!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs shadow-md transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khám phá sản phẩm ngay</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-red-500 fill-red-500" />
            <span>Danh Sách Thiết Bị Yêu Thích ({totalWishlistCount})</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Các mặt hàng y tế bạn đã lưu để tham khảo hoặc mua sau.
          </p>
        </div>

        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer self-start sm:self-center"
        >
          Xóa toàn bộ danh sách
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
              <Link to={`/products/${product.id}`} className="block w-full h-full">
                <img
                  src={product.primaryImageUrl || DEFAULT_NO_IMAGE}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                />
              </Link>
              {product.category && (
                <span className="absolute top-3 left-3 bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 pointer-events-none">
                  {product.category.name}
                </span>
              )}

              <button
                type="button"
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md transition hover:bg-red-600 cursor-pointer"
                title="Bỏ khỏi yêu thích"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-gray-100">
              <div className="space-y-1">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-teal-700 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description || 'Thiết bị y tế chất lượng cao đạt chuẩn CO/CQ.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <div>
                  <span className="font-bold text-teal-800 text-xs sm:text-sm block">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(product)}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Thêm vào giỏ"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Mua</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
