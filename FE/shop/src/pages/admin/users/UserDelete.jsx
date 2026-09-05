import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import userService from '../../../services/userService';
import { UserX, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const UserDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userService.getUserById(id);
        setUser(data);
      } catch (error) {
        console.error('Lỗi tải người dùng:', error);
        toast.error('Không tìm thấy tài khoản người dùng!');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.deleteUser(id);
      toast.success(`Đã xóa mềm / khóa tài khoản "${user?.fullName}" thành công!`);
      navigate('/admin/users');
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể khóa tài khoản này!';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh sách Người dùng</span>
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">Xóa Mềm (Khóa) Tài Khoản</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống áp dụng <strong>Xóa Mềm (Soft Delete)</strong>: Tài khoản sẽ chuyển sang trạng thái <code>BANNED</code> (Vô hiệu hóa đăng nhập) nhưng toàn bộ lịch sử đơn hàng và đánh giá vẫn được bảo toàn trọn vẹn.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Đang tải thông tin tài khoản...</p>
          </div>
        ) : user && (
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Mã ID:</span>
              <span className="font-bold text-indigo-600">#{user.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Họ và tên:</span>
              <span className="font-bold text-gray-900">{user.fullName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Tên đăng nhập:</span>
              <span className="font-mono text-gray-700">@{user.username}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Vai trò:</span>
              <span className="font-semibold text-purple-600">{user.role}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Trạng thái hiện tại:</span>
              <span className={`font-semibold ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}`}>
                {user.status}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/admin/users"
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
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <UserX className="w-4 h-4" />
            )}
            <span>Xác Nhận Xóa Mềm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDelete;

