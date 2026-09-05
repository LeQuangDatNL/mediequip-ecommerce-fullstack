import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import categoryService from '../services/categoryService';
import {
  ShoppingCart,
  User,
  LogOut,
  Shield,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  Phone,
  Truck,
  FileSpreadsheet,
  PackageCheck,
  Stethoscope,
  Layers,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    categoryService.getAllCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.warn('Lỗi tải danh mục menu:', err));
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm select-none">
      {/* 1. TOP HEADER (LOGO, SEARCH BAR, USER & CART) - Chuẩn phong cách MediEquip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo y tế chữ thập xanh + Tên thương hiệu */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Stethoscope className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight block leading-tight">
                MediEquip Vietnam - Thiết Bị Y Tế Kim Liên
              </span>
              <span className="block text-[11px] text-gray-500 font-medium">
                Sức Khỏe Của Bạn, Sứ Mệnh Của Chúng Tôi
              </span>
            </div>
          </Link>

          {/* Thanh tìm kiếm trung tâm kèm nút kính lúp xanh ngọc */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Tìm kiếm máy đo huyết áp, máy tạo oxy, máy đo đường huyết..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-4 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-teal-600 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition cursor-pointer"
              title="Tìm kiếm"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Khu vực tương tác cá nhân (User, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Yêu thích */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition hidden sm:flex relative"
              title="Danh sách yêu thích"
            >
              <Heart className={`w-5 h-5 ${totalWishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {totalWishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Trạng thái tài khoản */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block max-w-[110px] truncate">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user?.fullName || user?.username}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-[11px] text-gray-500">Đang đăng nhập</p>
                        <p className="text-xs font-bold text-gray-900 truncate mt-0.5">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-700 font-bold hover:bg-amber-50 transition"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          Trang Quản Trị (Admin)
                        </Link>
                      )}

                      <Link
                        to="/consultation"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-teal-700 font-bold hover:bg-teal-50 transition"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                        Gửi File Báo Giá / Tư Vấn
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        Tài khoản của tôi
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                      >
                        <PackageCheck className="w-4 h-4 text-gray-500" />
                        Đơn mua của tôi
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition text-left cursor-pointer border-t border-gray-50 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-lg transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}

            {/* Giỏ hàng (Cart) với Badge đỏ */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-teal-700 hover:bg-teal-50 rounded-full transition relative flex items-center"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            </Link>

            {/* Menu Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 md:hidden rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. THANH MENU ĐIỀU HƯỚNG MÀU XANH TEAL (#13636b) - Theo đúng thiết kế trong ảnh */}
      <nav className="bg-[#13636b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-semibold tracking-wide">
            {/* Các tab điều hướng bên trái */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-md transition ${
                    isActive
                      ? 'bg-white/20 text-white font-bold backdrop-blur-sm'
                      : 'text-gray-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                HOME
              </NavLink>

              {/* Dropdown DANH MỤC SẢN PHẨM */}
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-3.5 py-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-gray-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span>DANH MỤC SẢN PHẨM</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </NavLink>

                {/* Dropdown Content */}
                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-0 w-64 bg-white text-gray-800 rounded-b-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase text-gray-400 border-b border-gray-100">
                      Tất cả danh mục y tế
                    </div>
                    {categories.slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?categoryId=${cat.id}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition"
                      >
                        <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                    <div className="p-2 border-t border-gray-100 text-center">
                      <Link
                        to="/categories"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-[11px] font-bold text-teal-700 hover:underline block"
                      >
                        Xem tất cả danh mục →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab TƯ VẤN & BÁO GIÁ FILE (Tính năng mới) */}
              <NavLink
                to="/consultation"
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3.5 py-1.5 rounded-md transition ${
                    isActive
                      ? 'bg-amber-400 text-gray-950 font-bold'
                      : 'bg-emerald-500/30 text-amber-200 hover:bg-emerald-500/50 hover:text-white font-bold'
                  }`
                }
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                <span>GỬI FILE BÁO GIÁ</span>
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-md transition ${
                    isActive
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-gray-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                SẢN PHẨM
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-md transition ${
                    isActive
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-gray-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                LIÊN HỆ
              </NavLink>
            </div>

            {/* Các badge bên phải thanh Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-[11px]">
              <span className="hidden lg:flex items-center gap-1 text-teal-100">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Giao hàng 2H</span>
              </span>

              <a
                href="tel:19001234"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-amber-300 font-bold transition"
              >
                <Phone className="w-3 h-3 text-amber-300" />
                <span>1900 1234</span>
              </a>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-gray-950 px-2.5 py-1 rounded-full font-bold transition"
                >
                  <Shield className="w-3 h-3 text-indigo-950" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <form onSubmit={handleSearch} className="relative pb-2">
            <input
              type="text"
              placeholder="Tìm sản phẩm y tế..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
            />
            <button type="submit" className="absolute right-2 top-2 p-1 text-teal-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-gray-700"
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-gray-700"
          >
            Danh mục sản phẩm
          </NavLink>
          <NavLink
            to="/consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 rounded-lg"
          >
            📁 Gửi File Báo Giá / Tư Vấn Trực Tuyến
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-gray-700"
          >
            Tất cả sản phẩm
          </NavLink>
          <NavLink
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-gray-700"
          >
            Đơn mua của tôi
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-gray-700"
          >
            Liên hệ
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
