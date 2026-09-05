import apiClient from './apiClient';

export const categoryService = {
  // Lấy danh sách danh mục có phân trang và tìm kiếm
  async getCategories(page = 0, keyword = '') {
    const response = await apiClient.get('/api/admin/categories', {
      params: { page, keyword }
    });
    return response.data; // Page<CategoryResponse>: { content, totalPages, totalElements, ... }
  },

  // Lấy toàn bộ danh mục không phân trang (dùng cho dropdown chọn danh mục)
  async getAllCategories() {
    const response = await apiClient.get('/api/admin/categories/all');
    return response.data; // List<CategoryResponse>
  },

  // Lấy chi tiết danh mục theo ID
  async getCategoryById(id) {
    const response = await apiClient.get(`/api/admin/categories/${id}`);
    return response.data;
  },

  // Thêm mới danh mục
  async createCategory(data) {
    const response = await apiClient.post('/api/admin/categories', data);
    return response.data;
  },

  // Cập nhật danh mục
  async updateCategory(id, data) {
    const response = await apiClient.put(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  // Xóa danh mục
  async deleteCategory(id) {
    const response = await apiClient.delete(`/api/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
