import apiClient from './apiClient';

export const reviewService = {
  // Lấy danh sách bình luận & đánh giá của một sản phẩm
  async getReviews(productId) {
    const response = await apiClient.get(`/api/products/${productId}/reviews`);
    return response.data;
  },

  // Khách hàng gửi đánh giá sao & bình luận
  async submitReview(productId, data) {
    const response = await apiClient.post(`/api/products/${productId}/reviews`, data);
    return response.data;
  },

  // Admin xóa bình luận
  async deleteReview(reviewId) {
    const response = await apiClient.delete(`/api/admin/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;

