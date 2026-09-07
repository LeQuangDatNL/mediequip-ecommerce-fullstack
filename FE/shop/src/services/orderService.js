import apiClient from './apiClient';

export const orderService = {
  // 1. Khách hàng tạo đơn hàng / gửi yêu cầu báo giá
  createOrder: async (data) => {
    const response = await apiClient.post('/api/orders', data);
    return response.data;
  },

  // 2. Khách hàng xem danh sách đơn hàng của mình
  getMyOrders: async () => {
    const response = await apiClient.get('/api/orders/my-orders');
    return response.data;
  },

  // 3. Khách hàng xem chi tiết đơn hàng
  getCustomerOrderById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  // 4. Tra cứu nhanh đơn hàng theo Mã đơn và Số điện thoại
  trackOrder: async (orderId, phone) => {
    const response = await apiClient.get('/api/orders/track', {
      params: { orderId, phone }
    });
    return response.data;
  },

  // 5. Tải bảng báo giá Excel (.xlsx) cho đơn hàng (Dành cho cả Khách hàng & Admin)
  downloadQuotation: async (orderId) => {
    const response = await apiClient.get(`/api/orders/${orderId}/quotation`, {
      responseType: 'blob'
    });
    
    // Tạo link tải file trên trình duyệt
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Gia_Thiet_Bi_Y_Te_Kim_Lien_Don_${orderId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // ==================== DÀNH CHO ADMIN ====================
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

  // Lấy chi tiết đơn hàng (Admin)
  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/admin/orders/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng và thanh toán (Admin)
  updateOrderStatus: async (id, data) => {
    const response = await apiClient.put(`/api/admin/orders/${id}/status`, data);
    return response.data;
  },

  // Xóa mềm / Hủy đơn hàng (Admin)
  cancelOrder: async (id) => {
    const response = await apiClient.delete(`/api/admin/orders/${id}`);
    return response.data;
  },
};

export default orderService;
