import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  // Khởi tạo React Hook Form kết hợp Zod Validator
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched', // Validate tự động khi blur và khi gõ
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');
  const fullNameValue = watch('fullName', '');
  const usernameValue = watch('username', '');
  const emailValue = watch('email', '');
  const phoneValue = watch('phone', '');

  // Xử lý submit form
  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const payload = {
        fullName: data.fullName.trim(),
        username: data.username.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        password: data.password,
      };

      await authRegister(payload);
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      const responseData = error.response?.data;

      // 1. Nếu Backend trả về danh sách fieldErrors
      if (responseData?.fieldErrors && typeof responseData.fieldErrors === 'object') {
        Object.entries(responseData.fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: msg });
        });
        const firstField = Object.keys(responseData.fieldErrors)[0];
        toast.error(responseData.fieldErrors[firstField] || 'Vui lòng kiểm tra lại các trường thông tin');
      } else {
        // 2. Lỗi thông báo chung từ server
        const errorMsg =
          responseData?.message ||
          error.message ||
          'Đăng ký thất bại. Tên đăng nhập hoặc email có thể đã tồn tại!';

        setServerError(errorMsg);
        toast.error(errorMsg);

        if (errorMsg.toLowerCase().includes('tên đăng nhập') || errorMsg.toLowerCase().includes('username')) {
          setError('username', { type: 'server', message: errorMsg });
        } else if (errorMsg.toLowerCase().includes('email')) {
          setError('email', { type: 'server', message: errorMsg });
        } else if (errorMsg.toLowerCase().includes('số điện thoại') || errorMsg.toLowerCase().includes('phone')) {
          setError('phone', { type: 'server', message: errorMsg });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper hiển thị trạng thái viền của input
  const getInputClassName = (fieldName, val) => {
    const isTouched = touchedFields[fieldName];
    const hasError = !!errors[fieldName];
    const isValid = isTouched && !hasError && val && val.length > 0;

    if (hasError) {
      return 'w-full pl-10 pr-10 py-2.5 bg-red-50/40 border border-red-400 text-gray-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 transition';
    }
    if (isValid) {
      return 'w-full pl-10 pr-10 py-2.5 bg-emerald-50/20 border border-emerald-300 text-gray-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600 transition';
    }
    return 'w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600 focus:bg-white transition';
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full space-y-5">
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-800 to-emerald-600 text-white shadow-lg shadow-teal-700/20 mb-3">
            <Stethoscope className="w-7 h-7 text-emerald-100" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Tạo Tài Khoản Khách Hàng
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            MediEquip Vietnam • Thiết Bị Y Tế Kim Liên (7/54 Dương Thiệu Tước)
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white py-7 px-6 sm:px-8 border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
          {/* Banner lỗi từ server nếu có */}
          {serverError && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
            {/* 1. Họ và tên */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                {touchedFields.fullName && !errors.fullName && fullNameValue && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="VD: Nguyễn Văn A"
                  className={getInputClassName('fullName', fullNameValue)}
                />
                {errors.fullName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName.message}
                </p>
              )}
            </div>

            {/* 2. Tên đăng nhập */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                {touchedFields.username && !errors.username && usernameValue && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type="text"
                  {...register('username')}
                  placeholder="VD: nguyenvana (3-50 ký tự, không dấu)"
                  className={getInputClassName('username', usernameValue)}
                />
                {errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.username.message}
                </p>
              )}
            </div>

            {/* 3. Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                {touchedFields.email && !errors.email && emailValue && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="VD: nguyenvana@gmail.com"
                  className={getInputClassName('email', emailValue)}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* 4. Số điện thoại */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Số điện thoại <span className="text-gray-400 font-normal">(Tùy chọn)</span>
                </label>
                {touchedFields.phone && !errors.phone && phoneValue && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Hợp lệ
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="VD: 0914066662 (10 số di động VN)"
                  className={getInputClassName('phone', phoneValue)}
                />
                {errors.phone && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone.message}
                </p>
              )}
            </div>

            {/* 5. Mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                {passwordValue && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    passwordValue.length >= 6 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {passwordValue.length >= 6 ? 'Đạt độ dài' : `${passwordValue.length}/6 ký tự`}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Tối thiểu 6 ký tự"
                  className={getInputClassName('password', passwordValue)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-700 transition cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* 6. Xác nhận mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                {touchedFields.confirmPassword && !errors.confirmPassword && confirmPasswordValue && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Trùng khớp
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 text-teal-700" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Nhập lại mật khẩu ở trên"
                  className={getInputClassName('confirmPassword', confirmPasswordValue)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-700 transition cursor-pointer"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-teal-800 to-emerald-700 hover:from-teal-900 hover:to-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-teal-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Hoàn Tất Đăng Ký Tài Khoản</span>
                </>
              )}
            </button>
          </form>

          {/* Link sang Đăng nhập */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Đã có tài khoản MediEquip?{' '}
              <Link
                to="/login"
                className="font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


