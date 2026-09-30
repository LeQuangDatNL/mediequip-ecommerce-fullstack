# 📁 Cấu Trúc Thư Mục Frontend (React + Vite)

Cấu trúc chi tiết toàn bộ mã nguồn phân hệ Frontend tại thư mục `FE/shop/`:

```text
FE/shop/
├── public/                                      # Tài nguyên tĩnh phục vụ trực tiếp (Static Assets)
│   ├── Bieu_Mau_Co_The_Dung_Yeu_Cau_Bao_Gia_Thiet_Bi_Y_Te.xlsx # File Excel biểu mẫu yêu cầu báo giá
│   ├── favicon.svg                              # Icon hiển thị trên tab trình duyệt
│   └── vite.svg
│
├── src/                                         # Mã nguồn chính của ứng dụng
│   ├── assets/                                  # Hình ảnh minh họa, banner y tế, SVG
│   │   ├── HeroBanner.jpg                       # Banner trang chủ chính
│   │   ├── medical_consult_banner.jpg           # Banner khu vực tư vấn y tế
│   │   ├── medical_devices_banner.jpg           # Banner danh mục thiết bị
│   │   ├── medical_hero_doctor.jpg              # Hình ảnh bác sĩ chuyên khoa
│   │   └── no-image.svg                         # Ảnh mặc định chất lượng cao khi thiếu ảnh sản phẩm
│   │
│   ├── components/                              # Các UI Components tái sử dụng
│   │   ├── admin/                               # Components chuyên dụng cho trang quản trị Admin
│   │   │   ├── ProductDetailModal.jsx           # Modal xem chi tiết thông tin thiết bị
│   │   │   └── ProductImportModal.jsx           # Modal nhập hàng loạt thiết bị bằng file Excel (.xlsx)
│   │   ├── AddressModal.jsx                     # Modal thêm/sửa địa chỉ giao hàng
│   │   ├── AdminHeader.jsx                      # Thanh điều hướng phía trên của Admin
│   │   ├── AdminSidebar.jsx                     # Thanh menu bên trái Admin (Collapsible groups)
│   │   ├── FloatingChatWidget.jsx               # Bot Chat AI Google Gemini tư vấn trực tiếp 24/7
│   │   ├── FloatingContactWidget.jsx            # Cụm nút liên hệ nhanh (Hotline, Zalo, Messenger)
│   │   ├── Footer.jsx                           # Chân trang thông tin y tế Kim Liên & bản quyền
│   │   ├── Header.jsx                           # Thanh Header khách hàng (Tìm kiếm, Giỏ hàng, Menu)
│   │   ├── ImageSelectorModal.jsx               # Modal chọn ảnh từ thư viện Media Gallery
│   │   ├── Loading.jsx                          # Component hiển thị trạng thái chờ tải dữ liệu
│   │   ├── MapAddressPicker.jsx                 # Bản đồ Leaflet tương tác chọn vị trí giao hàng GPS
│   │   ├── Pagination.jsx                       # Phân trang dữ liệu chuẩn hóa
│   │   ├── SearchBar.jsx                        # Thanh tìm kiếm thông minh
│   │   └── StoreFAQNotice.jsx                   # Khối thông tin hỏi đáp & chính sách y tế
│   │
│   ├── contexts/                                # Quản lý State toàn cục qua React Context
│   │   ├── CartContext.jsx                      # Quản lý giỏ hàng & sản phẩm yêu cầu báo giá
│   │   └── WishlistContext.jsx                  # Quản lý danh sách thiết bị yêu thích
│   │
│   ├── hooks/                                   # Custom React Hooks
│   │   ├── useAuth.jsx                          # Hook quản lý đăng nhập, JWT token & quyền hạn
│   │   └── usePaginationSearch.js               # Hook xử lý tìm kiếm, lọc và phân trang dữ liệu
│   │
│   ├── layouts/                                 # Bố cục giao diện chung (Layout Wrappers)
│   │   ├── AdminLayout.jsx                      # Khung bố cục bảng điều khiển Admin
│   │   └── MainLayout.jsx                       # Khung bố cục người dùng (Header + Outlet + Footer)
│   │
│   ├── pages/                                   # Các màn hình trang giao diện
│   │   ├── admin/                               # Các trang quản trị hệ thống (Admin Pages)
│   │   │   ├── categories/                      # Quản lý danh mục thiết bị (Index, Create, Update)
│   │   │   ├── consultations/                   # Quản lý yêu cầu tư vấn & file đính kèm
│   │   │   ├── dashboard/                       # Bảng điều khiển thống kê doanh thu & đơn hàng
│   │   │   ├── images/                          # Quản lý thư viện hình ảnh (Media Gallery)
│   │   │   ├── orders/                          # Quản lý & duyệt trạng thái đơn hàng
│   │   │   ├── origins/                         # Quản lý xuất xứ / quốc gia sản xuất thiết bị
│   │   │   ├── products/                        # Quản lý sản phẩm (CRUD, Gallery ảnh, Excel Import)
│   │   │   ├── reviews/                         # Quản lý & kiểm duyệt đánh giá của khách hàng
│   │   │   └── users/                           # Quản lý tài khoản người dùng & phân quyền
│   │   ├── auth/                                # Trang xác thực tài khoản
│   │   │   ├── LoginPage.jsx                    # Màn hình đăng nhập bảo mật JWT
│   │   │   └── RegisterPage.jsx                 # Màn hình đăng ký (React Hook Form + Zod Validation)
│   │   ├── customer/                            # Các trang dành cho Khách hàng & Phòng khám
│   │   │   ├── CartPage.jsx                     # Trang giỏ hàng & tạo yêu cầu báo giá
│   │   │   ├── CategoriesPage.jsx               # Trang xem tất cả chuyên khoa y tế
│   │   │   ├── ConsultationPage.jsx             # Trang gửi yêu cầu tư vấn & đính kèm file dự án
│   │   │   ├── ContactPage.jsx                  # Trang liên hệ, bản đồ và phản hồi khách hàng
│   │   │   ├── HomePage.jsx                     # Trang chủ y tế Kim Liên chuyên nghiệp
│   │   │   ├── OrdersPage.jsx                   # Trang thanh toán & xác nhận đặt đơn hàng
│   │   │   ├── ProductDetailPage.jsx            # Chi tiết thông số kỹ thuật & bộ sưu tập ảnh
│   │   │   ├── ProductsPage.jsx                 # Danh mục thiết bị, bộ lọc chuyên khoa & xuất xứ
│   │   │   ├── ProfilePage.jsx                  # Quản lý thông tin cá nhân & sổ địa chỉ
│   │   │   ├── PurchaseHistoryPage.jsx          # Lịch sử theo dõi tiến độ đơn hàng
│   │   │   ├── UserReportsPage.jsx              # Lịch sử theo dõi yêu cầu xuất báo cáo & báo giá
│   │   │   └── WishlistPage.jsx                 # Danh sách thiết bị đã lưu yêu thích
│   │   └── errors/                              # Các trang thông báo lỗi
│   │       ├── NotFoundPage.jsx                 # Trang lỗi 404 (Không tìm thấy trang)
│   │       └── UnauthorizedPage.jsx             # Trang lỗi 403 (Không có quyền truy cập)
│   │
│   ├── routes/                                  # Cấu hình định tuyến (Routing)
│   │   ├── AdminRoute.jsx                       # Route Guard bảo vệ các trang Admin (Yêu cầu role ADMIN)
│   │   ├── AppRoutes.jsx                        # Khai báo cây định tuyến URL toàn ứng dụng
│   │   └── ProtectedRoute.jsx                   # Route Guard yêu cầu đăng nhập
│   │
│   ├── services/                                # Tầng giao tiếp HTTP API với Backend qua Axios
│   │   ├── addressService.js                    # API sổ địa chỉ giao nhận
│   │   ├── aiChatService.js                     # API kết nối Google Gemini AI Chatbot
│   │   ├── apiClient.js                         # Axios Instance cấu hình BaseURL, Interceptors & JWT
│   │   ├── authService.js                       # API đăng nhập, đăng ký, refresh token
│   │   ├── categoryService.js                   # API danh mục thiết bị
│   │   ├── consultationService.js               # API gửi yêu cầu tư vấn & upload file
│   │   ├── imageService.js                      # API quản lý Media Gallery & tải ảnh
│   │   ├── orderService.js                      # API tạo & theo dõi đơn hàng
│   │   ├── originService.js                     # API quản lý xuất xứ sản phẩm (Origin)
│   │   ├── productService.js                    # API danh sách, chi tiết & import Excel sản phẩm
│   │   ├── reviewService.js                     # API gửi & kiểm duyệt đánh giá thiết bị
│   │   ├── userReportService.js                 # API theo dõi & gửi yêu cầu báo cáo
│   │   └── userService.js                       # API quản lý người dùng & thông tin cá nhân
│   │
│   ├── styles/                                  # Cấu hình phong cách CSS bổ sung
│   │
│   ├── utils/                                   # Các hàm tiện ích dùng chung
│   │   ├── formatCurrency.js                    # Định dạng tiền tệ VNĐ chuẩn hóa
│   │   ├── imageHelper.js                       # Xử lý URL ảnh và fallback ảnh mặc định
│   │   ├── quoteTemplateExport.js               # Xuất dữ liệu biểu mẫu báo giá
│   │   └── validationSchemas.js                 # Zod Schemas kiểm tra tính hợp lệ dữ liệu Form
│   │
│   ├── App.css
│   ├── App.jsx                                  # Root Component bao bọc Providers & Routers
│   ├── index.css                                # Tailwind CSS v4 root stylesheet
│   └── main.jsx                                 # Entry Point khởi chạy React 19 Application
│
├── .dockerignore                                # Loại trừ node_modules, dist khi build Docker
├── .env.example                                 # File mẫu biến môi trường Frontend
├── .oxlintrc.json                               # Cấu hình Oxlint linter
├── Dockerfile                                   # Multi-stage Dockerfile (Node.js Build + Nginx Runtime)
├── index.html                                   # HTML Template gốc của Single Page Application
├── jsconfig.json                                # Cấu hình đường dẫn module JavaScript
├── nginx.conf                                   # Cấu hình Nginx Web Server (SPA fallback & Gzip)
├── package.json                                 # Khai báo danh sách thư viện & scripts
└── vite.config.js                               # Cấu hình Vite Build Tool & Tailwind plugin
```