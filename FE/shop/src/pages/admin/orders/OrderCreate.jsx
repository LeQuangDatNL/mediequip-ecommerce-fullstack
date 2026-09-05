import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Info } from 'lucide-react';

export const OrderCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Đơn hàng</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Tạo Đơn Hàng Mới (Order Create)</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Tính năng tạo đơn hàng bán trực tiếp tại quầy hoặc qua hotline dành cho Quản trị viên.
          </p>
        </div>

        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-700 flex items-center gap-2 text-left">
          <Info className="w-5 h-5 shrink-0" />
          <span>Khách hàng có thể đặt hàng trực tiếp ngoài trang chủ hoặc Admin có thể quản lý các đơn hàng hiện có.</span>
        </div>

        <div className="pt-4">
          <Link
            to="/admin/orders"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Danh Sách Đơn Hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;

