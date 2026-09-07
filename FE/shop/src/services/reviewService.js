import apiClient from './apiClient';

export const reviewService = {
  // 1. Lấy danh sách đánh giá của sản phẩm (Public)
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/api/products/${productId}/reviews`);
    return response.data;
  },

  // 2. Gửi bình luận đánh giá sản phẩm (Customer)
  createReview: async (productId, data) => {
    const response = await apiClient.post(`/api/products/${productId}/reviews`, data);
    return response.data;
  },

  // ==================== DÀNH CHO ADMIN ====================
  // 3. Admin lấy danh sách & tìm kiếm, lọc bình luận
  getAdminReviews: async (params = {}) => {
    const response = await apiClient.get('/api/admin/reviews', { params });
    return response.data;
  },

  // 4. Admin ẩn hoặc hiện lại bình luận (Toggle status)
  toggleReviewStatus: async (reviewId) => {
    const response = await apiClient.put(`/api/admin/reviews/${reviewId}/toggle-status`);
    return response.data;
  },

  // 5. Admin xóa bình luận (Soft delete)
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/api/admin/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
