import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ExternalLink, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0 select-none">
      {/* Left: Toggle Button & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer flex items-center justify-center border border-gray-200 hover:border-indigo-200"
          title={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span className="hidden sm:inline">Hệ thống Quản trị</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-indigo-600 font-semibold">Bảng điều khiển</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Backend status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Backend Connected (8080)</span>
        </div>

        {/* View Store button */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
        >
          <span>Xem Cửa hàng</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Admin profile badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              {user?.fullName || user?.username}
            </p>
            <p className="text-[10px] text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
