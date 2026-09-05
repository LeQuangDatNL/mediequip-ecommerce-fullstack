# 🏥 MediEquip Store - Website Bán Hàng & Tư Vấn Thiết Bị Y Tế

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x%20%2F%204.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> Hệ thống thương mại điện tử chuyên cung cấp, phân phối và tư vấn thiết bị - vật tư y tế trực tuyến. Dự án tích hợp đầy đủ tính năng mua sắm, quản trị chuyên sâu (nhập xuất Excel, phân quyền RBAC), hệ thống thông báo email SMTP tự động và hỗ trợ đóng gói Docker toàn diện.

---

## 📑 Mục lục
- [Giới thiệu & Tính năng chính](#-tính-năng-nổi-bật)
- [Kiến trúc & Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục)
- [Hướng dẫn triển khai nhanh với Docker (Khuyên dùng)](#-triển-khai-nhanh-với-docker)
- [Hướng dẫn chạy thủ công (Local Development)](#-chạy-môi-trường-phát-triển-thủ-công-local)
- [Tài liệu API & Swagger UI](#-tài-liệu-api--swagger-ui)
- [Tài khoản Demo](#-tài-khoản-mẫu-đăng-nhập)

---

## ✨ Tính năng nổi bật

### 🛍️ Dành cho Khách hàng (User)
- **Trang chủ trực quan**: Banner khuyến mãi, nhóm danh mục y tế nổi bật, top sản phẩm bán chạy, cam kết chất lượng và phần FAQ giải đáp thắc mắc thường gặp.
- **Tìm kiếm & Bộ lọc sản phẩm**: Lọc đa tiêu chí theo danh mục, thương hiệu, khoảng giá và phân trang mượt mà.
- **Xem chi tiết sản phẩm**: Modal/Trang chi tiết với bộ sưu tập nhiều ảnh (ảnh chính + gallery ảnh phụ), kiểm soát số lượng mua chống spam.
- **Giỏ hàng & Đặt hàng**: Quản lý giỏ hàng tức thời với Redux Toolkit, điền thông tin giao hàng và đặt hàng nhanh chóng.
- **Tư vấn & Báo giá theo file Excel**: Trang liên hệ hỗ trợ 4 phân loại chuyên biệt (Lỗi website, Sản phẩm theo yêu cầu, Khiếu nại chất lượng, Khác) cho phép tải file Excel danh sách cần báo giá và tự động gửi email thông báo về Admin.
- **Quản lý tài khoản**: Đăng ký, đăng nhập JWT, đổi mật khẩu và xem lịch sử đơn hàng cá nhân.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard)**: Thống kê tổng doanh thu, đơn hàng, khách hàng và sản phẩm theo thời gian thực.
- **Quản lý Sản phẩm nâng cao**:
  - Thêm, sửa, xóa, gắn ảnh chính và nhiều ảnh phụ chi tiết.
  - Ràng buộc nghiệp vụ chống spam giá và số lượng tồn kho.
  - **Nhập sản phẩm hàng loạt (Bulk Import Excel)**: Tải file mẫu .xlsx chuẩn 2 sheet (1 sheet dữ liệu, 1 sheet danh mục tra cứu), tự động kiểm tra định dạng và import hàng loạt chỉ với 1 click.
- **Quản lý Đơn hàng**: Theo dõi trạng thái đơn hàng (Chờ duyệt, Đang xử lý, Đang giao, Đã hoàn thành, Đã hủy).
- **Quản lý Danh mục & Thương hiệu**: Thêm mới, chỉnh sửa và quản lý quan hệ danh mục y tế.
- **Quản lý Yêu cầu tư vấn**: Tiếp nhận phản hồi và tải về file đính kèm từ khách hàng.

---

## 🛠️ Công nghệ sử dụng

| Phân hệ | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| **Backend** | Java 21, Spring Boot 3.x / 4.x | RESTful API Server |
| | Spring Security 6 + JWT | Xác thực Stateless & Phân quyền RBAC |
| | Spring Data JPA / Hibernate | Tương tác cơ sở dữ liệu ORM |
| | MySQL 8.0 | Cơ sở dữ liệu quan hệ |
| | Apache POI 5.3.0 | Đọc/Ghi & Xử lý mẫu Excel .xlsx |
| | Spring Mail (Gmail SMTP) | Gửi email thông báo tự động |
| | SpringDoc OpenAPI / Swagger 3 | Sinh tài liệu API tự động |
| **Frontend** | React 19, Vite | Xây dựng giao diện Single Page App (SPA) |
| | Tailwind CSS v4 | UI styling hiện đại, responsive |
| | Redux Toolkit | Quản lý state toàn cục (Cart, Auth) |
| | React Router DOM v7 | Điều hướng client-side routing |
| | Axios | HTTP client kết nối Backend |
| | Lucide React / React Icons | Bộ icon giao diện |
| | Leaflet | Bản đồ định vị cửa hàng |
| **DevOps** | Docker, Docker Compose | Container hóa toàn bộ hệ thống |
| | Nginx (Alpine) | Web Server & Reverse Proxy cho Frontend |

---

## 📁 Cấu trúc thư mục

`	ext
WebBanHang/
├── BE/                           # Mã nguồn Backend (Spring Boot)
│   └── shop/
│       ├── src/main/java/        # Controllers, Services, Repositories, Entities, Configs
│       ├── src/main/resources/   # application.properties
│       ├── pom.xml               # Quản lý thư viện Maven
│       ├── Dockerfile            # Multi-stage Dockerfile cho Spring Boot
│       └── .dockerignore
├── FE/                           # Mã nguồn Frontend (React + Vite)
│   └── shop/
│       ├── src/
│       │   ├── components/       # UI Components tái sử dụng (Navbar, Footer, Modals,...)
│       │   ├── pages/            # Trang Khách hàng & Trang Admin
│       │   ├── services/         # Axios API client & endpoints
│       │   ├── redux/            # Redux store & slices
│       │   └── assets/           # Hình ảnh, banner, icons
│       ├── nginx.conf            # Cấu hình Nginx phục vụ SPA & reverse proxy
│       ├── Dockerfile            # Multi-stage Dockerfile cho Frontend React
│       ├── package.json
│       └── .dockerignore
├── Database/                     # Kịch bản cơ sở dữ liệu
│   ├── create.md                 # Cấu trúc bảng (DDL SQL)
│   └── data.md                   # Dữ liệu mẫu khởi tạo (DML SQL)
├── Doc/                          # Tài liệu dự án
│   └── validation.md             # Quy chuẩn kiểm tra dữ liệu đầu vào
├── docker-compose.yml            # Khởi chạy toàn bộ hệ thống (MySQL + BE + FE)
├── .gitignore                    # Bộ lọc file khi đẩy lên Git
└── README.md                     # Tài liệu hướng dẫn tổng quan dự án
`

---

## 🚀 Triển khai nhanh với Docker

Hệ thống đã được đóng gói sẵn sàng với docker-compose.yml gồm 3 containers:
1. **shop-mysql**: MySQL 8.0 (Port 3306)
2. **shop-backend**: Spring Boot API (Port 8080)
3. **shop-frontend**: React App phục vụ bởi Nginx (Port 80)

### Các bước thực hiện:

1. **Clone repository về máy**:
   `ash
   git clone <URL_REPOSITORY_CUA_BAN>
   cd WebBanHang
   `

2. **Khởi chạy hệ thống**:
   `ash
   docker compose up --build -d
   `

3. **Truy cập ứng dụng**:
   - 🌐 **Giao diện Website**: [http://localhost](http://localhost) (hoặc [http://localhost:80](http://localhost:80))
   - 📖 **Swagger UI API Docs**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
   - 🗄️ **MySQL Database**: localhost:3306 (User: oot / Pass: op123 / DB: ecommerce_db)

4. **Dừng hệ thống khi không sử dụng**:
   `ash
   docker compose down
   `

---

## 💻 Chạy môi trường phát triển thủ công (Local)

Nếu bạn muốn chạy từng thành phần để phát triển tính năng:

### 1. Cơ sở dữ liệu (MySQL)
- Cài đặt MySQL 8.0 và tạo database:
  `sql
  CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `
- Thực thi các câu lệnh trong Database/create.md và Database/data.md (hoặc để Hibernate tự động sinh bảng với ddl-auto=update).

### 2. Khởi chạy Backend (Spring Boot)
- Mở terminal tại thư mục Backend:
  `ash
  cd BE/shop
  `
- Kiểm tra file src/main/resources/application.properties khớp với tài khoản MySQL của bạn.
- Biên dịch và chạy ứng dụng:
  `ash
  ./mvnw spring-boot:run
  # Hoặc trên Windows:
  mvn spring-boot:run
  `
- Backend sẽ chạy tại: http://localhost:8080

### 3. Khởi chạy Frontend (React + Vite)
- Mở một terminal mới tại thư mục Frontend:
  `ash
  cd FE/shop
  `
- Cài đặt thư viện dependencies:
  `ash
  npm install
  `
- Chạy môi trường Dev Server:
  `ash
  npm run dev
  `
- Frontend sẽ chạy tại: http://localhost:5173

---

## 📖 Tài liệu API & Swagger UI

Backend tích hợp sẵn giao diện tương tác API Swagger UI. Bạn có thể kiểm thử toàn bộ endpoint trực tiếp trên trình duyệt:

- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

> **Mẹo**: Nhấn nút **Authorize** ở góc phải Swagger UI và nhập JWT Token (Bearer <token>) sau khi đăng nhập để test các API yêu cầu quyền Admin hoặc User.

---

## 🔑 Tài khoản mẫu đăng nhập

| Quyền hạn | Tên đăng nhập / Email | Mật khẩu | Phạm vi truy cập |
|---|---|---|---|
| 👑 **Quản trị viên (Admin)** | dmin@mediequip.vn / dmin | dmin123 | Toàn quyền quản trị: Dashboard, Sản phẩm, Excel Import, Đơn hàng, Banner, Tư vấn |
| 👤 **Khách hàng (User)** | user@mediequip.vn / user | user123 | Mua sắm, xem sản phẩm, giỏ hàng, gửi đơn tư vấn, theo dõi đơn cá nhân |

---

## 🤝 Đóng góp & Phát triển
Mọi đóng góp nhằm nâng cao trải nghiệm người dùng và hoàn thiện hệ thống đều được hoan nghênh:
1. Fork dự án
2. Tạo nhánh tính năng mới (git checkout -b feature/AmazingFeature)
3. Commit thay đổi (git commit -m 'Add some AmazingFeature')
4. Push lên nhánh (git push origin feature/AmazingFeature)
5. Mở một **Pull Request**

---

## 📜 Giấy phép
Dự án được phát triển cho mục đích học tập và xây dựng giải pháp thương mại điện tử thực tế.