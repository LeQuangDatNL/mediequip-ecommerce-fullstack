import apiClient from './apiClient';
import axios from 'axios';

export const addressService = {
  // Lấy danh sách địa chỉ của người dùng hiện tại
  async getMyAddresses() {
    const response = await apiClient.get('/api/users/me/addresses');
    return response.data; // List<AddressResponse>
  },

  // Thêm địa chỉ mới
  async createAddress(data) {
    const response = await apiClient.post('/api/users/me/addresses', data);
    return response.data;
  },

  // Cập nhật địa chỉ
  async updateAddress(id, data) {
    const response = await apiClient.put(`/api/users/me/addresses/${id}`, data);
    return response.data;
  },

  // Xóa địa chỉ
  async deleteAddress(id) {
    const response = await apiClient.delete(`/api/users/me/addresses/${id}`);
    return response.data;
  },

  // Giải mã tọa độ GPS thành địa chỉ hành chính Việt Nam (Reverse Geocoding qua OpenStreetMap Nominatim)
  async reverseGeocode(lat, lon) {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=vi`,
        {
          headers: {
            'Accept-Language': 'vi,en;q=0.9',
          },
          timeout: 8000,
        }
      );

      const address = res.data?.address || {};
      const displayName = res.data?.display_name || '';

      // Trích xuất Tỉnh/Thành phố
      const province =
        address.city ||
        address.province ||
        address.state ||
        address.region ||
        '';

      // Trích xuất Quận/Huyện/Thị xã
      const district =
        address.district ||
        address.suburb ||
        address.county ||
        address.city_district ||
        '';

      // Trích xuất Phường/Xã/Thị trấn
      const ward =
        address.quarter ||
        address.neighbourhood ||
        address.village ||
        address.hamlet ||
        '';

      // Trích xuất Số nhà & Tên đường
      const road = address.road || '';
      const houseNumber = address.house_number || '';
      const addressDetail = [houseNumber, road].filter(Boolean).join(' ') || displayName.split(',')[0] || '';

      return {
        province,
        district,
        ward,
        addressDetail,
        displayName,
        lat: Number(lat),
        lon: Number(lon),
      };
    } catch (err) {
      console.warn('Lỗi reverse geocoding OpenStreetMap:', err);
      return {
        province: '',
        district: '',
        ward: '',
        addressDetail: '',
        displayName: `Tọa độ: ${lat.toFixed(5)}, ${lon.toFixed(5)}`,
        lat: Number(lat),
        lon: Number(lon),
      };
    }
  },

  // Tìm kiếm địa điểm theo tên trên OpenStreetMap
  async searchLocation(query) {
    try {
      if (!query || !query.trim()) return [];
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&addressdetails=1&limit=5&accept-language=vi`,
        {
          headers: {
            'Accept-Language': 'vi,en;q=0.9',
          },
          timeout: 8000,
        }
      );
      return res.data || [];
    } catch (err) {
      console.warn('Lỗi tìm kiếm địa điểm:', err);
      return [];
    }
  },
};

export default addressService;

