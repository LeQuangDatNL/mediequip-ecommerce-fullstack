import apiClient from './apiClient';

export const imageService = {
  // Lấy danh sách ảnh phân trang và tìm kiếm
  getImages: async (page = 0, size = 12, keyword = '') => {
    const params = { page, size };
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    const response = await apiClient.get('/api/admin/images', { params });
    return response.data;
  },

  // Xem chi tiết 1 ảnh
  getImageById: async (id) => {
    const response = await apiClient.get(`/api/admin/images/${id}`);
    return response.data;
  },

  // Tải lên hàng loạt file ảnh từ máy tính (Multipart/form-data)
  uploadFiles: async (fileList) => {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }
    const response = await apiClient.post('/api/admin/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Thêm hàng loạt ảnh từ danh sách link URL
  addBatchUrls: async (images) => {
    const response = await apiClient.post('/api/admin/images/batch-urls', { images });
    return response.data;
  },

  // Xóa mềm ảnh
  deleteImage: async (id) => {
    const response = await apiClient.delete(`/api/admin/images/${id}`);
    return response.data;
  },
};

export default imageService;
