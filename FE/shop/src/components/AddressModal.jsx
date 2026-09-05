import React, { useState, useEffect } from 'react';
import addressService from '../services/addressService';
import MapAddressPicker from './MapAddressPicker';
import {
  MapPin,
  X,
  Save,
  Check,
  Building,
  Phone,
  User,
  Navigation,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AddressModal = ({ isOpen, onClose, address, onSaved }) => {
  const isEditing = !!address?.id;
  const [submitting, setSubmitting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
    defaultAddress: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        recipientName: address.recipientName || '',
        phone: address.phone || '',
        province: address.province || '',
        district: address.district || '',
        ward: address.ward || '',
        addressDetail: address.addressDetail || '',
        defaultAddress: address.defaultAddress || false,
      });
    } else {
      setFormData({
        recipientName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        defaultAddress: false,
      });
    }
  }, [address, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Callback khi chọn địa chỉ từ bản đồ Leaflet
  const handleSelectFromMap = (location) => {
    setFormData((prev) => ({
      ...prev,
      province: location.province || prev.province,
      district: location.district || prev.district,
      ward: location.ward || prev.ward,
      addressDetail: location.addressDetail || location.fullAddress || prev.addressDetail,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.recipientName.trim() ||
      !formData.phone.trim() ||
      !formData.province.trim() ||
      !formData.district.trim() ||
      !formData.ward.trim() ||
      !formData.addressDetail.trim()
    ) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường địa chỉ!');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await addressService.updateAddress(address.id, formData);
        toast.success('Đã cập nhật địa chỉ thành công!');
      } else {
        await addressService.createAddress(formData);
        toast.success('Đã thêm địa chỉ giao hàng mới!');
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Lỗi lưu địa chỉ:', err);
      toast.error('Không thể lưu địa chỉ: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base">
                {isEditing ? 'Chỉnh Sửa Địa Chỉ Giao Hàng' : 'Thêm Địa Chỉ Giao Hàng Mới'}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Nút chọn nhanh từ Bản đồ & Vị trí hiện tại */}
            <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-teal-900 font-bold">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Chọn tự động qua Bản Đồ / GPS</span>
              </div>

              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Mở Bản Đồ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
                  />
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="VD: 0901234567"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Tỉnh / Thành phố */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
              />
            </div>

            {/* Quận / Huyện & Phường / Xã */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Quận / Huyện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="VD: Quận Đống Đa..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phường / Xã <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ward"
                  required
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="VD: Phường Kim Liên..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
                />
              </div>
            </div>

            {/* Số nhà & Tên đường */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="addressDetail"
                required
                rows={2}
                value={formData.addressDetail}
                onChange={handleChange}
                placeholder="VD: Số 123 đường Giải Phóng, Tòa nhà A, Phòng 402..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none"
              />
            </div>

            {/* Đặt làm mặc định */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="defaultAddress"
                name="defaultAddress"
                checked={formData.defaultAddress}
                onChange={handleChange}
                className="w-4 h-4 text-teal-700 rounded border-gray-300 focus:ring-teal-700 cursor-pointer"
              />
              <label
                htmlFor="defaultAddress"
                className="text-xs text-gray-700 font-semibold cursor-pointer"
              >
                Đặt làm địa chỉ nhận hàng mặc định
              </label>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Đang lưu...' : 'Lưu Địa Chỉ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Bản Đồ Map Picker */}
      <MapAddressPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectAddress={handleSelectFromMap}
      />
    </>
  );
};

export default AddressModal;

