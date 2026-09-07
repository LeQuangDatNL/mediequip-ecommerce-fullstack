import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BarChart3,
  Store,
  LogOut,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State đóng/mở 2 nhóm quản lý
  const [isMainOpen, setIsMainOpen] = useState(() => {
    return localStorage.getItem('admin_main_nav_open') !== 'false';
  });
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(() => {
    return localStorage.getItem('admin_secondary_nav_open') !== 'false';
  });

  const toggleMainSection = () => {
    setIsMainOpen((prev) => {
      const next = !prev;
      localStorage.setItem('admin_main_nav_open', String(next));
      return next;
    });
  };

  const toggleSecondarySection = () => {
    setIsSecondaryOpen((prev) => {
      const next = !prev;
      localStorage.setItem('admin_secondary_nav_open', String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Đã đăng xuất khỏi trang Quản trị!');
    navigate('/login');
  };

  // 1. NHÓM QUẢN LÝ CHÍNH (Theo yêu cầu: Yêu cầu báo giá, Quản lý sản phẩm, Quản lý danh mục, Quản lý đơn hàng)
  const mainNavItems = [
    { to: '/admin/consultations', label: 'Yêu cầu Báo giá & Tư vấn', icon: FileSpreadsheet },
    { to: '/admin/products', label: 'Quản lý Sản phẩm', icon: Package },
    { to: '/admin/categories', label: 'Quản lý Danh mục', icon: Layers },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingBag },
  ];

  // 2. NHÓM QUẢN LÝ PHỤ & HỆ THỐNG (Các mục còn lại)
  const secondaryNavItems = [
    { to: '/admin', end: true, label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
    { to: '/admin/reviews', label: 'Quản lý Bình luận', icon: MessageSquare },
    { to: '/admin/images', label: 'Thư viện Media & Ảnh', icon: ImageIcon },
    { to: '/admin/users', label: 'Quản lý Người dùng', icon: Users },
    { to: '/admin/statistics', label: 'Báo cáo & Thống kê', icon: BarChart3 },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 left-0 bg-gray-900 text-gray-300 flex flex-col shrink-0 z-40 border-r border-gray-800 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between h-16 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            M
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-opacity duration-200">
              <h1 className="font-bold text-white tracking-wide text-sm truncate">MEDIEQUIP ADMIN</h1>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block truncate">
                CỔNG QUẢN TRỊ VIÊN
              </span>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition cursor-pointer hidden md:flex items-center justify-center"
          title={isCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin user brief */}
      <div className={`p-4 border-b border-gray-800/60 bg-gray-800/30 flex items-center shrink-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0"
          title={user?.fullName || user?.username}
        >
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden transition-opacity duration-200">
            <p className="text-xs font-semibold text-white truncate">{user?.fullName || user?.username}</p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-300">
              👑 {user?.role || 'ADMIN'}
            </span>
          </div>
        )}
      </div>

      {/* Nav Menu chia 2 mục Quản lý chính và Quản lý phụ */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-none">
        
        {/* ======================================================== */}
        {/* 1. MỤC QUẢN LÝ CHÍNH */}
        {/* ======================================================== */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggleMainSection}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 hover:bg-gray-800/60 rounded-xl transition cursor-pointer group"
              title="Nhấn để Mở rộng / Thu gọn Quản lý chính"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform shadow-xs shrink-0"></span>
                <span className="truncate">Quản Lý Chính</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-indigo-400 transition-transform duration-200 shrink-0 ${
                  isMainOpen ? 'rotate-0' : '-rotate-90 text-gray-500'
                }`}
              />
            </button>
          ) : (
            <div className="h-px bg-gray-800 my-1 mx-2" title="Quản Lý Chính" />
          )}

          {/* Danh sách các mục Quản lý chính */}
          {(isMainOpen || isCollapsed) && (
            <div className="space-y-1 pt-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl text-xs font-medium transition group ${
                        isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 text-indigo-400 group-hover:text-white" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. MỤC QUẢN LÝ PHỤ & HỆ THỐNG */}
        {/* ======================================================== */}
        <div className="space-y-1 pt-2 border-t border-gray-800/80">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggleSecondarySection}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 rounded-xl transition cursor-pointer group"
              title="Nhấn để Mở rộng / Thu gọn Quản lý phụ"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-gray-500 group-hover:scale-125 transition-transform shrink-0"></span>
                <span className="truncate">Quản Lý Phụ</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
                  isSecondaryOpen ? 'rotate-0' : '-rotate-90 text-gray-600'
                }`}
              />
            </button>
          ) : (
            <div className="h-px bg-gray-800 my-1 mx-2" title="Quản Lý Phụ" />
          )}

          {/* Danh sách các mục Quản lý phụ */}
          {(isSecondaryOpen || isCollapsed) && (
            <div className="space-y-1 pt-0.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl text-xs font-medium transition group ${
                        isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0 group-hover:text-white" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gray-800 space-y-1 shrink-0">
        <Link
          to="/"
          title={isCollapsed ? 'Về trang Cửa hàng' : undefined}
          className={`flex items-center rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'
          }`}
        >
          <Store className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Về trang Cửa hàng</span>}
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? 'Đăng xuất' : undefined}
          className={`w-full flex items-center rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition text-left cursor-pointer ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
