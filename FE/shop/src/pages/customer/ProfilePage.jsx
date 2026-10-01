import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import addressService from '../../services/addressService';
import userService from '../../services/userService';
import AddressModal from '../../components/AddressModal';
import MapAddressPicker from '../../components/MapAddressPicker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, changePasswordSchema } from '../../utils/validationSchemas';
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
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'addresses'

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  // 1. React Hook Form cho Cập nhật Thông tin cá nhân
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty }
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  // 2. React Hook Form cho Đổi mật khẩu
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  // Cập nhật giá trị ban đầu cho Form Profile khi user thay đổi
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, resetProfile]);

  // Tải danh sách địa chỉ
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

  // Xử lý lưu thông tin cá nhân
  const onUpdateProfile = async (data) => {
    setSavingProfile(true);
    try {
      const updatedUser = await userService.updateMyProfile({
        fullName: data.fullName,
        email: user?.email,
        phone: data.phone || ''
      });
      toast.success('Cập nhật thông tin cá nhân thành công!');
      
      // Cập nhật lại thông tin trong localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUser = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));

      // Reset form với giá trị mới
      resetProfile({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || ''
      });
    } catch (err) {
      console.error('Lỗi cập nhật hồ sơ:', err);
      const msg = err.response?.data?.message || 'Không thể cập nhật thông tin cá nhân';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  // Xử lý đổi mật khẩu
  const onChangePassword = async (data) => {
    setSavingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      resetPasswordForm();
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      const msg = err.response?.data?.message || 'Mật khẩu hiện tại không chính xác';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  // Quản lý địa chỉ
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Profile Summary */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white text-3xl font-bold shadow-inner">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.fullName || user?.username || 'Người dùng'}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  user?.role === 'ADMIN' ? 'bg-amber-400 text-amber-950' : 'bg-teal-500/30 text-teal-200 border border-teal-400/30'
                }`}>
                  {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </div>
              <p className="text-teal-200/80 text-sm mt-0.5">@{user?.username} • Thành viên hệ thống Y Tế Kim Liên</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 flex flex-wrap sm:flex-nowrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'profile'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'password'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'addresses'
                ? 'bg-teal-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Sổ địa chỉ ({addresses.length})</span>
          </button>
        </div>

        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Chỉnh sửa hồ sơ cá nhân</h2>
                <p className="text-xs text-slate-500 mt-0.5">Cập nhật họ tên, số điện thoại liên lạc và email nhận thông báo</p>
              </div>
              <UserCheck className="w-6 h-6 text-teal-700" />
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Username (Read only) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={user?.username || ''}
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Tên đăng nhập cố định không thể thay đổi</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...registerProfile('fullName')}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        profileErrors.fullName
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-teal-700 focus:ring-teal-100'
                      }`}
                    />
                  </div>
                  {profileErrors.fullName && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {profileErrors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email (Cố định, không thể thay đổi) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Địa chỉ Email</span>
                    <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" /> Cố định nhận OTP & Thông báo
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-slate-100 border border-slate-200 text-slate-600 font-medium rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Email tài khoản dùng để nhận mã OTP và thông báo đơn hàng</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại di động
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...registerProfile('phone')}
                      placeholder="Ví dụ: 0901234567"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        profileErrors.phone
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-teal-700 focus:ring-teal-100'
                      }`}
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {profileErrors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile || !isProfileDirty}
                  className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ĐỔI MẬT KHẨU */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Đổi mật khẩu tài khoản</h2>
                <p className="text-xs text-slate-500 mt-0.5">Bảo vệ tài khoản bằng mật khẩu mạnh có ít nhất 6 ký tự</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-teal-700" />
            </div>

            <form onSubmit={handleSubmitPassword(onChangePassword)} className="p-6 space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu hiện tại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...registerPassword('currentPassword')}
                    placeholder="Nhập mật khẩu đang dùng"
                    className={`w-full border rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                      passwordErrors.currentPassword
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-300 focus:border-teal-700 focus:ring-teal-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...registerPassword('newPassword')}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full border rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                      passwordErrors.newPassword
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-300 focus:border-teal-700 focus:ring-teal-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    {...registerPassword('confirmNewPassword')}
                    placeholder="Nhập lại mật khẩu mới"
                    className={`w-full border rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                      passwordErrors.confirmNewPassword
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-300 focus:border-teal-700 focus:ring-teal-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmNewPassword && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {passwordErrors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 disabled:bg-slate-300 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SỔ ĐỊA CHỈ */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Sổ địa chỉ giao hàng</h2>
                <p className="text-xs text-slate-500 mt-0.5">Quản lý các địa chỉ nhận hàng để thanh toán và báo giá nhanh hơn</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMapPickerOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Chọn trên bản đồ</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm địa chỉ</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingAddresses ? (
                <div className="py-12 text-center text-slate-400 text-sm">Đang tải danh sách địa chỉ...</div>
              ) : addresses.length === 0 ? (
                <div className="py-12 text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">Bạn chưa lưu địa chỉ giao hàng nào</p>
                  <p className="text-xs text-slate-400 mt-1">Thêm địa chỉ ngay để tiết kiệm thời gian khi đặt hàng</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative border rounded-xl p-4 transition-all ${
                        addr.defaultAddress
                          ? 'border-teal-600 bg-teal-50/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{addr.recipientName}</span>
                            {addr.defaultAddress && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{addr.phone}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(addr)}
                            className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-100"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                      </p>

                      {!addr.defaultAddress && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr)}
                            className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                          >
                            Đặt làm mặc định
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Address Edit/Create Modal */}
      {modalOpen && (
        <AddressModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            fetchAddresses();
          }}
          initialData={editingAddress}
        />
      )}

      {/* Map Picker Modal */}
      {mapPickerOpen && (
        <MapAddressPicker
          isOpen={mapPickerOpen}
          onClose={() => setMapPickerOpen(false)}
          onSelectLocation={handleMapSelectDirect}
        />
      )}
    </div>
  );
};

export default ProfilePage;