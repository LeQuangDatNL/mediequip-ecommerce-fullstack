import React from 'react';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
} from 'lucide-react';

/**
 * Component Phân Trang Dùng Chung (Reusable Pagination)
 * Định dạng: << < 1 2 3 ... n-2 n-1 n > >>
 * 
 * @param {number} currentPage - Trang hiện tại (0-indexed theo chuẩn Spring Boot: 0, 1, 2...)
 * @param {number} totalPages - Tổng số trang (n)
 * @param {function} onPageChange - Callback khi click chuyển trang (trả về số trang 0-indexed)
 * @param {boolean} isZeroIndexed - Mặc định true (0-indexed cho Spring Boot: 0 -> totalPages-1)
 */
export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  isZeroIndexed = true,
}) => {
  if (totalPages <= 1) return null;

  // Quy đổi về 1-indexed để tính toán và hiển thị giao diện trực quan
  const current = isZeroIndexed ? currentPage + 1 : currentPage;
  const total = totalPages;

  const handleSelectPage = (targetPage1Indexed) => {
    if (targetPage1Indexed < 1 || targetPage1Indexed > total || targetPage1Indexed === current) {
      return;
    }
    const result = isZeroIndexed ? targetPage1Indexed - 1 : targetPage1Indexed;
    if (onPageChange) {
      onPageChange(result);
    }
  };

  // Thuật toán tạo danh sách nút phân trang thông minh kèm dấu "..."
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Số trang lân cận xung quanh current page

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    const left = current - delta;
    const right = current + delta;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pageItems = getPageNumbers();
  const isFirst = current === 1;
  const isLast = current === total;

  return (
    <div className="flex items-center justify-center gap-1.5 py-4 select-none">
      {/* Nút Về Trang Đầu: << */}
      <button
        type="button"
        onClick={() => handleSelectPage(1)}
        disabled={isFirst}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-semibold transition ${
          isFirst
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs cursor-pointer'
        }`}
        title="Trang đầu (<<)"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Nút Lùi 1 Trang: < */}
      <button
        type="button"
        onClick={() => handleSelectPage(current - 1)}
        disabled={isFirst}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-semibold transition ${
          isFirst
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs cursor-pointer'
        }`}
        title="Trang trước (<)"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Danh sách các số trang: 1 2 3 ... n-1 n */}
      <div className="flex items-center gap-1">
        {pageItems.map((item, idx) => {
          if (item === '...') {
            return (
              <span
                key={`dots-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-xs font-bold text-gray-400 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = item === current;

          return (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => handleSelectPage(item)}
              className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border border-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Nút Tiến 1 Trang: > */}
      <button
        type="button"
        onClick={() => handleSelectPage(current + 1)}
        disabled={isLast}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-semibold transition ${
          isLast
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs cursor-pointer'
        }`}
        title="Trang sau (>)"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Nút Đến Trang Cuối: >> */}
      <button
        type="button"
        onClick={() => handleSelectPage(total)}
        disabled={isLast}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xs font-semibold transition ${
          isLast
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs cursor-pointer'
        }`}
        title="Trang cuối (>>)"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;

