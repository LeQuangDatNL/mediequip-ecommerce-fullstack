import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import reviewService from '../../../services/reviewService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Search,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  Package,
  ShieldCheck,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleImageError, DEFAULT_NO_IMAGE } from '../../../utils/imageHelper';

export const ReviewIndex = () => {
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_reviews_filter', {
    page: 0,
    keyword: '',
  });

  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal Chi tiết bình luận
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        keyword: keyword || '',
      };
      if (selectedRating) {
        params.rating = Number(selectedRating);
      }
      if (selectedStatus !== 'ALL') {
        params.status = selectedStatus;
      }

      const response = await reviewService.getAdminReviews(params);
      if (response && response.content) {
        setReviews(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setReviews(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setReviews([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bình luận:', error);
      toast.error('Không thể tải danh sách bình luận từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, selectedRating, selectedStatus]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleStatus = async (reviewId) => {
    try {
      const updated = await reviewService.toggleReviewStatus(reviewId);
      toast.success(
        updated.isDeleted
          ? 'Đã ẩn bình luận khỏi trang sản phẩm!'
          : 'Đã bỏ ẩn và hiển thị lại bình luận công khai!'
      );
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isDeleted: updated.isDeleted } : r))
      );
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi trạng thái bình luận!');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Đã xóa bình luận thành công!');
      fetchReviews();
    } catch (error) {
      toast.error('Không thể xóa bình luận!');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-[11px] font-bold text-gray-700 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <span>Quản Lý Bình Luận & Đánh Giá Sản Phẩm</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi, kiểm duyệt và quản lý toàn bộ đánh giá của khách hàng về thiết bị y tế trên website.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* 2. Thanh tìm kiếm & Bộ lọc nâng cao */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-96">
            <SearchBar
              keyword={keyword}
              onSearch={onSearch}
              reset={reset}
              placeholder="Tìm theo nội dung, tên người dùng, sản phẩm..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Lọc số sao */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Tất cả đánh giá sao</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
              <option value="4">⭐⭐⭐⭐ 4 sao</option>
              <option value="3">⭐⭐⭐ 3 sao</option>
              <option value="2">⭐⭐ 2 sao</option>
              <option value="1">⭐ 1 sao</option>
            </select>

            {/* Lọc trạng thái ẩn/hiện */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hiển thị</option>
              <option value="HIDDEN">Đã ẩn / Xóa</option>
            </select>

            {(keyword || selectedRating || selectedStatus !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedRating('');
                  setSelectedStatus('ALL');
                }}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bảng dữ liệu Bình luận */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500">Đang tải danh sách bình luận...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center space-y-3 max-w-md mx-auto">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Không tìm thấy bình luận nào</h3>
            <p className="text-xs text-gray-400">
              Không có bình luận nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Người Bình Luận</th>
                  <th className="px-5 py-3.5">Thiết Bị Y Tế</th>
                  <th className="px-5 py-3.5">Đánh Giá</th>
                  <th className="px-5 py-3.5">Nội Dung Bình Luận</th>
                  <th className="px-5 py-3.5">Thời Gian</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-4 font-bold text-gray-500">#{r.id}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong className="text-gray-900 block font-semibold">{r.userName || 'Người dùng'}</strong>
                          <span className="text-[10px] text-gray-400">{r.userEmail || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <img
                          src={r.productImage || DEFAULT_NO_IMAGE}
                          alt={r.productName}
                          onError={handleImageError}
                          className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                        <Link
                          to={`/products/${r.productId}`}
                          target="_blank"
                          className="font-semibold text-gray-800 hover:text-indigo-600 transition truncate"
                          title={r.productName}
                        >
                          {r.productName || `Sản phẩm #${r.productId}`}
                        </Link>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {renderStars(r.rating || 5)}
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-gray-800 line-clamp-2 leading-relaxed">{r.comment}</p>
                    </td>

                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {r.isDeleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          <EyeOff className="w-3 h-3" />
                          Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Hiển thị
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Xem chi tiết */}
                      <button
                        type="button"
                        onClick={() => setSelectedReview(r)}
                        className="inline-flex p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                        title="Xem chi tiết bình luận"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Ẩn / Hiện */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(r.id)}
                        className={`inline-flex p-1.5 rounded-lg transition cursor-pointer ${
                          r.isDeleted
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title={r.isDeleted ? 'Hiển thị lại bình luận' : 'Ẩn bình luận'}
                      >
                        {r.isDeleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Xóa */}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân Trang */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>

      {/* 4. Modal Chi Tiết Bình Luận */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Chi Tiết Đánh Giá #{selectedReview.id}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Người đánh giá */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <span className="font-bold text-gray-700 block">Thông tin người đánh giá:</span>
                <p>Họ tên: <strong className="text-gray-900">{selectedReview.userName || 'N/A'}</strong></p>
                <p>Email: <strong className="text-gray-900">{selectedReview.userEmail || 'N/A'}</strong></p>
                <p>Thời gian: <strong className="text-gray-900">{new Date(selectedReview.createdAt).toLocaleString('vi-VN')}</strong></p>
              </div>

              {/* Sản phẩm */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
                <img
                  src={selectedReview.productImage || DEFAULT_NO_IMAGE}
                  alt={selectedReview.productName}
                  onError={handleImageError}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <strong className="text-gray-900 font-bold block">{selectedReview.productName}</strong>
                  <Link
                    to={`/products/${selectedReview.productId}`}
                    target="_blank"
                    className="text-indigo-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Xem trang sản phẩm</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Số sao & Nội dung */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">Đánh giá sao:</span>
                  {renderStars(selectedReview.rating || 5)}
                </div>
                <div className="border-t border-indigo-100 pt-2">
                  <span className="font-bold text-gray-700 block mb-1">Nội dung nhận xét:</span>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-indigo-100">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus(selectedReview.id);
                  setSelectedReview(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                  selectedReview.isDeleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {selectedReview.isDeleted ? 'Hiển thị lại bình luận' : 'Ẩn bình luận này'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewIndex;

