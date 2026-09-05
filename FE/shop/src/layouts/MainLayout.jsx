import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactWidget from '../components/FloatingContactWidget';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans relative">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
      {/* Bong bóng chat nổi Zalo, Messenger, Hotline */}
      <FloatingContactWidget />
    </div>
  );
};

export default MainLayout;

