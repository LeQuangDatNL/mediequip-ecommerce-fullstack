import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import consultationService from '../../services/consultationService';
import bannerService from '../../services/bannerService';
import HeroBannerImg from '../../assets/HeroBanner.jpg';
import {
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Shield,
  Layers,
  PhoneCall,
  CheckCircle2,
  Heart,
  Star,
  Zap,
  Award,
  Activity,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  X,
  Send,
  Clock,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // State cho Form Gửi File Báo Giá / Tư Vấn Trực Tuyến
  const [consultForm, setConsultForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittingConsult, setSubmittingConsult] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Tự động điền thông tin nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setConsultForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || user.username || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Bộ đếm chống spam
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Tự động chuyển Banner Slide mỗi 5 giây
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [cats, prods, activeBanners] = await Promise.all([
          categoryService.getAllCategories().catch(() => []),
          productService.getProducts(0, '').catch(() => ({ content: [] })),
          bannerService.getActiveBanners().catch(() => []),
        ]);

        const catList = Array.isArray(cats) ? cats : [];
        setCategories(catList.slice(0, 8));

        const prodList = prods.content || (Array.isArray(prods) ? prods : []);
        setBestSellers(prodList.slice(0, 8));

        const bannerList = Array.isArray(activeBanners) ? activeBanners : [];
        setBanners(bannerList);
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Liên hệ báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error('Dung lượng file tối đa là 25MB!');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleResetForm = () => {
    setConsultForm({
      fullName: isAuthenticated ? (user?.fullName || user?.username || '') : '',
      phone: isAuthenticated ? (user?.phone || '') : '',
      email: isAuthenticated ? (user?.email || '') : '',
      title: '',
      content: '',
    });
    setSelectedFile(null);
  };

  const handleSubmitConsultation = async (e) => {
    e.preventDefault();
    if (cooldown > 0) {
      toast.error(`Vui lòng chờ ${cooldown} giây trước khi gửi yêu cầu tiếp theo!`);
      return;
    }
    if (!consultForm.fullName.trim() || !consultForm.phone.trim() || !consultForm.title.trim() || !consultForm.content.trim()) {
      toast.error('Vui lòng điền đầy đủ họ tên, số điện thoại, tiêu đề và nội dung yêu cầu!');
      return;
    }

    setSubmittingConsult(true);
    try {
      const formData = new FormData();
      formData.append('fullName', consultForm.fullName.trim());
      formData.append('phone', consultForm.phone.trim());
      formData.append('email', consultForm.email.trim());
      formData.append('title', consultForm.title.trim());
      formData.append('content', consultForm.content.trim());
      if (user?.id) {
        formData.append('userId', user.id);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await consultationService.submitConsultation(formData);
      toast.success('Gửi yêu cầu báo giá / tư vấn thành công! Hệ thống đã ghi nhận và gửi email xác nhận.');
      handleResetForm();
      setCooldown(30); // Đặt thời gian chống spam 30 giây
    } catch (err) {
      console.error('Lỗi gửi tư vấn:', err);
      toast.error('Không thể gửi yêu cầu: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingConsult(false);
    }
  };

  // Icon biểu tượng danh mục theo phong cách MediEquip
  const categoryIcons = [
    '🩺', '💨', '🩸', '🦽', '💆', '😷', '🦷', '🍼', '🌿', '🩹'
  ];

  return (
    <div className="space-y-16">
      {/* 1. HERO BANNER CAROUSEL - Dynamic Banners & MediEquip Fallback */}
      {(() => {
        const hasBanners = banners && banners.length > 0;
        const currentBanner = hasBanners ? banners[currentBannerIndex] : null;

        const bannerTitle = currentBanner?.title || 'CHĂM SÓC SỨC KHỎE TẠI NHÀ\nĐƠN GIẢN VÀ HIỆU QUẢ';
        const bannerSubtitle = currentBanner?.subtitle || 'Cung cấp máy đo huyết áp, máy tạo oxy, máy đo đường huyết và vật tư y tế đạt tiêu chuẩn kiểm định Bộ Y Tế.';
        const bannerBadge = currentBanner?.badgeText || 'THIẾT BỊ Y TẾ GIA ĐÌNH CHÍNH HÃNG';
        const bannerImage = currentBanner?.imageUrl || HeroBannerImg;
        const primaryBtnText = currentBanner?.buttonText || 'MUA NGAY';
        const primaryBtnLink = currentBanner?.buttonLink || '/products';
        const secondaryBtnText = currentBanner?.secondaryButtonText || 'GỬI FILE BÁO GIÁ';
        const secondaryBtnLink = currentBanner?.secondaryButtonLink || '/consultation';

        const handlePrevBanner = () => {
          if (!hasBanners) return;
          setCurrentBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
        };

        const handleNextBanner = () => {
          if (!hasBanners) return;
          setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        };

        return (
          <section
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e8f6f8] via-[#e2f1f4] to-[#d6ebef] border border-teal-100 shadow-sm min-h-[380px] sm:min-h-[440px] flex items-center transition-all duration-500"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
              {/* Cột trái: Tiêu đề & Nút kêu gọi hành động */}
              <div className="space-y-5 z-10 animate-fade-in">
                {bannerBadge && (
                  <span className="inline-block text-xs sm:text-sm font-bold tracking-wider text-teal-800 uppercase bg-teal-50/90 px-3.5 py-1.5 rounded-full border border-teal-200/60 shadow-2xs">
                    {bannerBadge}
                  </span>
                )}

                <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight whitespace-pre-line">
                  {bannerTitle}
                </h1>

                {bannerSubtitle && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg">
                    {bannerSubtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {primaryBtnText && (
                    primaryBtnLink.startsWith('#') ? (
                      <a
                        href={primaryBtnLink}
                        className="px-7 py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-full text-xs sm:text-sm shadow-md transition transform hover:scale-105"
                      >
                        {primaryBtnText}
                      </a>
                    ) : (
                      <Link
                        to={primaryBtnLink}
                        className="px-7 py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-full text-xs sm:text-sm shadow-md transition transform hover:scale-105"
                      >
                        {primaryBtnText}
                      </Link>
                    )
                  )}

                  {secondaryBtnText && (
                    secondaryBtnLink.startsWith('#') ? (
                      <a
                        href={secondaryBtnLink}
                        className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{secondaryBtnText}</span>
                      </a>
                    ) : (
                      <Link
                        to={secondaryBtnLink}
                        className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 transform hover:scale-105"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{secondaryBtnText}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Cột phải: Hình ảnh gia đình & thiết bị */}
              <div className="relative flex justify-center items-center">
                <div className="w-full max-w-md h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white/40">
                  <img
                    key={bannerImage}
                    src={bannerImage}
                    alt={bannerTitle}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Nút điều hướng Carousel < > (Khi có nhiều hơn 1 banner) */}
            {hasBanners && banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevBanner}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer z-20 backdrop-blur-xs"
                  title="Banner trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextBanner}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer z-20 backdrop-blur-xs"
                  title="Banner tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Chấm chỉ số (Dots navigation) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentBannerIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentBannerIndex
                          ? 'w-6 bg-[#ff5722]'
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      title={`Chuyển đến Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })()}

      {/* 2. KHỐI DANH MỤC NỔI BẬT (Hình tròn Pastel Teal chuẩn thiết kế trong ảnh) */}
      <section className="space-y-6 text-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
            DANH MỤC NỔI BẬT
          </h2>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 pt-4 max-w-5xl mx-auto">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/products?categoryId=${cat.id}`}
              className="flex flex-col items-center group space-y-3"
            >
              {/* Vòng tròn icon xanh pastel */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#e6f4f6] border-2 border-teal-100 flex items-center justify-center shadow-xs group-hover:bg-[#13636b] group-hover:scale-110 group-hover:shadow-md transition duration-300">
                <span className="text-3xl group-hover:scale-110 transition">
                  {categoryIcons[idx % categoryIcons.length]}
                </span>
              </div>
              <span className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-teal-700 transition line-clamp-2 text-center max-w-[160px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. KHỐI SẢN PHẨM BÁN CHẠY (Clean White Cards) */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
            SẢN PHẨM BÁN CHẠY
          </h2>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-2 rounded-full"></div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Đang tải sản phẩm bán chạy...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
                >
                  <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50 p-4 block">
                    <img
                      src={product.primaryImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    {product.category && (
                      <span className="absolute top-3 left-3 bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
                        {product.category.name}
                      </span>
                    )}

                    {/* Wishlist toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition cursor-pointer ${
                        inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                      }`}
                      title="Yêu thích"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-gray-100">
                    <div>
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-teal-700 transition">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                        {product.description || 'Chính hãng CO/CQ'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                      <span className="font-bold text-teal-800 text-xs sm:text-sm">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Thêm vào giỏ"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Mua</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. MODULE GỬI FILE YÊU CẦU BÁO GIÁ & TƯ VẤN Y TẾ TRỰC TUYẾN */}
      <section id="quote-section" className="bg-gradient-to-br from-[#13636b] to-[#0a464c] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-gray-950 rounded-full text-xs font-black">
            <FileSpreadsheet className="w-4 h-4" />
            <span>YÊU CẦU BÁO GIÁ SỈ & ĐẶT HÀNG QUA FILE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gửi Danh Sách Thiết Bị Cần Báo Giá (Excel / PDF / Word)
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 font-light leading-relaxed">
            Dành cho phòng khám, bệnh viện, nhà thuốc và khách mua sỉ: Đính kèm file danh sách thiết bị cần mua để nhận bảng báo giá chiết khấu đặc biệt trong 30 phút.
          </p>
        </div>

        <form onSubmit={handleSubmitConsultation} className="max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {isAuthenticated && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
              <span>Đang tự động điền thông tin từ tài khoản: <strong>{user?.fullName || user?.username}</strong></span>
              <span className="font-mono text-teal-700 text-[11px]">{user?.email}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Họ và tên người liên hệ *
              </label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn An"
                value={consultForm.fullName}
                onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Số điện thoại nhận báo giá *
              </label>
              <input
                type="tel"
                required
                placeholder="0901 000 001"
                value={consultForm.phone}
                onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email nhận file báo giá
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={consultForm.email}
                onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tiêu đề yêu cầu báo giá / tư vấn *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Báo giá 10 máy đo huyết áp Omron và vật tư sơ cứu cho phòng khám"
              value={consultForm.title}
              onChange={(e) => setConsultForm({ ...consultForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nội dung chi tiết yêu cầu *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Mô tả cụ thể số lượng, model thiết bị hoặc yêu cầu tư vấn kỹ thuật..."
              value={consultForm.content}
              onChange={(e) => setConsultForm({ ...consultForm, content: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
            ></textarea>
          </div>

          {/* Upload file đính kèm (Excel, Word, PDF, Ảnh) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Đính kèm file danh sách thiết bị (Excel .xlsx/.xls, Word .docx, PDF, Ảnh - Tối đa 25MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-teal-600 rounded-2xl p-4 text-center bg-gray-50 transition">
              {selectedFile ? (
                <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-xs text-teal-900">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                    <span className="font-bold truncate">{selectedFile.name}</span>
                    <span className="text-gray-500 text-[11px] shrink-0">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer shrink-0"
                    title="Xóa file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-1">
                  <UploadCloud className="w-8 h-8 text-teal-600 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">
                    Bấm để chọn file hoặc kéo thả file Excel / PDF vào đây
                  </p>
                  <p className="text-[11px] text-gray-400">Hỗ trợ .xlsx, .xls, .docx, .pdf, .jpg, .png</p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls,.doc,.docx,.pdf,image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới form</span>
            </button>

            <button
              type="submit"
              disabled={submittingConsult || cooldown > 0}
              className="w-full sm:w-auto px-8 py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white font-black rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingConsult ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi file...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Vui lòng chờ {cooldown}s...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>GỬI YÊU CẦU BÁO GIÁ NGAY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 5. KHU VỰC CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GIẢI ĐÁP THẮC MẮC (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Giải đáp nhanh những thắc mắc phổ biến của quý khách khi tìm hiểu và đặt mua thiết bị y tế tại Kim Liên.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              id: 1,
              question: 'Tại sao một số sản phẩm trên website không để giá cố định?',
              answer:
                'Do đặc thù thiết bị y tế có mức giá linh hoạt tùy theo số lượng mua, địa điểm giao nhận và chính sách chiết khấu riêng cho khách quen / phòng khám. Trao đổi trực tiếp giúp chúng tôi báo mức giá ưu đãi và tốt nhất cho quý khách.',
            },
            {
              id: 2,
              question: 'Có những hình thức nào để liên hệ và đặt hàng tại shop?',
              answer:
                'Quý khách có thể lựa chọn các hình thức thuận tiện: (1) Đặt trực tiếp trên Website 24/7; (2) Nhắn Zalo gửi danh sách hoặc file Excel (Kênh phản hồi nhanh nhất & phổ biến nhất); (3) Gọi Hotline tư vấn; (4) Nhắn tin qua Facebook Messenger.',
            },
            {
              id: 3,
              question: 'Sau khi đặt hàng, khi nào tôi nhận được thông báo xác nhận đơn?',
              answer:
                'Đơn hàng của bạn sẽ được bộ phận chăm sóc khách hàng tiếp nhận, kiểm tra kho và liên hệ xác nhận trong vòng 1 – 2 ngày làm việc (thường sớm hơn trong giờ hành chính).',
            },
            {
              id: 4,
              question: 'Không tìm thấy mặt hàng cần mua trên website thì phải làm sao?',
              answer:
                'Quý khách có thể gửi trực tiếp hình ảnh, tên sản phẩm hoặc file danh sách Excel thiết bị cần tìm qua Zalo shop hoặc form "Gửi Yêu Cầu Báo Giá" ngay bên trên. Chúng tôi sẽ liên hệ tìm nguồn hàng chính hãng và báo giá ưu đãi cho bạn.',
            },
            {
              id: 5,
              question: 'Nếu gặp sự cố về website hoặc chất lượng sản phẩm thì phản ánh ở đâu?',
              answer:
                'Quý khách vui lòng chuyển sang trang Liên Hệ. Hệ thống tiếp nhận 4 nhóm yêu cầu: (1) Báo lỗi kỹ thuật / Website; (2) Tìm kiếm sản phẩm chưa có trên web; (3) Phản ánh chất lượng sản phẩm / Đổi trả; (4) Góp ý & thắc mắc khác.',
              link: '/contact',
              linkText: 'Chuyển đến trang Liên hệ & Góp ý →',
            },
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition overflow-hidden ${
                  isOpen
                    ? 'border-teal-300 bg-teal-50/20 shadow-2xs ring-1 ring-teal-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isOpen
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {faq.id}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`p-1.5 rounded-lg shrink-0 transition ${
                      isOpen
                        ? 'bg-teal-100 text-teal-800 rotate-180'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed space-y-3 border-t border-teal-100/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    {faq.link && (
                      <div>
                        <Link
                          to={faq.link}
                          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-800 hover:underline text-xs"
                        >
                          <span>{faq.linkText}</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. DẢI CHỨNG NHẬN TIÊU CHUẨN Y TẾ & THANH TOÁN */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-teal-700 shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Chứng Nhận Chuẩn Y Tế Quốc Tế & Bộ Y Tế</h4>
            <p className="text-[11px] text-gray-500">100% thiết bị nhập khẩu chính hãng có giấy tờ CO/CQ và hóa đơn VAT</p>
          </div>
        </div>

        {/* Badges tiêu chuẩn y tế */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-black text-gray-700">
          <span className="px-3 py-1 bg-gray-100 rounded border border-gray-300">FDA Approved</span>
          <span className="px-3 py-1 bg-gray-100 rounded border border-gray-300">CE Marking</span>
          <span className="px-3 py-1 bg-gray-100 rounded border border-gray-300">ISO 9001</span>
          <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded border border-teal-200">Bộ Y Tế</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
