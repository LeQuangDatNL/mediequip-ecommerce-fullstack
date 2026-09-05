import apiClient from './apiClient';

export const orderService = {
  // Lấy danh sách đơn hàng có phân trang, tìm kiếm và lọc trạng thái
  getOrders: async (page = 0, keyword = '', status = '') => {
    const params = { page };
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    if (status && status !== 'ALL') {
      params.status = status;
    }
    const response = await apiClient.get('/api/admin/orders', { params });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng và thanh toán
  updateOrderStatus: async (id, data) => {
    const response = await apiClient.put(`/api/admin/orders/${id}/status`, data);
    return response.data;
  },

  // Xóa mềm / Hủy đơn hàng
  cancelOrder: async (id) => {
    const response = await apiClient.delete(`/api/admin/orders/${id}`);
    return response.data;
  },
};

export default orderService;

