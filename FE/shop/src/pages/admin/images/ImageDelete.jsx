import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import imageService from '../../../services/imageService';
import { Trash2, ArrowLeft, EyeOff, FileImage, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const data = await imageService.getImageById(id);
        setImage(data);
      } catch (error) {
        console.error('Lỗi tải ảnh:', error);
        toast.error('Không tìm thấy ảnh để xóa!');
        navigate('/admin/images');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImage();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await imageService.deleteImage(id);
      toast.success(`Đã xóa mềm ảnh "${image?.name}" khỏi thư viện!`);
      navigate('/admin/images');
    } catch (error) {
      console.error('Lỗi xóa ảnh:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa ảnh này!');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/images"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện Ảnh</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <EyeOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Xác Nhận Xóa Mềm Ảnh</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống áp dụng <strong>Xóa Mềm (Soft Delete)</strong>: Tệp ảnh sẽ được chuyển <code>is_deleted = true</code> và ẩn khỏi thư viện ảnh khả dụng.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
            <p className="text-xs text-gray-400">Đang tải thông tin ảnh...</p>
          </div>
        ) : (
          image && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-3">
              <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tên tệp:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[200px]" title={image.name}>
                    {image.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Định dạng:</span>
                  <span className="font-mono text-gray-600">{image.fileType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dung lượng:</span>
                  <span className="font-semibold text-gray-800">{formatFileSize(image.fileSize)}</span>
                </div>
              </div>
            </div>
          )
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/admin/images"
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition text-center"
          >
            Hủy Bỏ
          </Link>
          <button
            type="button"
            disabled={deleting || loading}
            onClick={handleDelete}
            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Xác Nhận Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDelete;

