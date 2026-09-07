import apiClient from './apiClient';

export const originService = {
  // Lấy danh sách toàn bộ xuất xứ/quốc gia đang hoạt động (Public)
  async getAllOrigins() {
    const response = await apiClient.get('/api/origins');
    return response.data; // List<OriginResponse>
  },

  // Lấy chi tiết xuất xứ theo ID
  async getOriginById(id) {
    const response = await apiClient.get(`/api/origins/${id}`);
    return response.data;
  },

  // Thêm mới xuất xứ (Admin)
  async createOrigin(data) {
    const response = await apiClient.post('/api/admin/origins', data);
    return response.data;
  },

  // Cập nhật xuất xứ (Admin)
  async updateOrigin(id, data) {
    const response = await apiClient.put(`/api/admin/origins/${id}`, data);
    return response.data;
  },

  // Xóa xuất xứ (Admin)
  async deleteOrigin(id) {
    const response = await apiClient.delete(`/api/admin/origins/${id}`);
    return response.data;
  },
};

export default originService;

