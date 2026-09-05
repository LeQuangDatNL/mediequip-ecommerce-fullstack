import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { LogIn, Lock, User, ArrowRight, Eye, EyeOff, ShieldAlert, RotateCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Anti-Spam & CAPTCHA states
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [captchaData, setCaptchaData] = useState(null); // { captchaId, question }
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Account / IP Lockout states
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  // Lấy câu hỏi CAPTCHA mới từ server
  const fetchCaptcha = useCallback(async () => {
    try {
      setCaptchaLoading(true);
      const data = await authService.getCaptcha();
      setCaptchaData(data);
      setCaptchaAnswer('');
    } catch (err) {
      console.error('Không thể tải mã CAPTCHA:', err);
      toast.error('Không thể tải mã xác thực CAPTCHA');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Đếm ngược thời gian khóa tài khoản nếu bị tạm khóa
  useEffect(() => {
    let timer;
    if (isLocked && lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    if (requireCaptcha && !captchaAnswer.trim()) {
      toast.error('Vui lòng nhập câu trả lời cho phép tính CAPTCHA!');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(
        username.trim(),
        password,
        requireCaptcha ? captchaData?.captchaId : null,
        requireCaptcha ? captchaAnswer.trim() : null
      );
      toast.success(`Xin chào, ${userData.fullName || userData.username}!`);

      // Reset state sau khi đăng nhập thành công
      setRequireCaptcha(false);
      setCaptchaData(null);
      setCaptchaAnswer('');
      setIsLocked(false);

      // Phân quyền điều hướng sau khi đăng nhập thành công
      if (from) {
        navigate(from, { replace: true });
      } else if (userData.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      const errorMsg = data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!';

      // Trường hợp bị khóa do spam quá nhiều lần (HTTP 423 Locked)
      if (status === 423) {
        setIsLocked(true);
        setLockoutSeconds(900); // 15 phút
        toast.error(errorMsg, { duration: 6000 });
        return;
      }

      // Trường hợp yêu cầu CAPTCHA
      if (data?.requireCaptcha) {
        setRequireCaptcha(true);
        fetchCaptcha();
      } else if (requireCaptcha) {
        // Nếu đã hiện CAPTCHA mà bị lỗi (sai captcha hoặc sai mật khẩu), làm mới CAPTCHA
        fetchCaptcha();
      }

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatLockoutTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl shadow-lg shadow-indigo-200 mb-3">
            S
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Truy cập tài khoản E-Store của bạn
          </p>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-sm text-red-800">Tài khoản/Thiết bị tạm thời bị khóa</p>
              <p className="mt-0.5">
                Bạn đã nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau:{' '}
                <span className="font-bold text-red-900 underline text-sm">
                  {formatLockoutTime(lockoutSeconds)}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white py-8 px-6 sm:px-8 border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLocked}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLocked}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CAPTCHA Challenge Block */}
            {requireCaptcha && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Xác thực chống Spam (CAPTCHA)</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    disabled={captchaLoading}
                    className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-sm transition"
                    title="Đổi câu hỏi khác"
                  >
                    <RotateCcw className={`w-3 h-3 ${captchaLoading ? 'animate-spin' : ''}`} />
                    <span>Làm mới</span>
                  </button>
                </div>

                <p className="text-[11px] text-amber-700">
                  Bạn đã đăng nhập sai nhiều lần. Vui lòng giải phép tính sau để tiếp tục:
                </p>

                <div className="flex items-center gap-3">
                  <div className="bg-white border-2 border-dashed border-amber-300 px-4 py-2 rounded-xl font-mono font-black text-amber-900 tracking-wider text-base select-none shadow-inner">
                    {captchaData ? captchaData.question : 'Đang tải...'}
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Kết quả?"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isLocked ? 'Đang tạm khóa...' : 'Đăng nhập'}</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-0.5"
              >
                Đăng ký ngay <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
