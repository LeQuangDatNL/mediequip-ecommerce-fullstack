import React, { useState, useEffect, useCallback } from 'react';
import imageService from '../services/imageService';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Search,
  RotateCcw,
  Sparkles,
  Link2,
  FileImage,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageSelectorModal = ({ isOpen, onClose, onSelectImage, currentImageUrl = '' }) => {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'upload' | 'url'
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl || '');
  const [customUrl, setCustomUrl] = useState('');

  // Upload state
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Tải danh sách ảnh từ thư viện
  const fetchGalleryImages = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const data = await imageService.getImages(page, 12, keyword);
      if (data && data.content) {
        setImages(data.content);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else if (Array.isArray(data)) {
        setImages(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (error) {
      console.error('Lỗi khi tải thư viện ảnh:', error);
      toast.error('Không thể tải danh sách ảnh từ thư viện!');
    } finally {
      setLoading(false);
    }
  }, [isOpen, page, keyword]);

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentImageUrl || '');
      fetchGalleryImages();
    }
  }, [isOpen, fetchGalleryImages, currentImageUrl]);

  if (!isOpen) return null;

  const handleSelectAndConfirm = (url) => {
    onSelectImage(url);
    onClose();
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFiles || uploadFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file ảnh để tải lên!');
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = await imageService.uploadFiles(uploadFiles);
      toast.success(`Đã tải lên thành công ${uploadedImages.length} ảnh vào thư viện!`);
      setUploadFiles([]);
      if (uploadedImages.length > 0) {
        setSelectedUrl(uploadedImages[0].url);
      }
      setActiveTab('gallery');
      setPage(0);
      fetchGalleryImages();
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên!');
    } finally {
      setUploading(false);
    }
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      toast.error('Vui lòng nhập đường dẫn URL hợp lệ!');
      return;
    }
    handleSelectAndConfirm(customUrl.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Thư Viện Ảnh (Media Gallery)</h2>
              <p className="text-xs text-gray-500">Chọn ảnh có sẵn hoặc tải ảnh mới lên cho sản phẩm</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 px-6 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>Kho Thư Viện ({totalElements})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Tải Ảnh Mới Lên Máy Chủ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Nhập Trực Tiếp URL</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {/* TAB 1: KHO THƯ VIỆN ẢNH */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Search bar inside modal */}
              <div className="flex items-center gap-2">
                <SearchBar
                  value={keyword}
                  onSearch={(val) => {
                    setKeyword(val);
                    setPage(0);
                  }}
                  placeholder="Tìm kiếm theo tên ảnh..."
                  className="w-full sm:w-80"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword('');
                      setPage(0);
                    }}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
                    title="Đặt lại tìm kiếm"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs text-gray-500">Đang tải danh sách ảnh...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-gray-100 p-8">
                  <FileImage className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">Chưa có hình ảnh nào trong thư viện</p>
                  <p className="text-xs text-gray-400">Hãy chuyển sang tab "Tải Ảnh Mới Lên" để thêm ảnh đầu tiên.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Tải ảnh lên ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img) => {
                    const isSelected = selectedUrl === img.url;
                    return (
                      <div
                        key={img.id}
                        onClick={() => setSelectedUrl(img.url)}
                        onDoubleClick={() => handleSelectAndConfirm(img.url)}
                        className={`group relative rounded-2xl overflow-hidden border-2 bg-white cursor-pointer transition flex flex-col shadow-2xs ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-2xs flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                                <Check className="w-5 h-5 stroke-[3]" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-[11px] font-semibold text-gray-800 truncate" title={img.name}>
                            {img.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{img.fileType || 'image'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isZeroIndexed={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TẢI ẢNH MỚI LÊN */}
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-3xl p-8 text-center bg-white space-y-4 transition">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">Chọn hoặc kéo thả nhiều file ảnh từ máy tính</p>
                  <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 10MB mỗi ảnh)</p>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setUploadFiles(e.target.value ? Array.from(e.target.files) : [])}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer max-w-sm mx-auto"
                />

                {uploadFiles.length > 0 && (
                  <div className="pt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl inline-block">
                    ✓ Đã chọn {uploadFiles.length} file ảnh sẵn sàng tải lên
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadFiles([])}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
                >
                  Xóa Lựa Chọn
                </button>
                <button
                  type="submit"
                  disabled={uploading || uploadFiles.length === 0}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  <span>{uploading ? 'Đang Tải Lên...' : 'Tải Lên Thư Viện'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NHẬP TRỰC TIẾP URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleCustomUrlSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Đường Dẫn URL Hình Ảnh (Online URL)
                </label>
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {customUrl && (
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <p className="text-[11px] font-semibold text-gray-500">Xem trước ảnh:</p>
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-white border border-gray-200">
                    <img
                      src={customUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Sử Dụng URL Này</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <div className="text-xs text-gray-500 truncate max-w-sm">
            {selectedUrl ? (
              <span>Ảnh đang chọn: <strong className="text-indigo-600 font-mono truncate">{selectedUrl}</strong></span>
            ) : (
              <span>Chưa chọn ảnh nào</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={() => handleSelectAndConfirm(selectedUrl)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác Nhận Chọn Ảnh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;

