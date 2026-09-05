import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import addressService from '../../services/addressService';
import AddressModal from '../../components/AddressModal';
import MapAddressPicker from '../../components/MapAddressPicker';
import {
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Navigation,
  Building,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Standalone Map Picker
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getMyAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải danh sách địa chỉ:', err);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await addressService.deleteAddress(id);
      toast.success('Đã xóa địa chỉ thành công!');
      fetchAddresses();
    } catch (err) {
      console.error('Lỗi xóa địa chỉ:', err);
      toast.error('Không thể xóa địa chỉ');
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      await addressService.updateAddress(addr.id, {
        ...addr,
        defaultAddress: true,
      });
      toast.success('Đã đặt làm địa chỉ mặc định!');
      fetchAddresses();
    } catch (err) {
      console.error('Lỗi đặt mặc định:', err);
      toast.error('Không thể đặt mặc định');
    }
  };

  // Quick direct add from Map Picker
  const handleMapSelectDirect = (location) => {
    setEditingAddress({
      recipientName: user?.fullName || user?.username || '',
      phone: user?.phone || '',
      province: location.province,
      district: location.district,
      ward: location.ward,
      addressDetail: location.addressDetail || location.fullAddress,
      defaultAddress: addresses.length === 0,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-900 flex items-center justify-center text-white font-black text-2xl shadow-md">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.fullName || user?.username}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Tài khoản khách hàng thành viên MediEquip</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {user?.role === 'ADMIN' ? '👑 Quản Trị Viên' : '👤 Khách Hàng Thân Thiết'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 1. Thông tin cá nhân & 2. Sổ địa chỉ giao hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin tài khoản */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 h-fit">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-700" />
            <span>Thông Tin Cá Nhân</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Tên đăng nhập:</span>
              <span className="font-semibold text-gray-800">{user?.username}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Email liên kết:</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {user?.email || 'Chưa cập nhật'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Số điện thoại:</span>
              <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {user?.phone || 'Chưa cập nhật'}
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải: Sổ địa chỉ giao hàng (Map API & GPS Geolocation) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-700" />
                <span>Sổ Địa Chỉ Giao Hàng & Định Vị Map</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Quản lý địa chỉ nhận thiết bị y tế hoặc định vị GPS vị trí của bạn trên bản đồ.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMapPickerOpen(true)}
                className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Mở bản đồ chọn vị trí"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-700" />
                <span>Chọn trên Map</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa chỉ</span>
              </button>
            </div>
          </div>

          {/* Danh sách địa chỉ */}
          {loadingAddresses ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-7 h-7 border-3 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-400">Đang tải sổ địa chỉ...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-12 text-center space-y-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-6">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
              <div>
                <p className="text-sm font-bold text-gray-700">Chưa có địa chỉ giao hàng nào</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Hãy thêm địa chỉ nhận hàng hoặc định vị vị trí hiện tại của bạn để nhận thiết bị y tế nhanh nhất!
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa chỉ đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {addresses.map((addr) => {
                const isDefault = addr.defaultAddress;
                return (
                  <div
                    key={addr.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isDefault
                        ? 'bg-teal-50/40 border-teal-300 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">
                            {addr.recipientName}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">|</span>
                          <span className="text-xs text-gray-600 font-semibold">{addr.phone}</span>
                          {isDefault && (
                            <span className="px-2 py-0.5 bg-teal-700 text-white text-[10px] font-bold rounded-md shadow-2xs">
                              Mặc định
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-700 font-medium">
                          {addr.addressDetail}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr)}
                            className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer px-2 py-1"
                          >
                            Thiết lập mặc định
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(addr)}
                          className="p-1.5 text-gray-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                          title="Sửa địa chỉ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Xóa địa chỉ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Quản lý Form Địa Chỉ */}
      <AddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        address={editingAddress}
        onSaved={fetchAddresses}
      />

      {/* Standalone Map Picker Modal */}
      <MapAddressPicker
        isOpen={mapPickerOpen}
        onClose={() => setMapPickerOpen(false)}
        onSelectAddress={handleMapSelectDirect}
      />
    </div>
  );
};

export default ProfilePage;

