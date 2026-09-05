import apiClient from './apiClient';

export const consultationService = {
  // Khách hàng gửi yêu cầu tư vấn & file báo giá (Public)
  async submitConsultation(formData) {
    const response = await apiClient.post('/api/consultations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin lấy danh sách yêu cầu tư vấn (Phân trang & Lọc)
  async getConsultations(page = 0, keyword = '', status = '') {
    const params = { page };
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    if (status && status !== 'ALL') params.status = status;
    const response = await apiClient.get('/api/admin/consultations', { params });
    return response.data;
  },

  // Admin xem chi tiết yêu cầu tư vấn
  async getConsultationById(id) {
    const response = await apiClient.get(`/api/admin/consultations/${id}`);
    return response.data;
  },

  // Admin cập nhật trạng thái & ghi chú
  async updateStatus(id, data) {
    const response = await apiClient.put(`/api/admin/consultations/${id}/status`, data);
    return response.data;
  },

  // Admin xóa yêu cầu tư vấn
  async deleteConsultation(id) {
    const response = await apiClient.delete(`/api/admin/consultations/${id}`);
    return response.data;
  },
};

export default consultationService;

