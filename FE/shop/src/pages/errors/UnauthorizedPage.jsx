import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        <div className="inline-flex p-4 bg-red-50 text-red-500 rounded-3xl shadow-xs">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900">Không có quyền truy cập (403)</h1>
          <p className="text-xs text-gray-600 leading-relaxed">
            Tài khoản hiện tại của bạn (<span className="font-semibold text-gray-900">{user?.username}</span> - vai trò{' '}
            <span className="font-semibold text-indigo-600">{user?.role || 'Khách hàng'}</span>) không có quyền truy cập vào khu vực Quản trị viên.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Đổi tài khoản Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

