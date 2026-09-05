import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl shadow-xs">
          <HelpCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-black text-indigo-600">404</span>
          <h1 className="text-xl font-bold text-gray-900">Trang không tồn tại</h1>
          <p className="text-xs text-gray-500">
            Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ khác.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Quay về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

