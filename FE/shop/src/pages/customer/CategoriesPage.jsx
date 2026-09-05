import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import { Layers, ArrowRight, ShieldCheck, Sparkles, FolderOpen } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error('Lỗi tải danh mục:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner Danh Mục */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span>PHÂN LOẠI THIẾT BỊ Y TẾ CHÍNH HÃNG</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Danh Mục Thiết Bị Y Tế & Chăm Sóc Sức Khỏe
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 font-light max-w-2xl leading-relaxed">
          Tìm kiếm thiết bị y tế chính hãng dễ dàng theo từng nhóm công năng chuyên biệt phục vụ theo dõi huyết áp, đường huyết, sơ cứu, mẹ & bé và trị liệu.
        </p>
      </div>

      {/* Grid Danh mục */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Đang tải danh mục từ Kim Liên Medical...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400">Chưa có danh mục nào</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?keyword=${encodeURIComponent(category.name)}`}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {category.description || 'Các thiết bị và vật tư y tế đạt chuẩn Bộ Y Tế phục vụ theo dõi và chăm sóc sức khỏe.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                <span>Xem các sản phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

