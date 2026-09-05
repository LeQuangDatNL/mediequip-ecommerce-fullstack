import apiClient from './apiClient';

export const authService = {
  // Lấy câu hỏi CAPTCHA toán học
  async getCaptcha() {
    const response = await apiClient.get('/api/auth/captcha');
    return response.data; // { captchaId, question, expiresInSeconds }
  },

  // Đăng nhập
  async login(username, password, captchaId = null, captchaAnswer = null) {
    const payload = { username, password };
    if (captchaId && captchaAnswer) {
      payload.captchaId = captchaId;
      payload.captchaAnswer = captchaAnswer;
    }
    const response = await apiClient.post('/api/auth/login', payload);
    return response.data; // { token, type: "Bearer" }
  },

  // Đăng ký tài khoản
  async register(data) {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  // Lấy thông tin người dùng đang đăng nhập
  async getMe() {
    const response = await apiClient.get('/api/users/me');
    return response.data; // { id, username, email, fullName, role, status, ... }
  },

  // Đăng xuất
  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

export default authService;

