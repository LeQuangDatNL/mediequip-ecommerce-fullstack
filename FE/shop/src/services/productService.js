import apiClient from './apiClient';

export const productService = {
  // Lấy danh sách sản phẩm từ Backend (phân trang, tìm kiếm và lọc theo danh mục, mặc định 12 sản phẩm/trang)
  async getProducts(page = 0, keyword = '', categoryId = null, size = 12) {
    const params = { page, size };
    if (keyword && keyword.trim()) {
      params.keyword = keyword.trim();
    }
    if (categoryId) {
      params.categoryId = categoryId;
    }
    const response = await apiClient.get('/api/admin/products', { params });
    return response.data; // Page<ProductResponse> (content, totalElements, totalPages...)
  },

  // Lấy chi tiết sản phẩm theo ID
  async getProductById(id) {
    const response = await apiClient.get(`/api/admin/products/${id}`);
    return response.data;
  },

  // Thêm mới sản phẩm
  async createProduct(data) {
    const response = await apiClient.post('/api/admin/products', data);
    return response.data;
  },

  // Cập nhật sản phẩm
  async updateProduct(id, data) {
    const response = await apiClient.put(`/api/admin/products/${id}`, data);
    return response.data;
  },

  // Xóa sản phẩm
  async deleteProduct(id) {
    const response = await apiClient.delete(`/api/admin/products/${id}`);
    return response.data;
  },

  // Tải file mẫu Excel (.xlsx)
  async downloadExcelTemplate() {
    const response = await apiClient.get('/api/admin/products/excel-template', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'mau_nhap_san_pham.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Nhập sản phẩm hàng loạt từ file Excel
  async importProductsExcel(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/admin/products/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { totalRows, successCount, errorCount, errors, importedProducts }
  },

  // Xuất toàn bộ sản phẩm ra file Excel
  async exportProductsExcel() {
    const response = await apiClient.get('/api/admin/products/export-excel', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `danh_sach_san_pham_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export default productService;

