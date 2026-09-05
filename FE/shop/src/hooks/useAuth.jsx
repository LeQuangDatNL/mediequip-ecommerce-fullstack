import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Khôi phục và đồng bộ session khi tải lại trang
  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Không thể khôi phục phiên đăng nhập:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Hàm Đăng nhập
  const login = async (username, password, captchaId = null, captchaAnswer = null) => {
    const authData = await authService.login(username, password, captchaId, captchaAnswer);
    const authToken = authData.token;
    localStorage.setItem('token', authToken);
    setToken(authToken);

    // Lấy thông tin user ngay sau khi có token
    const userData = await authService.getMe();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  // Hàm Đăng ký
  const register = async (formData) => {
    return await authService.register(formData);
  };

  // Hàm Đăng xuất
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Lỗi khi đăng xuất backend:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const role = user?.role || null;
  const isAuthenticated = !!user && !!token;
  const isAdmin = role === 'ADMIN';

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};

export default useAuth;

