import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imageService from '../../../services/imageService';
import {
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  FileImage,
  Link2,
  Plus,
  Trash2,
  Loader2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUpload = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('files'); // 'files' | 'urls'

  // Tab 1: Upload Files
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);

  // Tab 2: Batch URLs
  const [urlList, setUrlList] = useState([
    { name: '', url: '' },
    { name: '', url: '' },
  ]);
  const [urlUploading, setUrlUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFilesSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một file ảnh để tải lên!');
      return;
    }

    setFileUploading(true);
    try {
      const res = await imageService.uploadFiles(selectedFiles);
      toast.success(`Đã tải lên thành công ${res.length} ảnh vào thư viện!`);
      navigate('/admin/images');
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên!');
    } finally {
      setFileUploading(false);
    }
  };

  const handleAddUrlRow = () => {
    setUrlList((prev) => [...prev, { name: '', url: '' }]);
  };

  const handleRemoveUrlRow = (index) => {
    setUrlList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index, field, value) => {
    setUrlList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleUrlsSubmit = async (e) => {
    e.preventDefault();
    const validItems = urlList.filter((item) => item.url && item.url.trim());
    if (validItems.length === 0) {
      toast.error('Vui lòng nhập ít nhất một đường dẫn URL hợp lệ!');
      return;
    }

    const payload = validItems.map((item, idx) => ({
      name: item.name.trim() || `Image-${Date.now()}-${idx + 1}`,
      url: item.url.trim(),
      fileType: 'image/jpeg',
      fileSize: 0,
    }));

    setUrlUploading(true);
    try {
      const res = await imageService.addBatchUrls(payload);
      toast.success(`Đã thêm thành công ${res.length} ảnh từ URL vào thư viện!`);
      navigate('/admin/images');
    } catch (error) {
      console.error('Lỗi khi thêm ảnh từ URL:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm ảnh từ URL!');
    } finally {
      setUrlUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Nút Quay lại */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/images"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện Ảnh</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Tải Ảnh Lên Thư Viện (Upload Media)</h1>
            <p className="text-xs text-gray-500">
              Tải nhiều ảnh từ máy tính hoặc nhập danh sách URL để sử dụng chung cho nhiều sản phẩm.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setTab('files')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'files'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>Tải Lên File Từ Máy Tính</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('urls')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              tab === 'urls'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Nhập Hàng Loạt URL Online</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD FILES */}
        {tab === 'files' && (
          <form onSubmit={handleFilesSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-3xl p-10 text-center bg-gray-50/50 space-y-4 transition">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800">Chọn hoặc kéo thả nhiều file ảnh cùng lúc</p>
                <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG, WEBP, GIF (Server tự động phân giải link và lưu trữ)</p>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer max-w-sm mx-auto"
              />

              {selectedFiles.length > 0 && (
                <div className="pt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl inline-block">
                  ✓ Sẵn sàng tải lên <strong>{selectedFiles.length}</strong> tệp ảnh
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/admin/images"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={fileUploading || selectedFiles.length === 0}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {fileUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                <span>{fileUploading ? 'Đang Tải Lên Máy Chủ...' : 'Bắt Đầu Tải Lên'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BATCH URLS */}
        {tab === 'urls' && (
          <form onSubmit={handleUrlsSubmit} className="space-y-4">
            <p className="text-xs text-gray-500">
              Nhập tên mô tả và đường dẫn link ảnh từ Unsplash, Cloudinary hoặc website đối tác:
            </p>

            <div className="space-y-3">
              {urlList.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 w-6">#{index + 1}</span>
                  <input
                    type="text"
                    placeholder="Tên ảnh (tùy chọn)"
                    value={item.name}
                    onChange={(e) => handleUrlChange(index, 'name', e.target.value)}
                    className="w-1/3 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    required={index === 0}
                    placeholder="https://images.unsplash.com/photo-..."
                    value={item.url}
                    onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                  {urlList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrlRow(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddUrlRow}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm dòng URL nữa</span>
            </button>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/admin/images"
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={urlUploading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {urlUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{urlUploading ? 'Đang Lưu...' : 'Lưu Danh Sách Ảnh'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

