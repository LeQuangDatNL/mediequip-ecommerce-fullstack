import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FileSpreadsheet,
  LayoutTemplate,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BarChart3,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Đã đăng xuất khỏi trang Quản trị!');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
    { to: '/admin/banners', label: 'Quản lý Hero Banners', icon: LayoutTemplate },
    { to: '/admin/consultations', label: 'Yêu cầu Báo giá & Tư vấn', icon: FileSpreadsheet },
    { to: '/admin/products', label: 'Quản lý Sản phẩm', icon: Package },
    { to: '/admin/categories', label: 'Quản lý Danh mục', icon: Layers },
    { to: '/admin/images', label: 'Thư viện Media & Ảnh', icon: ImageIcon },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng', icon: ShoppingBag },
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
            S
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-opacity duration-200">
              <h1 className="font-bold text-white tracking-wide text-sm truncate">ADMIN PORTAL</h1>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block truncate">
                E-STORE MANAGER
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
              👑 {user?.role}
            </span>
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
            Chức năng Quản trị
          </div>
        )}
        {navItems.map((item) => {
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
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
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
