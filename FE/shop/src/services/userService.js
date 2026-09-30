import apiClient from './apiClient';

export const userService = {
  // ================= DÀNH CHO NGƯỜI DÙNG HIỆN TẠI (ME) =================
  // Lấy thông tin tài khoản cá nhân
  getMyProfile: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  // Cập nhật thông tin cá nhân (Họ tên, Email, Số điện thoại)
  updateMyProfile: async (data) => {
    const response = await apiClient.put('/api/users/me', data);
    return response.data;
  },

  // Đổi mật khẩu cá nhân
  changePassword: async (data) => {
    const response = await apiClient.put('/api/users/me/password', data);
    return response.data;
  },

  // ================= DÀNH CHO ADMIN =================
  // Lấy danh sách người dùng có phân trang và tìm kiếm
  getUsers: async (page = 0, keyword = '') => {
    const params = { page };
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },

  // Lấy chi tiết người dùng
  getUserById: async (id) => {
    const response = await apiClient.get(`/api/admin/users/${id}`);
    return response.data;
  },

  // Tạo người dùng mới
  createUser: async (data) => {
    const response = await apiClient.post('/api/admin/users', data);
    return response.data;
  },

  // Cập nhật người dùng
  updateUser: async (id, data) => {
    const response = await apiClient.put(`/api/admin/users/${id}`, data);
    return response.data;
  },

  // Xóa mềm / Khóa tài khoản người dùng
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/admin/users/${id}`);
    return response.data;
  },
};

export default userService;
