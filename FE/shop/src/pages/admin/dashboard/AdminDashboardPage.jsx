import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import userService from '../../../services/userService';
import orderService from '../../../services/orderService';
import imageService from '../../../services/imageService';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Layers,
  Image as ImageIcon,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  PackagePlus,
  Truck,
  Plus,
  UploadCloud,
  FileText,
  Activity,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const { user } = useAuth();

  // Metrics State
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Status Breakdowns
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [shippingOrdersCount, setShippingOrdersCount] = useState(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  // Lists
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, usersRes, ordersRes, imagesRes] = await Promise.all([
        productService.getProducts(0, '').catch(() => ({ content: [], totalElements: 0 })),
        categoryService.getAllCategories().catch(() => []),
        userService.getUsers(0, '').catch(() => ({ content: [], totalElements: 0 })),
        orderService.getOrders(0, '', 'ALL').catch(() => ({ content: [], totalElements: 0 })),
        imageService.getImages(0, 10, '').catch(() => ({ content: [], totalElements: 0 })),
      ]);

      // Products
      const prodList = productsRes.content || (Array.isArray(productsRes) ? productsRes : []);
      const prodCount = productsRes.totalElements !== undefined ? productsRes.totalElements : prodList.length;
      setTotalProducts(prodCount);
      setRecentProducts(prodList.slice(0, 5));
      const outOfStock = prodList.filter((p) => p.stock === 0).length;
      setOutOfStockCount(outOfStock);

      // Categories
      const catList = Array.isArray(categoriesRes) ? categoriesRes : [];
      setTotalCategories(catList.length);

      // Users
      const userList = usersRes.content || (Array.isArray(usersRes) ? usersRes : []);
      const userCount = usersRes.totalElements !== undefined ? usersRes.totalElements : userList.length;
      setTotalUsers(userCount);

      // Orders & Revenue
      const ordList = ordersRes.content || (Array.isArray(ordersRes) ? ordersRes : []);
      const ordCount = ordersRes.totalElements !== undefined ? ordersRes.totalElements : ordList.length;
      setTotalOrders(ordCount);
      setRecentOrders(ordList.slice(0, 5));

      // Calculate Revenue & Order status breakdown
      let revenue = 0;
      let pending = 0;
      let shipping = 0;
      let delivered = 0;

      ordList.forEach((ord) => {
        if (ord.orderStatus === 'PENDING') pending++;
        if (ord.orderStatus === 'SHIPPING' || ord.orderStatus === 'PROCESSING') shipping++;
        if (ord.orderStatus === 'DELIVERED') delivered++;
        if (ord.orderStatus !== 'CANCELLED' && ord.totalAmount) {
          revenue += Number(ord.totalAmount) || 0;
        }
      });

      setTotalRevenue(revenue);
      setPendingOrdersCount(pending);
      setShippingOrdersCount(shipping);
      setDeliveredOrdersCount(delivered);

      // Images
      const imgList = imagesRes.content || (Array.isArray(imagesRes) ? imagesRes : []);
      const imgCount = imagesRes.totalElements !== undefined ? imagesRes.totalElements : imgList.length;
      setTotalImages(imgCount);
    } catch (error) {
      console.error('Lỗi tải dữ liệu Dashboard:', error);
      toast.error('Không thể tải dữ liệu thống kê tổng quan!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Đã xác nhận</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Đang đóng gói</span>;
      case 'SHIPPING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Đang giao</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Thành công</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/15">
              <Shield className="w-3.5 h-3.5" />
              <span>Cổng Quản Trị Hệ Thống (Admin Portal)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Xin chào, {user?.fullName || user?.username || 'Quản trị viên'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-light leading-relaxed">
              Theo dõi tình hình kinh doanh, quản lý kho hàng, thư viện media và điều phối đơn hàng theo thời gian thực.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
            <Link
              to="/admin/products/create"
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Sản Phẩm</span>
            </Link>
            <Link
              to="/admin/images/upload"
              className="px-4 py-2.5 bg-white text-indigo-950 font-bold rounded-xl text-xs hover:bg-indigo-50 shadow-md transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Tải Ảnh Lên</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none rounded-r-3xl"></div>
      </div>

      {/* 2. STATS OVERVIEW CARDS (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Doanh Thu */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Tổng Giá Trị Đơn</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{totalOrders} đơn hàng ghi nhận</span>
            </p>
          </div>
        </div>

        {/* Đơn Hàng */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Quản Lý Đơn Hàng</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{totalOrders} đơn</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{pendingOrdersCount} đơn chờ duyệt</span>
            </p>
          </div>
        </div>

        {/* Sản Phẩm */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Tổng Hàng Hóa</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{totalProducts} mặt hàng</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>{totalCategories} danh mục phân loại</span>
            </p>
          </div>
        </div>

        {/* Khách Hàng */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Khách Hàng / User</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{totalUsers} tài khoản</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Đang hoạt động</span>
            </p>
          </div>
        </div>

        {/* Thư Viện Media */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Thư Viện Media</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-gray-900">{totalImages} tệp ảnh</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
              <FolderOpen className="w-3 h-3" />
              <span>Sẵn sàng tái sử dụng</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: RECENT ORDERS & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Đơn Hàng Mới Nhất */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Đơn Hàng Gần Đây</h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
            >
              <span>Xem tất cả đơn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-400">Đang tải dữ liệu đơn hàng...</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">Chưa có đơn hàng nào được tạo</div>
            ) : (
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Mã Đơn</th>
                    <th className="px-4 py-3">Khách Hàng</th>
                    <th className="px-4 py-3">Tổng Tiền</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-4 py-3 font-bold text-indigo-600">#{ord.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{ord.recipientName || ord.customerName}</p>
                        <p className="text-[10px] text-gray-400">{ord.recipientPhone || ord.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        {getOrderStatusBadge(ord.orderStatus)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/orders/update/${ord.id}`}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition inline-block"
                        >
                          Xem & Xử lý
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right (1 Col): Trạng Thái & Lối Tắt Nhanh */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Trạng Thái Đơn Hàng</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="font-semibold text-amber-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Chờ duyệt xử lý
                </span>
                <span className="font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                  {pendingOrdersCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <span className="font-semibold text-purple-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  Đang giao hàng
                </span>
                <span className="font-black text-purple-700 bg-white px-2.5 py-0.5 rounded-lg border border-purple-200 shadow-2xs">
                  {shippingOrdersCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Giao thành công
                </span>
                <span className="font-black text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                  {deliveredOrdersCount}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100/80 p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Lối Tắt Quản Lý Nhanh
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/admin/products"
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl font-semibold text-gray-700 transition shadow-2xs flex items-center gap-2 group"
              >
                <Package className="w-4 h-4 text-indigo-600 group-hover:text-white" />
                <span>Sản Phẩm</span>
              </Link>
              <Link
                to="/admin/categories"
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl font-semibold text-gray-700 transition shadow-2xs flex items-center gap-2 group"
              >
                <Layers className="w-4 h-4 text-purple-600 group-hover:text-white" />
                <span>Danh Mục</span>
              </Link>
              <Link
                to="/admin/images"
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl font-semibold text-gray-700 transition shadow-2xs flex items-center gap-2 group"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span>Thư Viện Ảnh</span>
              </Link>
              <Link
                to="/admin/users"
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white rounded-xl font-semibold text-gray-700 transition shadow-2xs flex items-center gap-2 group"
              >
                <Users className="w-4 h-4 text-blue-600 group-hover:text-white" />
                <span>Người Dùng</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: RECENT PRODUCTS IN INVENTORY */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Mặt Hàng Mới Quản Lý</h2>
              <p className="text-xs text-gray-400">Danh sách sản phẩm y tế mới nhất trong cơ sở dữ liệu</p>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
          >
            <span>Quản lý kho sản phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Đang tải danh sách sản phẩm...</div>
          ) : recentProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">Chưa có sản phẩm nào</div>
          ) : (
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 w-16">ID</th>
                  <th className="px-5 py-3">Ảnh</th>
                  <th className="px-5 py-3">Tên Sản Phẩm</th>
                  <th className="px-5 py-3">Danh Mục</th>
                  <th className="px-5 py-3">Tồn Kho</th>
                  <th className="px-5 py-3">Trạng Thái</th>
                  <th className="px-5 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-3.5 font-bold text-indigo-600">#{prod.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={prod.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-gray-900 max-w-xs truncate">{prod.name}</p>
                      <p className="font-mono text-[10px] text-gray-400 truncate max-w-xs">{prod.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {prod.category?.name ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                          <Layers className="w-3 h-3" />
                          {prod.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Chưa phân loại</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      <span className={prod.stock === 0 ? 'text-red-500 font-bold' : ''}>
                        {prod.stock} chiếc {prod.stock === 0 && '(Hết hàng)'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {prod.status === 'ACTIVE' ? 'Đang bán' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/admin/products/update/${prod.id}`}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
