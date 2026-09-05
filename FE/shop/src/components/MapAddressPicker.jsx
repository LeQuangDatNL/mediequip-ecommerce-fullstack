import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import addressService from '../services/addressService';
import {
  MapPin,
  Crosshair,
  Search,
  X,
  Check,
  Navigation,
  Loader2,
  Building,
  Map as MapIcon,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MapAddressPicker = ({ isOpen, onClose, onSelectAddress, initialCoords }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Mặc định: Hà Nội (21.028511, 105.854444) hoặc Hồ Chí Minh (10.7769, 106.7009)
  const defaultLat = initialCoords?.lat || 21.028511;
  const defaultLon = initialCoords?.lon || 105.854444;

  const [currentCoords, setCurrentCoords] = useState({ lat: defaultLat, lon: defaultLon });
  const [addressInfo, setAddressInfo] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [locatingGPS, setLocatingGPS] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Khởi tạo và quản lý bản đồ Leaflet
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Custom Map Marker Icon HTML
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; background-color: rgba(19, 99, 107, 0.25); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #13636b 0%, #0d464c 100%); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35);">
            <div style="width: 9px; height: 9px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    // Nếu chưa khởi tạo bản đồ
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lon],
        zoom: 15,
        zoomControl: true,
      });

      // Lớp bản đồ OpenStreetMap chuẩn
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Thêm Marker
      const marker = L.marker([currentCoords.lat, currentCoords.lon], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      // Sự kiện click trên bản đồ để di chuyển Marker
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCurrentCoords({ lat, lon: lng });
        handleFetchAddress(lat, lng);
      });

      // Sự kiện kéo thả Marker
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setCurrentCoords({ lat, lon: lng });
        handleFetchAddress(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Lấy địa chỉ ban đầu
      handleFetchAddress(currentCoords.lat, currentCoords.lon);
    } else {
      mapInstanceRef.current.invalidateSize();
    }

    return () => {
      // Dọn dẹp bản đồ khi unmount modal
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  // Giải mã tọa độ sang địa chỉ
  const handleFetchAddress = async (lat, lon) => {
    setLoadingAddress(true);
    try {
      const info = await addressService.reverseGeocode(lat, lon);
      setAddressInfo(info);
    } catch (err) {
      console.error('Lỗi lấy địa chỉ:', err);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Nút "Lấy vị trí hiện tại" (HTML5 Geolocation)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt của bạn không hỗ trợ định vị GPS!');
      return;
    }

    setLocatingGPS(true);
    const toastId = toast.loading('Đang lấy vị trí GPS hiện tại của bạn...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCurrentCoords({ lat, lon });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lon], 16, { animate: true });
          markerRef.current.setLatLng([lat, lon]);
        }

        handleFetchAddress(lat, lon);
        setLocatingGPS(false);
        toast.success('Đã xác định vị trí hiện tại thành công!', { id: toastId });
      },
      (error) => {
        setLocatingGPS(false);
        console.warn('Lỗi Geolocation:', error);
        let msg = 'Không thể lấy vị trí hiện tại';
        if (error.code === 1) msg = 'Bạn đã từ chối quyền truy cập vị trí trên trình duyệt.';
        else if (error.code === 2) msg = 'Không xác định được tín hiệu GPS.';
        else if (error.code === 3) msg = 'Hết thời gian chờ định vị GPS.';
        toast.error(msg, { id: toastId });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Tìm kiếm địa điểm
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const results = await addressService.searchLocation(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast('Không tìm thấy địa điểm phù hợp ở Việt Nam');
      }
    } catch (err) {
      toast.error('Lỗi khi tìm kiếm địa điểm');
    } finally {
      setSearching(false);
    }
  };

  // Chọn kết quả từ danh sách tìm kiếm
  const handleSelectSearchResult = (res) => {
    const lat = Number(res.lat);
    const lon = Number(res.lon);

    setCurrentCoords({ lat, lon });
    setSearchResults([]);
    setSearchQuery(res.display_name);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lon], 16, { animate: true });
      markerRef.current.setLatLng([lat, lon]);
    }

    handleFetchAddress(lat, lon);
  };

  // Xác nhận vị trí đã chọn
  const handleConfirm = () => {
    if (!addressInfo) {
      toast.error('Chưa xác định được địa chỉ. Vui lòng bấm chọn trên bản đồ!');
      return;
    }

    onSelectAddress({
      province: addressInfo.province || '',
      district: addressInfo.district || '',
      ward: addressInfo.ward || '',
      addressDetail: addressInfo.addressDetail || '',
      fullAddress: addressInfo.displayName || '',
      lat: currentCoords.lat,
      lon: currentCoords.lon,
    });

    toast.success('Đã áp dụng vị trí và điền thông tin địa chỉ!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-teal-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Chọn Vị Trí Giao Hàng Trên Bản Đồ (Map Picker)
              </h3>
              <p className="text-[11px] text-teal-200">
                Click hoặc kéo thả ghim đến vị trí chính xác của bạn.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh công cụ: Tìm kiếm & Vị trí hiện tại */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between relative z-20">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên đường, tòa nhà, bệnh viện, phòng khám..."
                className="w-full pl-9 pr-20 py-2.5 bg-white rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-teal-700 outline-none shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                {searching ? 'Đang tìm...' : 'Tìm'}
              </button>
            </div>

            {/* Menu kết quả tìm kiếm */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl max-h-48 overflow-y-auto z-30 divide-y divide-gray-100">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full p-2.5 text-left text-xs hover:bg-teal-50 transition flex items-start gap-2 cursor-pointer"
                  >
                    <Building className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span className="line-clamp-1 text-gray-700 font-medium">
                      {item.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Nút Lấy vị trí GPS hiện tại */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={locatingGPS}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {locatingGPS ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            <span>Vị trí hiện tại của tôi</span>
          </button>
        </div>

        {/* Khung Bản đồ Leaflet */}
        <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] w-full bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Badge gợi ý thao tác */}
          <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-[11px] text-gray-700 font-medium pointer-events-none flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-teal-700" />
            <span>Kéo hoặc click chuột để ghim vị trí nhận hàng</span>
          </div>
        </div>

        {/* Footer: Thông tin địa chỉ đã giải mã & Nút xác nhận */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <MapIcon className="w-3.5 h-3.5 text-teal-700" />
              <span>Địa chỉ đã xác định:</span>
              {loadingAddress && (
                <span className="text-[10px] text-teal-600 font-normal flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang giải mã...
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 font-medium line-clamp-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
              {addressInfo?.displayName ||
                `Tọa độ: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lon.toFixed(5)}`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loadingAddress}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Áp Dụng Địa Chỉ Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapAddressPicker;

