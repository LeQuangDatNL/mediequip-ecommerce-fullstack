import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Routes Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages - Auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Pages - Customer (Thương hiệu MediEquip Vietnam / Thiết Bị Y Tế Kim Liên)
import HomePage from '../pages/customer/HomePage';
import ProductsPage from '../pages/customer/ProductsPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';
import CategoriesPage from '../pages/customer/CategoriesPage';
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import ContactPage from '../pages/customer/ContactPage';
import ConsultationPage from '../pages/customer/ConsultationPage';
import ProfilePage from '../pages/customer/ProfilePage';

// Pages - Admin Dashboard
import AdminDashboardPage from '../pages/admin/dashboard/AdminDashboardPage';

// Pages - Admin Consultations (Quản lý yêu cầu tư vấn & file báo giá)
import ConsultationIndex from '../pages/admin/consultations/ConsultationIndex';

// Pages - Admin Categories (4 Giao diện: Index, Create, Update, Delete)
import CategoryIndex from '../pages/admin/categories/CategoryIndex';
import CategoryCreate from '../pages/admin/categories/CategoryCreate';
import CategoryUpdate from '../pages/admin/categories/CategoryUpdate';
import CategoryDelete from '../pages/admin/categories/CategoryDelete';

// Pages - Admin Products (4 Giao diện: Index, Create, Update, Delete)
import ProductIndex from '../pages/admin/products/ProductIndex';
import ProductCreate from '../pages/admin/products/ProductCreate';
import ProductUpdate from '../pages/admin/products/ProductUpdate';
import ProductDelete from '../pages/admin/products/ProductDelete';

// Pages - Admin Images (Media Gallery: Index, Upload, Delete)
import ImageIndex from '../pages/admin/images/ImageIndex';
import ImageUpload from '../pages/admin/images/ImageUpload';
import ImageDelete from '../pages/admin/images/ImageDelete';

// Pages - Admin Users (4 Giao diện: Index, Create, Update, Delete)
import UserIndex from '../pages/admin/users/UserIndex';
import UserCreate from '../pages/admin/users/UserCreate';
import UserUpdate from '../pages/admin/users/UserUpdate';
import UserDelete from '../pages/admin/users/UserDelete';

// Pages - Admin Orders (4 Giao diện: Index, Create, Update, Delete)
import OrderIndex from '../pages/admin/orders/OrderIndex';
import OrderCreate from '../pages/admin/orders/OrderCreate';
import OrderUpdate from '../pages/admin/orders/OrderUpdate';
import OrderDelete from '../pages/admin/orders/OrderDelete';

// Pages - Errors
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';
import NotFoundPage from '../pages/errors/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Nhóm Khách Hàng (Customer Layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Các route tài khoản khách hàng */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/orders"
            element={
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs max-w-3xl mx-auto space-y-4">
                <h1 className="text-xl font-bold text-gray-900">Đơn Mua Của Tôi</h1>
                <p className="text-xs text-gray-500">Lịch sử đơn hàng bạn đã đặt mua tại Thiết Bị Y Tế Kim Liên.</p>
              </div>
            }
          />
        </Route>
      </Route>

      {/* 2. Nhóm Quản Trị Viên (Admin Layout - Role: ADMIN) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />

          {/* Module: Yêu Cầu Báo Giá & Tư Vấn (File Excel/PDF) */}
          <Route path="consultations" element={<ConsultationIndex />} />

          {/* Module 1: Quản lý Danh mục (4 Giao diện riêng biệt) */}
          <Route path="categories" element={<CategoryIndex />} />
          <Route path="categories/create" element={<CategoryCreate />} />
          <Route path="categories/update/:id" element={<CategoryUpdate />} />
          <Route path="categories/delete/:id" element={<CategoryDelete />} />

          {/* Module 2: Quản lý Sản phẩm (4 Giao diện riêng biệt) */}
          <Route path="products" element={<ProductIndex />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/update/:id" element={<ProductUpdate />} />
          <Route path="products/delete/:id" element={<ProductDelete />} />

          {/* Module 3: Thư viện Media & Ảnh (Media Gallery) */}
          <Route path="images" element={<ImageIndex />} />
          <Route path="images/upload" element={<ImageUpload />} />
          <Route path="images/delete/:id" element={<ImageDelete />} />

          {/* Module 4: Quản lý Người dùng (4 Giao diện riêng biệt) */}
          <Route path="users" element={<UserIndex />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users/update/:id" element={<UserUpdate />} />
          <Route path="users/delete/:id" element={<UserDelete />} />

          {/* Module 5: Quản lý Đơn hàng (4 Giao diện riêng biệt) */}
          <Route path="orders" element={<OrderIndex />} />
          <Route path="orders/create" element={<OrderCreate />} />
          <Route path="orders/update/:id" element={<OrderUpdate />} />
          <Route path="orders/delete/:id" element={<OrderDelete />} />

          {/* Thống kê báo cáo */}
          <Route
            path="statistics"
            element={
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900">Báo cáo & Thống kê Doanh thu</h2>
                <p className="text-xs text-gray-500 mt-1">Biểu đồ doanh số và số lượng giao dịch.</p>
              </div>
            }
          />
        </Route>
      </Route>

      {/* 3. Trang 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
