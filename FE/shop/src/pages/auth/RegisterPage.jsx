import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
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
  ShieldCheck,
  Send,
  KeyRound,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Email OTP state
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: '',
    },
  });

  const emailValue = watch('email', '');
  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');

  // Bộ đếm thời gian gửi lại OTP (Countdown timer)
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Gửi mã OTP xác thực qua Email
  const handleSendOtp = async () => {
    if (!emailValue || !emailValue.includes('@')) {
      toast.error('Vui lòng nhập địa chỉ Email hợp lệ trước khi nhận mã OTP');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await authService.sendRegisterOtp(emailValue);
      setOtpSent(true);
      setCountdown(45); // Cooldown 45 giây
      toast.success(res?.message || 'Mã OTP đã được gửi đến email của bạn!');
    } catch (err) {
      console.error('Lỗi gửi OTP:', err);
      const msg = err.response?.data?.message || 'Không thể gửi mã OTP qua email';
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await authRegister({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        otp: data.otp || null,
      });

      toast.success('🎉 Đăng ký tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' },
        });
      }, 1200);
    } catch (err) {
      console.error('Lỗi đăng ký:', err);

      const status = err.response?.status;
      const responseData = err.response?.data;
      const message = responseData?.message || 'Đăng ký không thành công. Vui lòng thử lại!';

      if (status === 409) {
        if (message.toLowerCase().includes('tên đăng nhập') || message.toLowerCase().includes('username')) {
          setError('username', { type: 'server', message: 'Tên đăng nhập này đã được sử dụng' });
        } else if (message.toLowerCase().includes('email')) {
          setError('email', { type: 'server', message: 'Email này đã được đăng ký tài khoản khác' });
        } else {
          setServerError(message);
        }
      } else if (status === 400 && responseData?.fieldErrors) {
        Object.entries(responseData.fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: msg });
        });
      } else {
        setServerError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName, val) => {
    const hasError = !!errors[fieldName];
    const isSuccess = touchedFields[fieldName] && !hasError && val && val.length > 0;

    return `w-full pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white border rounded-xl transition-all duration-200 outline-none ${
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-100 bg-rose-50/20'
        : isSuccess
        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100'
        : 'border-slate-200 hover:border-slate-300 focus:border-teal-700 focus:ring-3 focus:ring-teal-100'
    }`;
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20">
      <div className="max-w-xl w-full">
        
        {/* Card Đăng ký */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Header Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-800 text-white shadow-lg shadow-teal-800/30 mb-4 transform hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Đăng Ký Tài Khoản
            </h1>
            <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
              <span>Hệ thống phân phối Thiết Bị Y Tế Kim Liên</span>
            </p>
          </div>

          {/* Banner lỗi từ server */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="text-sm leading-relaxed">{serverError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            
            {/* Họ và tên */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className={getInputClassName('fullName', watch('fullName'))}
                />
                {touchedFields.fullName && !errors.fullName && watch('fullName') && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="text-xs font-bold font-mono">@</span>
                </div>
                <input
                  type="text"
                  {...register('username')}
                  placeholder="nguyenvana (3-50 ký tự không dấu)"
                  className={getInputClassName('username', watch('username'))}
                />
                {touchedFields.username && !errors.username && watch('username') && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Email & Nút gửi OTP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="email@example.com"
                    className={getInputClassName('email', emailValue)}
                  />
                  {touchedFields.email && !errors.email && emailValue && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0}
                  className="px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                  title="Nhận mã OTP qua Gmail để xác thực tài khoản"
                >
                  {sendingOtp ? (
                    <div className="w-3.5 h-3.5 border-2 border-teal-800 border-t-transparent rounded-full animate-spin" />
                  ) : countdown > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{countdown}s</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{otpSent ? 'Gửi lại mã' : 'Lấy mã OTP'}</span>
                    </>
                  )}
                </button>
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Ô nhập mã xác thực OTP */}
            {otpSent && (
              <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 animate-fadeIn">
                <label className="block text-xs font-semibold text-teal-900 uppercase tracking-wider mb-1.5">
                  Mã xác thực OTP (6 chữ số)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    {...register('otp')}
                    placeholder="Nhập 6 số gửi về Gmail của bạn"
                    className="w-full pl-10 pr-4 py-2 text-sm font-mono tracking-widest text-slate-800 bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>
                <p className="text-[11px] text-teal-700 mt-1">
                  Mã xác thực đã được gửi tới <strong>{emailValue}</strong>. Vui lòng kiểm tra cả hộp thư chính và thư rác (Spam).
                </p>
              </div>
            )}

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Số điện thoại liên lạc
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="0901234567 (Tùy chọn)"
                  className={getInputClassName('phone', watch('phone'))}
                />
                {touchedFields.phone && !errors.phone && watch('phone') && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone.message}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                {passwordValue && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    passwordValue.length >= 6 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {passwordValue.length >= 6 ? 'Đạt độ dài' : `${passwordValue.length}/6 ký tự`}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Xác nhận mật khẩu <span className="text-rose-500">*</span>
                </label>
                {touchedFields.confirmPassword && !errors.confirmPassword && confirmPasswordValue && (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Trùng khớp
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Nhập lại chính xác mật khẩu trên"
                  className={getInputClassName('confirmPassword', confirmPasswordValue)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Nút Đăng ký */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-800 hover:bg-teal-900 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-teal-900/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng Ký Tài Khoản</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Chuyển sang Đăng nhập */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Đã có tài khoản y tế?{' '}
              <Link
                to="/login"
                className="font-semibold text-teal-800 hover:text-teal-900 transition-colors inline-flex items-center gap-1 ml-1"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Nút quay lại trang chủ */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;