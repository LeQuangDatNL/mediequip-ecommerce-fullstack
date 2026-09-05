import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import imageService from '../../../services/imageService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
  FileImage,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageIndex = () => {
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_images_filter', {
    page: 0,
    keyword: '',
  });

  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const fetchImages = useCallback(async () => {
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
      } else {
        setImages([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách ảnh:', error);
      toast.error('Không thể tải thư viện ảnh từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Đã sao chép link ảnh vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header & Nút Tải Lên Hàng Loạt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Thư Viện Ảnh (Media Gallery Index)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý kho hình ảnh dùng chung cho sản phẩm, hỗ trợ upload hàng loạt và tái sử dụng.
          </p>
        </div>

        <Link
          to="/admin/images/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Tải Ảnh Hàng Loạt (Upload Media)</span>
        </Link>
      </div>

      {/* Thanh Tìm Kiếm + Thông Tin Tổng Số */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96 flex items-center gap-2">
          <SearchBar
            value={keyword}
            onSearch={onSearch}
            placeholder="Tìm kiếm theo tên ảnh..."
            className="w-full"
          />
          {keyword && (
            <button
              type="button"
              onClick={reset}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition cursor-pointer shrink-0"
              title="Đặt lại tìm kiếm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500 font-medium self-end md:self-center">
          Tổng cộng: <strong className="text-gray-900">{totalElements}</strong> tệp hình ảnh
        </div>
      </div>

      {/* Lưới Thư Viện Hình Ảnh (Media Grid) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải thư viện ảnh...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileImage className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Thư viện ảnh chưa có tệp nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Không tìm thấy ảnh phù hợp với từ khóa.' : 'Bấm "Tải Ảnh Hàng Loạt" để nạp ảnh vào thư viện.'}
            </p>
            {!keyword && (
              <Link
                to="/admin/images/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Tải ảnh lên ngay</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group bg-white border border-gray-200 hover:border-indigo-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-xs">
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-600 hover:text-indigo-600 transition"
                      title="Mở ảnh gốc trong tab mới"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(img.url, img.id)}
                      className="p-1 text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                      title="Sao chép link ảnh"
                    >
                      {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Info & Delete Action */}
                <div className="p-3 space-y-1">
                  <p className="text-xs font-bold text-gray-800 truncate" title={img.name}>
                    {img.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span>{formatFileSize(img.fileSize)}</span>
                    <Link
                      to={`/admin/images/delete/${img.id}`}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-md transition"
                      title="Xóa mềm ảnh này (Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân Trang << < 1 2 3 ... n > >> */}
        {totalPages > 1 && (
          <div className="p-4 mt-6 border-t border-gray-100 bg-gray-50/50 rounded-xl">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isZeroIndexed={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageIndex;

