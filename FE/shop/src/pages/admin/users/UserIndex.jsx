import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../../services/userService';
import usePaginationSearch from '../../../hooks/usePaginationSearch';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/SearchBar';
import {
  Users,
  Plus,
  Edit2,
  UserX,
  RotateCcw,
  Shield,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UserIndex = () => {
  const { page, setPage, keyword, onSearch, reset } = usePaginationSearch('admin_users_filter', {
    page: 0,
    keyword: '',
  });

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(page, keyword);
      if (response && response.content) {
        setUsers(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setUsers(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setUsers([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      toast.error('Không thể tải danh sách người dùng từ Backend!');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      {/* Header & Nút Thêm Mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Danh Sách Người Dùng (User Index)</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Giao diện quản lý tài khoản khách hàng và phân quyền quản trị viên.
          </p>
        </div>

        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người Dùng Mới (Create)</span>
        </Link>
      </div>

      {/* Thanh Tìm Kiếm + Thông Tin Tổng Số */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-96 flex items-center gap-2">
          <SearchBar
            value={keyword}
            onSearch={onSearch}
            placeholder="Tìm theo họ tên hoặc số điện thoại..."
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
          Tổng cộng: <strong className="text-gray-900">{totalElements}</strong> tài khoản
        </div>
      </div>

      {/* Bảng Danh Sách Người Dùng */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Đang tải người dùng từ Backend...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <UserX className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">Không tìm thấy người dùng nào</p>
            <p className="text-xs text-gray-400">
              {keyword ? 'Thử tìm với từ khóa khác hoặc bấm đặt lại bộ lọc.' : 'Chưa có tài khoản người dùng nào.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 w-16">ID</th>
                  <th className="px-6 py-3.5">Họ Và Tên</th>
                  <th className="px-6 py-3.5">Tên Đăng Nhập</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Số Điện Thoại</th>
                  <th className="px-6 py-3.5">Vai Trò</th>
                  <th className="px-6 py-3.5">Trạng Thái</th>
                  <th className="px-6 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-bold text-indigo-600">#{u.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{u.fullName}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">@{u.username}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">{u.phone || <span className="text-gray-300 italic">Chưa có</span>}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" />
                            Đã khóa (BANNED)
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/users/update/${u.id}`}
                        className="inline-flex p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Chỉnh sửa người dùng (Update)"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/users/delete/${u.id}`}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa mềm / Khóa tài khoản (Delete)"
                      >
                        <UserX className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân Trang << < 1 2 3 ... n > >> */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isZeroIndexed={true}
          />
        </div>
      </div>
    </div>
  );
};

export default UserIndex;

