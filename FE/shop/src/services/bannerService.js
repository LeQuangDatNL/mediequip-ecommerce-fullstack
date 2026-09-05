import apiClient from './apiClient';

export const bannerService = {
  // Lấy danh sách Banner đang hoạt động (Public - Trang chủ)
  async getActiveBanners() {
    const response = await apiClient.get('/api/banners');
    return response.data; // List<BannerResponse>
  },

  // Lấy toàn bộ Banner (Admin)
  async getAllBanners() {
    const response = await apiClient.get('/api/admin/banners');
    return response.data; // List<BannerResponse>
  },

  // Lấy chi tiết Banner theo ID (Admin)
  async getBannerById(id) {
    const response = await apiClient.get(`/api/admin/banners/${id}`);
    return response.data;
  },

  // Tạo Banner mới (Admin)
  async createBanner(data) {
    const response = await apiClient.post('/api/admin/banners', data);
    return response.data;
  },

  // Cập nhật Banner (Admin)
  async updateBanner(id, data) {
    const response = await apiClient.put(`/api/admin/banners/${id}`, data);
    return response.data;
  },

  // Bật / Tắt trạng thái Banner (Admin)
  async toggleStatus(id) {
    const response = await apiClient.patch(`/api/admin/banners/${id}/status`);
    return response.data;
  },

  // Xóa Banner (Admin)
  async deleteBanner(id) {
    const response = await apiClient.delete(`/api/admin/banners/${id}`);
    return response.data;
  },
};

export default bannerService;

