import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook quản lý Phân trang & Tìm kiếm có lưu trạng thái vào sessionStorage (ss)
 * @param {string} storageKey - Khóa định danh riêng cho từng trang trong sessionStorage (ví dụ: 'customer_products_filter')
 * @param {object} initialValues - Giá trị mặc định { page: 0, keyword: '' }
 */
export const usePaginationSearch = (storageKey = 'common_search_pagination', initialValues = {}) => {
  const defaultPage = initialValues.page ?? 0;
  const defaultKeyword = initialValues.keyword ?? '';

  // Khôi phục giá trị đã lưu trong sessionStorage nếu có
  const getSavedState = () => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          page: parsed.page !== undefined ? Number(parsed.page) : defaultPage,
          keyword: parsed.keyword !== undefined ? parsed.keyword : defaultKeyword,
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc sessionStorage cho key:', storageKey, e);
    }
    return { page: defaultPage, keyword: defaultKeyword };
  };

  const [page, setPage] = useState(() => getSavedState().page);
  const [keyword, setKeyword] = useState(() => getSavedState().keyword);

  // Tự động lưu vào sessionStorage mỗi khi page hoặc keyword thay đổi
  useEffect(() => {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          page,
          keyword,
        })
      );
    } catch (e) {
      console.warn('Lỗi ghi sessionStorage:', e);
    }
  }, [storageKey, page, keyword]);

  // Đổi trang
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Đổi từ khóa tìm kiếm (tự động reset về trang 0)
  const handleSearch = useCallback((newKeyword) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  // Xóa toàn bộ bộ lọc và reset về mặc định
  const handleReset = useCallback(() => {
    setPage(defaultPage);
    setKeyword(defaultKeyword);
    try {
      sessionStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Lỗi xóa sessionStorage:', e);
    }
  }, [defaultPage, defaultKeyword, storageKey]);

  return {
    page,
    setPage: handlePageChange,
    keyword,
    setKeyword,
    onSearch: handleSearch,
    reset: handleReset,
  };
};

export default usePaginationSearch;

