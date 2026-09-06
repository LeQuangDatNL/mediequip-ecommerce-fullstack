import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import consultationService from '../../services/consultationService';
import HeroDoctorImg from '../../assets/medical_hero_doctor.jpg';
import MedicalDevicesImg from '../../assets/medical_devices_banner.jpg';
import MedicalConsultImg from '../../assets/medical_consult_banner.jpg';
import downloadQuoteExcelTemplate from '../../utils/quoteTemplateExport';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../utils/imageHelper';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  PhoneCall,
  CheckCircle2,
  Heart,
  Award,
  Activity,
  Stethoscope,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  X,
  Send,
  Clock,
  RotateCcw,
  Search,
  Syringe,
  Microscope,
  HeartPulse,
  Wind,
  Accessibility,
  Pill,
  Headphones,
  Check,
  DownloadCloud,
  Sparkles,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Search & Filter State on Hero Header
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

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

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          categoryService.getAllCategories().catch(() => []),
          productService.getProducts(0, '').catch(() => ({ content: [] })),
        ]);

        const catList = Array.isArray(cats) ? cats : [];
        setCategories(catList.slice(0, 8));

        const prodList = prods.content || (Array.isArray(prods) ? prods : []);
        setBestSellers(prodList.slice(0, 8));
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === 0) return 'Liên hệ báo giá';
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

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategoryFilter) params.set('categoryId', selectedCategoryFilter);
    navigate(`/products?${params.toString()}`);
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
      toast.success('Gửi yêu cầu báo giá / tư vấn thành công! Đội ngũ kỹ sư hóa học sẽ liên hệ trong 30 phút.');
      handleResetForm();
      setCooldown(30);
    } catch (err) {
      console.error('Lỗi gửi tư vấn:', err);
      toast.error('Không thể gửi yêu cầu: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingConsult(false);
    }
  };

  // Helper gán Medical Icon chuyên khoa cho từng Category
  const getCategoryIconDetails = (catName = '', index = 0) => {
    const name = catName.toLowerCase();
    if (name.includes('chẩn đoán') || name.includes('siêu âm') || name.includes('x-quang') || name.includes('máy đo') || name.includes('huyết áp')) {
      return { icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-100 group-hover:border-blue-300', tag: 'Chẩn đoán' };
    }
    if (name.includes('phòng mổ') || name.includes('gây mê') || name.includes('phẫu thuật') || name.includes('dao')) {
      return { icon: Syringe, color: 'text-teal-600', bg: 'bg-teal-50/80', border: 'border-teal-100 group-hover:border-teal-300', tag: 'Phòng mổ' };
    }
    if (name.includes('hồi sức') || name.includes('cấp cứu') || name.includes('oxy') || name.includes('thở')) {
      return { icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-50/80', border: 'border-cyan-100 group-hover:border-cyan-300', tag: 'Hồi sức' };
    }
    if (name.includes('xét nghiệm') || name.includes('sinh hóa') || name.includes('huyết học') || name.includes('lab')) {
      return { icon: Microscope, color: 'text-indigo-600', bg: 'bg-indigo-50/80', border: 'border-indigo-100 group-hover:border-indigo-300', tag: 'Xét nghiệm' };
    }
    if (name.includes('phục hồi') || name.includes('chức năng') || name.includes('vật lý') || name.includes('xe lăn')) {
      return { icon: Accessibility, color: 'text-emerald-600', bg: 'bg-emerald-50/80', border: 'border-emerald-100 group-hover:border-emerald-300', tag: 'Phục hồi' };
    }
    if (name.includes('tiêu hao') || name.includes('vật tư') || name.includes('khẩu trang') || name.includes('găng tay')) {
      return { icon: Pill, color: 'text-amber-600', bg: 'bg-amber-50/80', border: 'border-amber-100 group-hover:border-amber-300', tag: 'Vật tư' };
    }
    if (name.includes('tim mạch') || name.includes('điện tim') || name.includes('ecg')) {
      return { icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50/80', border: 'border-rose-100 group-hover:border-rose-300', tag: 'Tim mạch' };
    }

    const fallbacks = [
      { icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50/80', border: 'border-blue-100 group-hover:border-blue-300', tag: 'Thiết bị' },
      { icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50/80', border: 'border-teal-100 group-hover:border-teal-300', tag: 'Y khoa' },
      { icon: Microscope, color: 'text-indigo-600', bg: 'bg-indigo-50/80', border: 'border-indigo-100 group-hover:border-indigo-300', tag: 'Xét nghiệm' },
      { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50/80', border: 'border-emerald-100 group-hover:border-emerald-300', tag: 'Tiêu chuẩn' },
      { icon: Pill, color: 'text-purple-600', bg: 'bg-purple-50/80', border: 'border-purple-100 group-hover:border-purple-300', tag: 'Vật tư' },
    ];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="space-y-16 sm:space-y-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER (Đầu trang, trước Danh mục - Chuẩn Medical Healthcare) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#eef7fc] via-[#f7fbfe] to-white border border-blue-100/70 p-6 sm:p-10 lg:p-14 shadow-xs">
        
        {/* Decorative background blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-teal-200/25 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Cột trái: Thông điệp giới thiệu & CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-2xs text-xs font-semibold text-blue-900">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">🏥</span>
                <span className="inline-block w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">🩺</span>
                <span className="inline-block w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">⭐</span>
              </div>
              <span>Tin cậy bởi <strong>500+</strong> Bệnh viện, Phòng khám & Bác sĩ</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Giải Pháp Thiết Bị & Vật Tư Y Tế <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-teal-600 to-indigo-700">Chuyên Nghiệp</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl font-normal">
                Cung cấp trang thiết bị chẩn đoán hình ảnh, phòng mổ, theo dõi bệnh nhân và vật tư tiêu hao đạt chuẩn Bộ Y Tế & Quốc tế (FDA/CE). Tư vấn kỹ thuật chuyên sâu và báo giá dự án nhanh chóng.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group hover:-translate-y-0.5"
              >
                <span>Xem Danh Mục Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#quote-section"
                className="px-6 py-3.5 bg-white hover:bg-teal-50 text-teal-800 font-bold rounded-2xl text-xs sm:text-sm border border-teal-200 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                <span>Yêu Cầu Báo Giá Nhanh</span>
              </a>

              <a
                href="#how-it-works"
                className="px-4 py-3.5 text-gray-600 hover:text-blue-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Quy trình 5 bước</span>
              </a>
            </div>

            {/* 4 Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-blue-100/80">
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% CO/CQ Chính Hãng</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Giá Cả Tốt Nhất & Báo Giá 2H</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Giao Hàng Nhanh Toàn Quốc</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kỹ Sư Hóa Học Hỗ Trợ 24/7</span>
              </div>
            </div>

          </div>

          {/* Cột phải: Hero Medical Visual với Floating Cards (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Main Visual Image Container */}
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={HeroDoctorImg}
                alt="Đội ngũ bác sĩ và thiết bị y tế chuyên nghiệp"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
            </div>

            {/* Floating Card 1: Available Devices */}
            <div className="absolute -top-4 sm:-top-5 right-2 sm:right-0 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Thiết Bị Sẵn Kho</p>
                <p className="text-xs sm:text-sm font-black text-gray-900">1,200+ Model Máy</p>
              </div>
            </div>

            {/* Floating Card 2: 24/7 Support */}
            <div className="absolute -bottom-4 sm:-bottom-5 left-2 sm:left-0 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Bảo Hành & Kiểm Định</p>
                <p className="text-xs sm:text-sm font-black text-teal-900">Chuẩn ISO 13485 & CE</p>
              </div>
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* QUICK SEARCH & FILTER BAR (Nằm ở chân Hero Header) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-8 pt-6 border-t border-blue-100/60">
          <form onSubmit={handleHeroSearchSubmit} className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-md border border-blue-100 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full">
              <Search className="w-4 h-4 text-blue-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên thiết bị y tế, model, hãng sản xuất (Omron, GE, Philips...)..."
                className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l border-gray-200 px-3 py-1.5 flex items-center">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả chuyên khoa y tế</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Tìm Kiếm Thiết Bị</span>
            </button>
          </form>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. DANH MỤC SẢN PHẨM (Nằm ngay bên dưới Hero Header - Medical Line Icons) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
              CHUYÊN KHOA & PHÂN LOẠI
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1.5">
              Danh Mục Trang Thiết Bị Y Tế
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (Numbered Medical Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const iconInfo = getCategoryIconDetails(cat.name, idx);
            const Icon = iconInfo.icon;
            const numberString = String(idx + 1).padStart(2, '0');

            return (
              <Link
                key={cat.id || idx}
                to={`/products?categoryId=${cat.id}`}
                className={`group relative p-5 bg-white rounded-2xl border ${iconInfo.border} shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                {/* Top: Number and Medical Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-gray-300 group-hover:text-blue-600 transition-colors">
                    {numberString}
                  </span>
                  <div className={`w-11 h-11 rounded-xl ${iconInfo.bg} ${iconInfo.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Body: Name & Specialty Tag */}
                <div className="mt-4 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {iconInfo.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition line-clamp-2">
                    {cat.name}
                  </h3>
                </div>

                {/* Footer: Action hint */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-500 group-hover:text-blue-600 transition">
                  <span>Khám phá thiết bị</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BA (3) BANNER / SECTION GIỚI THIỆU & GIẢI THÍCH DỊCH VỤ */}
      {/* ========================================================================= */}
      
      {/* --- BANNER 1: THIẾT BỊ Y TẾ CHẤT LƯỢNG & NGUỒN GỐC XUẤT XỨ --- */}
      <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Cột trái: Hình ảnh thiết bị y tế hiện đại (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
              <img
                src={MedicalDevicesImg}
                alt="Thiết bị chẩn đoán hình ảnh và hồi sức hiện đại"
                className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-500"
              />
            </div>
            
            {/* Floating Badge tiêu chuẩn */}
            <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-emerald-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Tiêu Chuẩn Toàn Cầu</p>
                <p className="text-xs font-black text-gray-900">FDA • CE • ISO 13485</p>
              </div>
            </div>
          </div>

          {/* Cột phải: Nội dung cam kết chất lượng (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
                CAM KẾT CHẤT LƯỢNG & NGUỒN GỐC
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                Trang Thiết Bị Y Tế Nhập Khẩu Đạt Chuẩn Kiểm Định Quốc Tế
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Toàn bộ thiết bị y tế tại MediEquip được nhập khẩu chính ngạch từ các thương hiệu uy tín hàng đầu (Mỹ, Đức, Nhật Bản, Hàn Quốc), đáp ứng đầy đủ tiêu chuẩn kiểm định của Bộ Y Tế.
              </p>
            </div>

            {/* 4 Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-snug">
                  <strong className="block text-gray-900">Đầy đủ CO/CQ & Hóa đơn VAT:</strong>
                  Hồ sơ pháp lý xuất xứ rõ ràng cho mọi dự án.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-snug">
                  <strong className="block text-gray-900">Kiểm định an toàn nghiêm ngặt:</strong>
                  Đạt chuẩn an toàn điện y tế và an toàn bức xạ.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-snug">
                  <strong className="block text-gray-900">Đào tạo chuyển giao kỹ thuật:</strong>
                  Kỹ sư hỗ trợ lắp đặt và hướng dẫn vận hành tận nơi.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 leading-snug">
                  <strong className="block text-gray-900">Bảo hành 12 - 36 tháng:</strong>
                  Bảo dưỡng định kỳ và cung cấp linh kiện thay thế chính hãng.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-xs transition"
              >
                <span>Khám phá các dòng máy chẩn đoán</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* --- BANNER 2: TƯ VẤN CHUYÊN SÂU & YÊU CẦU BÁO GIÁ LINH HOẠT --- */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl overflow-hidden relative">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Cột trái: Nội dung giải thích chính sách báo giá (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15">
              DÀNH CHO PHÒNG KHÁM, BỆNH VIỆN & ĐỐI TÁC SỈ
            </span>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Chính Sách Báo Giá May Đo & Chiết Khấu Dự Án Ưu Đãi
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 font-light leading-relaxed">
                Do tính chất kỹ thuật và cấu hình tùy biến theo từng chuyên khoa, chúng tôi áp dụng cơ chế <strong>báo giá linh hoạt theo số lượng và nhu cầu thực tế</strong> nhằm mang lại mức chiết khấu tốt nhất cho các cơ sở y tế.
              </p>
            </div>

            {/* 3 Step highlights */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <span>Tìm kiếm và xem thông số kỹ thuật các model thiết bị trên website.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <span>Gửi danh sách thiết bị cần báo giá trực tuyến hoặc tải lên file Excel.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-gray-950 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <span>Nhận bảng báo giá chiết khấu dự án chính thức trong vòng <strong>30 phút – 2 giờ</strong>.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#quote-section"
                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Gửi Yêu Cầu Báo Giá Ngay</span>
              </a>

              <Link
                to="/contact"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-cyan-300" />
                <span>Liên Hệ Kỹ Sư Hóa Học Tư Vấn</span>
              </Link>
            </div>

          </div>

          {/* Cột phải: Hình ảnh kỹ sư tư vấn thiết bị (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10">
              <img
                src={MedicalConsultImg}
                alt="Chuyên gia kỹ thuật y sinh tư vấn dự án thiết bị y tế"
                className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* --- BANNER 3: QUY TRÌNH ĐẶT HÀNG & GIAO HÀNG (HOW IT WORKS - 5 BƯỚC) --- */}
      <section id="how-it-works" className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            QUY TRÌNH MUA SẮM MINH BẠCH
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            5 Bước Mua Sắm & Bàn Giao Thiết Bị Y Tế
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Quy trình làm việc chuyên nghiệp, rõ ràng giúp quý khách hoàn toàn an tâm khi đầu tư trang thiết bị.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/80 hover:bg-blue-50 hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                01
              </span>
              <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tìm & Chọn Thiết Bị</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Tra cứu thông số kỹ thuật, tính năng và catalogue trên website.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100/80 hover:bg-teal-50 hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                02
              </span>
              <FileSpreadsheet className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Gửi Yêu Cầu Báo Giá</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Điền form trực tuyến hoặc đính kèm file Excel danh mục cần mua.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 hover:bg-indigo-50 hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                03
              </span>
              <Headphones className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Tư Vấn & Báo Giá</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Kỹ sư hóa học liên hệ tư vấn cấu hình và gửi bảng giá chiết khấu trong 2h.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100/80 hover:bg-purple-50 hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                04
              </span>
              <ShieldCheck className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Hợp Đồng & Đặt Hàng</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Xác nhận đơn, ký hợp đồng kinh tế và cung cấp đầy đủ hóa đơn VAT.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 hover:bg-emerald-50 hover:shadow-md transition-all duration-200 space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                05
              </span>
              <Truck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Giao & Lắp Đặt Tận Nơi</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Bàn giao, hướng dẫn vận hành kỹ thuật và kích hoạt bảo hành chính hãng.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SẢN PHẨM NỔI BẬT & BÁN CHẠY (Clean Medical Product Cards) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-gray-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
              SẢN PHẨM NỔI BẬT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1.5">
              Thiết Bị Y Tế Được Tin Dùng Nhiều Nhất
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Xem toàn bộ sản phẩm ({bestSellers.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Đang tải danh sách sản phẩm...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image container */}
                  <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50/70 p-5 block">
                    <img
                      src={product.primaryImageUrl || DEFAULT_NO_IMAGE}
                      onError={handleImageError}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category tag */}
                    {product.category && (
                      <span className="absolute top-3 left-3 bg-blue-50/90 backdrop-blur-xs text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-blue-200/60 shadow-2xs">
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

                  {/* Body & Actions */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-gray-100">
                    <div>
                      <Link to={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
                        {product.description || 'Chính hãng đầy đủ CO/CQ kiểm định'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">Giá niêm yết</span>
                        <span className="font-black text-blue-700 text-xs sm:text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/products/${product.id}`}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          Chi tiết
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs cursor-pointer"
                          title="Thêm vào giỏ hàng"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. MODULE GỬI FILE YÊU CẦU BÁO GIÁ & TƯ VẤN Y TẾ TRỰC TUYẾN */}
      {/* ========================================================================= */}
      <section id="quote-section" className="bg-gradient-to-br from-teal-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-teal-400 text-gray-950 rounded-full text-xs font-black shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
            <span>YÊU CẦU BÁO GIÁ SỈ & ĐẶT HÀNG QUA FILE EXCEL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
            Gửi Yêu Cầu Báo Giá Thiết Bị & Vật Tư Y Tế
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 font-light leading-relaxed">
            Hệ thống hỗ trợ tiếp nhận danh sách báo giá trực tiếp dành riêng cho Bác sĩ, Phòng khám, Bệnh viện và Khách hàng mua sỉ.
          </p>
        </div>

        {/* 3 Khối giải thích chi tiết mục đích tính năng Báo Giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          {/* Card 1: Sản phẩm chưa có trên web */}
          <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-2 hover:bg-white/15 transition">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">1. Sản phẩm chưa có trên Web</h3>
            <p className="text-xs text-teal-100 leading-relaxed font-light">
              Bạn cần tìm dòng máy chuyên khoa sâu, model đặc thù hoặc vật tư hiếm chưa đăng tải trên web? Chỉ cần ghi tên máy/model vào file, shop sẽ liên hệ các hãng nhập khẩu báo giá cho bạn.
            </p>
          </div>

          {/* Card 2: Báo giá sỉ & Dự án phòng khám */}
          <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-2 hover:bg-white/15 transition">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">2. Báo giá Sỉ & Trọn Gói Dự Án</h3>
            <p className="text-xs text-teal-100 leading-relaxed font-light">
              Dành cho cơ sở y tế đầu tư trọn gói nhiều trang thiết bị: Nhận mức chiết khấu đại lý tốt nhất, tối ưu chi phí hơn nhiều so với giá bán lẻ thông thường.
            </p>
          </div>

          {/* Card 3: Báo giá trực tiếp & Hợp đồng */}
          <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-2 hover:bg-white/15 transition">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">3. Báo Giá Trực Tiếp Nhanh Chóng</h3>
            <p className="text-xs text-teal-100 leading-relaxed font-light">
              Trao đổi trực tiếp 1-1 với đội ngũ kỹ sư hóa học & kỹ thuật y sinh, hỗ trợ lập hồ sơ thầu, cung cấp hóa đơn đỏ VAT và ký hợp đồng kinh tế minh bạch, cam kết thời gian giao hàng.
            </p>
          </div>

        </div>

        {/* Action Download Template Box */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-800/60 to-blue-900/60 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-teal-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-400 text-gray-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Chưa có danh sách sẵn? Tải ngay file mẫu Excel chuẩn</p>
              <p className="text-xs text-teal-200">File mẫu định dạng `.csv/.xlsx` có sẵn các cột thông tin thiết bị, số lượng và thông số kỹ thuật.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadQuoteExcelTemplate}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-gray-950 font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>TẢI MẪU EXCEL BÁO GIÁ</span>
          </button>
        </div>

        {/* Form Gửi Yêu Cầu */}
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
                placeholder="BS. Nguyễn Văn An"
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
                placeholder="0914 066 662"
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
                placeholder="bacsi@phongkham.vn"
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
              placeholder="Ví dụ: Báo giá 10 máy theo dõi bệnh nhân và vật tư hồi sức cho phòng khám"
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
              placeholder="Mô tả cụ thể số lượng, model thiết bị, tên phòng khám hoặc yêu cầu kỹ thuật đặc thù..."
              value={consultForm.content}
              onChange={(e) => setConsultForm({ ...consultForm, content: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-teal-600"
            ></textarea>
          </div>

          {/* Upload file đính kèm (Excel, Word, PDF, Ảnh) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                Đính kèm file danh sách thiết bị (Excel .xlsx/.xls, Word .docx, PDF, Ảnh - Tối đa 25MB)
              </label>
              <button
                type="button"
                onClick={downloadQuoteExcelTemplate}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Tải file mẫu Excel nếu chưa có</span>
              </button>
            </div>
            
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
              className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* ========================================================================= */}
      {/* 6. KHU VỰC CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
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
                    ? 'border-blue-300 bg-blue-50/20 shadow-2xs ring-1 ring-blue-100'
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
                          ? 'bg-blue-600 text-white shadow-xs'
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
                        ? 'bg-blue-100 text-blue-800 rotate-180'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed space-y-3 border-t border-blue-100/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    {faq.link && (
                      <div>
                        <Link
                          to={faq.link}
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline text-xs"
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

      {/* ========================================================================= */}
      {/* 7. DẢI CHỨNG NHẬN TIÊU CHUẨN Y TẾ QUỐC TẾ & BỘ Y TẾ */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Chứng Nhận Chuẩn Y Tế Quốc Tế & Bộ Y Tế</h4>
            <p className="text-[11px] text-gray-500">100% thiết bị nhập khẩu chính hãng có giấy tờ CO/CQ và hóa đơn VAT</p>
          </div>
        </div>

        {/* Badges tiêu chuẩn y tế */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-black text-gray-700">
          <span className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-300">FDA Approved</span>
          <span className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-300">CE Marking</span>
          <span className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-300">ISO 13485</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">Bộ Y Tế</span>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
