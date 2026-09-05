import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Component Tìm Kiếm Dùng Chung (Reusable SearchBar)
 * 
 * @param {string} value - Giá trị từ khóa hiện tại (thường truyền từ usePaginationSearch)
 * @param {function} onSearch - Callback khi người dùng nhấn Tìm kiếm hoặc Enter
 * @param {string} placeholder - Đoạn text gợi ý
 * @param {function} onClear - Callback khi bấm nút xóa (X)
 * @param {string} className - Class CSS mở rộng
 */
export const SearchBar = ({
  value = '',
  onSearch,
  placeholder = 'Tìm kiếm theo tên sản phẩm, mã, từ khóa...',
  onClear,
  className = '',
}) => {
  const [localInput, setLocalInput] = useState(value);

  // Đồng bộ lại local state khi prop value từ bên ngoài (ví dụ sessionStorage) thay đổi
  useEffect(() => {
    setLocalInput(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localInput.trim());
    }
  };

  const handleClear = () => {
    setLocalInput('');
    if (onClear) {
      onClear();
    } else if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      {/* Icon kính lúp */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search className="w-4 h-4" />
      </div>

      {/* Input tìm kiếm */}
      <input
        type="text"
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-24 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
      />

      {/* Nút xóa nhanh nếu có text */}
      {localInput && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-16 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          title="Xóa tìm kiếm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Nút submit Tìm */}
      <button
        type="submit"
        className="absolute right-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
      >
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBar;

