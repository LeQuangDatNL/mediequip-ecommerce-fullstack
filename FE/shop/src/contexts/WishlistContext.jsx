import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kimlien_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kimlien_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Lỗi lưu danh sách yêu thích:', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.success(`Đã bỏ "${product.name}" khỏi danh sách yêu thích`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success(`Đã thêm "${product.name}" vào danh sách yêu thích! ❤️`);
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const item = prev.find((p) => p.id === productId);
      if (item) {
        toast.success(`Đã xóa "${item.name}" khỏi danh sách yêu thích`);
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('kimlien_wishlist');
  };

  const totalWishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist phải được sử dụng bên trong WishlistProvider');
  }
  return context;
};

export default WishlistContext;

