import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import bannerService from '../../../services/bannerService';
import imageService from '../../../services/imageService';
import {
  LayoutTemplate,
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Link2,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BannerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    imageUrl: '',
    buttonText: 'MUA NGAY',
    buttonLink: '/products',
    secondaryButtonText: 'GỬI FILE BÁO GIÁ',
    secondaryButtonLink: '/consultation',
    displayOrder: 1,
    status: 'ACTIVE'
  });

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const data = await bannerService.getBannerById(id);
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          badgeText: data.badgeText || '',
          imageUrl: data.imageUrl || '',
          buttonText: data.buttonText || 'MUA NGAY',
          buttonLink: data.buttonLink || '/products',
          secondaryButtonText: data.secondaryButtonText || '',
          secondaryButtonLink: data.secondaryButtonLink || '',
          displayOrder: data.displayOrder ?? 1,
          status: data.status || 'ACTIVE'
        });
      } catch (err) {
        console.error('Lỗi tải banner:', err);
        toast.error('Không tìm thấy Banner cần cập nhật!');
        navigate('/admin/banners');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'displayOrder' ? Number(value) : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await imageService.uploadFiles([file]);
      if (res && res.length > 0) {
        setFormData((prev) => ({ ...prev, imageUrl: res[0].url }));
        toast.success('Đã tải ảnh lên thành công!');
      }
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề Banner!');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Vui lòng nhập link ảnh cho Banner!');
      return;
    }

    setSubmitting(true);
    try {
      await bannerService.updateBanner(id, formData);
      toast.success('Đã cập nhật Hero Banner thành công!');
      navigate('/admin/banners');
    } catch (err) {
      console.error('Lỗi cập nhật banner:', err);
      toast.error('Không thể cập nhật banner: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500">Đang tải dữ liệu Banner #{id}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/banners"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-teal-700" />
              <span>Chỉnh Sửa Hero Banner #{id}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Cập nhật thông tin slide quảng cáo trên slider trang chủ.
            </p>
          </div>
        </div>

        <Link
          to="/admin/banners"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
        >
          Hủy bỏ
        </Link>
      </div>

      {/* Form & Live Preview */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Nội dung hiển thị Banner</span>
            </h2>

            {/* Huy hiệu Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Huy hiệu phụ (Badge Text)
              </label>
              <input
                type="text"
                name="badgeText"
                value={formData.badgeText}
                onChange={handleChange}
                placeholder="VD: THIẾT BỊ Y TẾ CHÍNH HÃNG"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none"
              />
            </div>

            {/* Tiêu đề chính */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tiêu đề chính (Title) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="title"
                rows={2}
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: CHĂM SÓC SỨC KHỎE TẠI NHÀ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none font-bold"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                * Có thể ấn Enter để xuống dòng trong tiêu đề.
              </p>
            </div>

            {/* Phụ đề mô tả */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phụ đề mô tả ngắn (Subtitle)
              </label>
              <textarea
                name="subtitle"
                rows={2}
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="VD: Cung cấp máy đo huyết áp, máy tạo oxy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none"
              />
            </div>

            {/* Hình ảnh Banner */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700">
                Hình ảnh Banner (Image URL) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://... (hoặc bấm Tải ảnh lên)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 focus:border-teal-700 outline-none"
                />
                <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'Đang tải...' : 'Tải file'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Cấu hình các nút CTA */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-teal-700" />
              <span>Nút Kêu Gọi Hành Động (Call to Action Buttons)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nút 1 */}
              <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-3">
                <span className="text-xs font-bold text-orange-800 block">
                  🔘 Nút chính (Màu Cam)
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Nhãn nút chính
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Link điều hướng
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none"
                  />
                </div>
              </div>

              {/* Nút 2 */}
              <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-3">
                <span className="text-xs font-bold text-teal-800 block">
                  🔘 Nút phụ (Màu Xanh Teal)
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Nhãn nút phụ
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonText"
                    value={formData.secondaryButtonText}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Link điều hướng
                  </label>
                  <input
                    type="text"
                    name="secondaryButtonLink"
                    value={formData.secondaryButtonLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Cài đặt hiển thị</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Thứ tự hiển thị (Display Order)
              </label>
              <input
                type="number"
                name="displayOrder"
                min={0}
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Trạng thái hiển thị
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs outline-none bg-white font-semibold"
              >
                <option value="ACTIVE">🟢 Bật hiển thị (ACTIVE)</option>
                <option value="INACTIVE">⚪ Ẩn tạm thời (INACTIVE)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Đang cập nhật...' : 'Cập Nhật Banner'}</span>
            </button>
          </div>

          {/* Mockup Preview */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-teal-700" />
              <span>Xem trước Banner trực tiếp:</span>
            </span>

            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#e8f6f8] to-[#d6ebef] p-4 border border-teal-100 shadow-inner space-y-3">
              {formData.badgeText && (
                <span className="text-[9px] font-bold text-teal-800 bg-white/80 px-2 py-0.5 rounded-full border border-teal-200/60 inline-block">
                  {formData.badgeText}
                </span>
              )}
              <h4 className="text-xs font-black text-gray-900 leading-tight whitespace-pre-line">
                {formData.title || 'Tiêu đề Banner'}
              </h4>
              <p className="text-[10px] text-gray-500 line-clamp-2">
                {formData.subtitle || 'Phụ đề mô tả...'}
              </p>

              {formData.imageUrl && (
                <div className="w-full h-24 rounded-lg overflow-hidden border border-white shadow-2xs">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex gap-1.5 pt-1">
                {formData.buttonText && (
                  <span className="px-2.5 py-1 bg-[#ff5722] text-white text-[9px] font-bold rounded-full shadow-2xs">
                    {formData.buttonText}
                  </span>
                )}
                {formData.secondaryButtonText && (
                  <span className="px-2.5 py-1 bg-teal-700 text-white text-[9px] font-bold rounded-full shadow-2xs">
                    {formData.secondaryButtonText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BannerUpdate;

