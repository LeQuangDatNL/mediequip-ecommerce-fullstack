import noImageFallback from '../assets/no-image.svg';

export const DEFAULT_NO_IMAGE = noImageFallback || '/no-image.svg';

/**
 * Xử lý khi ảnh bị lỗi (404, đứt mạng, link hỏng) tự động chuyển sang ảnh no-image
 */
export const handleImageError = (e) => {
  if (e?.currentTarget && e.currentTarget.src !== DEFAULT_NO_IMAGE) {
    e.currentTarget.onerror = null; // Tránh loop nếu fallback cũng lỗi
    e.currentTarget.src = DEFAULT_NO_IMAGE;
  }
};

/**
 * Lấy đường dẫn ảnh hợp lệ hoặc trả về ảnh mặc định no-image
 */
export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_NO_IMAGE;
  }
  return url.trim();
};

export default {
  DEFAULT_NO_IMAGE,
  handleImageError,
  getImageUrl,
};