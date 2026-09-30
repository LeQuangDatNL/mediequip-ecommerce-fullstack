# 📚 Danh Sách Thư Viện Frontend (Tech Stack & Libraries)

Tổng hợp tất cả các thư viện, framework và công nghệ được sử dụng trong phân hệ Frontend (`FE/shop`):

---

## ⚡ 1. Nền Tảng Cốt Lõi (Core Framework & Build Tool)

| Thư viện / Công nghệ | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **React** | `^19.2.8` | Thư viện UI xây dựng giao diện Single Page Application (SPA) hiện đại. |
| **React DOM** | `^19.2.8` | Renderer giao diện React trên môi trường trình duyệt. |
| **Vite** | `^8.2.0` | Build tool và Development Server hiệu năng cao với Hot Module Replacement (HMR). |

---

## 🎨 2. Giao Diện & Thiết Kế UI (Styling & Icons)

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **Tailwind CSS** | `^4.3.3` | Utility-first CSS Framework thế hệ mới nhất, thiết kế giao diện y tế responsive. |
| **@tailwindcss/vite** | `^4.3.3` | Plugin tích hợp trực tiếp Tailwind CSS v4 vào quy trình biên dịch của Vite. |
| **Lucide React** | `^1.33.0` | Bộ icon Vector phong cách hiện đại cho toàn bộ hệ thống (Stethoscope, Shield, Truck,...). |
| **React Icons** | `^5.7.0` | Thư viện bổ sung các bộ icon phổ biến (FontAwesome, Bootstrap Icons, Material Design). |
| **React Hot Toast** | `^2.6.0` | Hiển thị thông báo Toast đẹp mắt khi thêm giỏ hàng, đăng nhập, gửi yêu cầu báo giá. |

---

## 🧭 3. Quản Lý Định Tuyến & State Toàn Cục

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **React Router DOM** | `^7.18.2` | Hệ thống quản lý chuyển trang SPA, URL Parameters, PrivateRoute & AdminRoute. |
| **@reduxjs/toolkit** | `^2.12.0` | Quản lý state tập trung (Redux Store) tối ưu cho các tính năng phức tạp. |
| **React Redux** | `^9.3.0` | Cầu nối giữa React components và Redux store qua các Hooks `useSelector`, `useDispatch`. |
| **@tanstack/react-query** | `^5.101.4` | Quản lý server-state, caching dữ liệu API và tự động re-fetch khi có cập nhật. |

---

## 📝 4. Biểu Mẫu & Kiểm Tra Dữ Liệu (Form Validation)

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **React Hook Form** | `^7.87.0` | Quản lý Form hiệu năng cao, tối ưu re-render, bắt sự kiện realtime mượt mà. |
| **Zod** | `^4.5.4` | Thư viện định nghĩa Schema Validation kiểm tra định dạng email, mật khẩu, số điện thoại VN. |
| **@hookform/resolvers** | `^5.9.1` | Cầu nối tích hợp Zod Schema trực tiếp vào React Hook Form (`zodResolver`). |

---

## 🌐 5. Giao Tiếp API & Trí Tuệ Nhân Tạo (AI)

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **Axios** | `^1.19.0` | HTTP Client xử lý gọi RESTful API, tự động gắn JWT Bearer Token, bắt lỗi toàn cục. |
| **Google Gemini AI** | REST API | Kết nối mô hình `gemini-2.5-flash` phục vụ Bot Chat tư vấn thông số thiết bị y tế 24/7. |

---

## 🗺️ 6. Bản Đồ Tương Tác (Maps & Geolocation)

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **Leaflet** | `^1.9.4` | Thư viện bản đồ tương tác mã nguồn mở OpenStreetMap. |
| **React Leaflet** | `^4.x` | React Components tích hợp Leaflet chọn vị trí giao hàng và định vị cơ sở y tế. |

---

## 🛠️ 7. Công Cụ Phát Triển & Kiểm Tra Mã Nguồn (Dev Tools)

| Thư viện | Phiên bản | Vai trò & Mục đích sử dụng |
|---|---|---|
| **Oxlint** | `^1.75.0` | Linter thế hệ mới siêu nhanh bằng Rust giúp quét và sửa lỗi mã nguồn JavaScript. |
| **PostCSS & Autoprefixer** | `^8.5.26` | Tự động thêm tiền tố CSS tương thích đa trình duyệt. |

---

## 💻 8. Lệnh Cài Đặt Trọn Gói

```bash
# Cài đặt toàn bộ dependencies:
npm install react react-dom react-router-dom axios @reduxjs/toolkit react-redux @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react react-icons react-hot-toast leaflet

# Cài đặt devDependencies:
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite postcss autoprefixer oxlint
```