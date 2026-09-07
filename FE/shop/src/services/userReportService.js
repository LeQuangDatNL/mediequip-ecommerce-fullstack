import apiClient from './apiClient';

export const userReportService = {
  // 1. Tạo yêu cầu xuất báo cáo Excel mới
  requestReport: async (data) => {
    const response = await apiClient.post('/api/user-reports', data);
    return response.data;
  },

  // 2. Lấy danh sách báo cáo Excel của người dùng
  getMyReports: async () => {
    const response = await apiClient.get('/api/user-reports/my-reports');
    return response.data;
  },

  // 3. Tải file Excel báo cáo hoàn thành
  downloadReport: async (reportId, fileName = 'Bao_Cao_Excel.xlsx') => {
    const response = await apiClient.get(`/api/user-reports/${reportId}/download`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // 4. Xóa báo cáo khỏi lịch sử
  deleteReport: async (reportId) => {
    const response = await apiClient.delete(`/api/user-reports/${reportId}`);
    return response.data;
  },
};

export default userReportService;

