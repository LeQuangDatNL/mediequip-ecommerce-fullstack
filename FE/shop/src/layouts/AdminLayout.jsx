import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar cố định dính bên trái (Sticky + Independent scroll) */}
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Vùng nội dung chính bên phải (Độc lập cuộn) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <AdminHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
