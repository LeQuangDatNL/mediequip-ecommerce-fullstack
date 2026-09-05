import apiClient from './apiClient';

export const userService = {
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

