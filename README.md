# 🏥 MediEquip Vietnam - Website Thương Mại Điện Tử & Tư Vấn Thiết Bị Y Tế

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x_/_4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Hệ thống giải pháp thương mại điện tử chuyên cung cấp, phân phối và báo giá thiết bị y tế chính hãng cho Bệnh viện, Phòng khám & Gia đình.**

[🌐 Khám phá tính năng](#-tính-năng-nổi-bật) • [🛠️ Công nghệ](#-công-nghệ-sử-dụng) • [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục-dự-án) • [🚀 Triển khai Docker](#-triển-khai-nhanh-với-docker-khuyên-dùng) • [📖 Tài liệu API](#-tài-liệu-api--swagger-ui)

</div>

---

## 📑 Mục lục
- [✨ Tính năng nổi bật](#-tính-năng-nổi-bật)
  - [🛍️ Dành cho Khách hàng & Phòng khám](#-dành-cho-khách-hàng--phòng-khám)
  - [🛡️ Dành cho Quản trị viên (Admin)](#-dành-cho-quản-trị-viên-admin)
- [🛠️ Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [📁 Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
- [🚀 Triển khai nhanh với Docker (Khuyên dùng)](#-triển-khai-nhanh-với-docker-khuyên-dùng)
- [💻 Chạy môi trường phát triển cục bộ (Local Development)](#-chạy-môi-trường-phát-triển-cục-bộ-local-development)
  - [1. Cấu hình Database MySQL](#1-cơ-sở-dữ-liệu-mysql)
  - [2. Khởi chạy Backend Spring Boot](#2-khởi-chạy-backend-spring-boot)
  - [3. Khởi chạy Frontend React Vite](#3-khởi-chạy-frontend-react--vite)
- [📖 Tài liệu API & Swagger UI](#-tài-liệu-api--swagger-ui)
- [🔑 Tài khoản mẫu đăng nhập](#-tài-khoản-mẫu-đăng-nhập)
- [👨‍💻 Tác giả & Thiết kế](#-tác-giả--thiết-kế)

---

## ✨ Tính năng nổi bật

### 🛍️ Dành cho Khách hàng & Phòng khám
- **Trang chủ y tế chuyên nghiệp**: Hero banner giới thiệu thiết bị, tìm kiếm nhanh theo chuyên khoa, cam kết chất lượng CO/CQ, quy trình 5 bước minh bạch và danh mục hỏi đáp (FAQ).
- **Phân loại & Bộ lọc đa tiêu chí**: Tra cứu thiết bị theo chuyên khoa (Chẩn đoán hình ảnh, Phòng mổ, Hồi sức cấp cứu, Xét nghiệm, Phục hồi chức năng...). Phân trang chuẩn 12 sản phẩm/trang.
- **Chi tiết sản phẩm & Bộ sưu tập ảnh**: Xem đa ảnh chi tiết, tài liệu kỹ thuật, tự động gắn ảnh mặc định chất lượng cao (`no-image.svg`) khi thiếu ảnh.
- **Giỏ hàng & Chế độ Báo giá ưu đãi**: Ẩn giá cố định, chuyển sang chế độ chiết khấu dự án, hỗ trợ đặt hàng nhanh kèm phương thức thanh toán tiền mặt (COD) và mã QR Ngân hàng / ZaloPay.
- **Tư vấn & Gửi file báo giá Excel**: Tiếp nhận file danh mục thiết bị (`.xlsx`, `.docx`, `.pdf`) trực tiếp trên web, cung cấp file mẫu Excel chuẩn UTF-8 BOM tải về một click.
- **Bản đồ định vị cửa hàng (Leaflet Map)**: Tích hợp chọn địa chỉ giao hàng trực quan trên bản đồ OpenStreetMap.
- **Quản lý tài khoản & Danh sách yêu thích**: Đăng ký, đăng nhập bảo mật JWT, lưu sản phẩm yêu thích (Wishlist) và quản lý sổ địa chỉ giao nhận.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard)**: Thống kê doanh thu, đơn hàng, người dùng và sản phẩm theo thời gian thực.
- **Quản lý sản phẩm & Bulk Import Excel**:
  - Thêm, sửa, xóa, quản lý gallery ảnh phụ chi tiết.
  - Nhập hàng loạt sản phẩm bằng file Excel `.xlsx` chuẩn 2 sheet (dữ liệu + danh mục tham khảo).
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng (Chờ duyệt, Đang xử lý, Đang giao, Hoàn thành, Hủy).
- **Quản lý yêu cầu báo giá & Tư vấn**: Xem chi tiết thông tin khách hàng và tải file danh mục thiết bị đính kèm.
- **Menu quản trị thu gọn (Collapsible)**: Phân nhóm Quản lý chính (Báo giá, Sản phẩm, Danh mục, Đơn hàng) và Quản lý phụ (Người dùng, Banners, Đánh giá, Media Gallery).

---

## 🛠️ Công nghệ sử dụng

| Phân hệ | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| **Backend** | **Java 21**, **Spring Boot 3.x / 4.x** | RESTful API Server độc lập |
| | **Spring Security 6** + **JWT** | Xác thực Stateless Token & Phân quyền RBAC |
| | **Spring Data JPA** / **Hibernate** | Tương tác cơ sở dữ liệu ORM |
| | **MySQL 8.0** | Cơ sở dữ liệu quan hệ |
| | **Apache POI 5.3.0** | Đọc/Ghi & Xử lý file Excel `.xlsx` |
| | **Spring Mail (Gmail SMTP)** | Gửi email thông báo tự động |
| | **SpringDoc OpenAPI / Swagger 3** | Tự động sinh tài liệu API trực quan |
| **Frontend** | **React 19**, **Vite** | Xây dựng giao diện Single Page Application (SPA) |
| | **Tailwind CSS v4** | Giao diện y tế hiện đại, responsive |
| | **Redux Toolkit** | Quản lý state toàn cục (Cart, Auth, Wishlist) |
| | **React Router DOM v7** | Điều hướng client-side routing |
| | **Axios** | HTTP Client kết nối API Backend |
| | **Lucide React** | Bộ icon giao diện hiện đại |
| | **Leaflet** & **React-Leaflet** | Bản đồ định vị GPS & chọn địa chỉ |
| **DevOps** | **Docker**, **Docker Compose** | Container hóa trọn gói hệ thống (MySQL + BE + FE) |
| | **Nginx (Alpine)** | Web Server phục vụ SPA & Reverse Proxy |

---

## 📁 Cấu trúc thư mục dự án

```text
WebBanHang/
├── BE/                                # Mã nguồn Backend (Spring Boot)
│   ├── Doc/                           # Tài liệu đặc tả kỹ thuật & Validation
│   │   ├── validation.md              # Quy chuẩn kiểm tra dữ liệu đầu vào & Anti-Spam
│   │   └── commad.md                  # Hướng dẫn lệnh khởi chạy
│   └── shop/
│       ├── src/main/java/com/shop/    # Source code Java (Controller, Service, Entity, DTO, Security)
│       ├── src/main/resources/        # application.properties (Cấu hình an toàn biến môi trường)
│       ├── pom.xml                    # Quản lý thư viện Maven
│       ├── Dockerfile                 # Multi-stage Dockerfile cho Backend
│       └── .dockerignore
│
├── FE/                                # Mã nguồn Frontend (React + Vite)
│   └── shop/
│       ├── public/                    # Tài nguyên tĩnh (no-image.svg, favicon)
│       ├── src/
│       │   ├── assets/                # Hình ảnh y tế, banner, icons
│       │   ├── components/            # UI Components (Header, Footer, MapPicker, FloatingContact,...)
│       │   ├── contexts/              # React Contexts (CartContext, WishlistContext)
│       │   ├── hooks/                 # Custom React Hooks (useAuth)
│       │   ├── pages/                 # Giao diện Khách hàng & Giao diện Admin
│       │   ├── services/              # Axios API clients & endpoints
│       │   └── utils/                 # Tiện ích (imageHelper, quoteTemplateExport)
│       ├── nginx.conf                 # Cấu hình Nginx reverse proxy cho Frontend
│       ├── Dockerfile                 # Multi-stage Dockerfile cho Frontend
│       ├── package.json               # Danh sách thư viện Node.js
│       └── .dockerignore
│
├── Database/                          # Kịch bản cơ sở dữ liệu MySQL
│   ├── create.md                      # Cấu trúc bảng (DDL SQL)
│   └── data.md                        # Dữ liệu mẫu khởi tạo (DML SQL)
│
├── .env.example                       # Mẫu biến môi trường an toàn (Không lộ mật khẩu)
├── docker-compose.yml                 # Khởi chạy toàn bộ hệ thống (MySQL + BE + FE)
├── .gitignore                         # Bộ lọc tệp tin Git chuẩn
└── README.md                          # Tài liệu hướng dẫn dự án
```

---

## 🚀 Triển khai nhanh với Docker (Khuyên dùng)

Dự án đã được đóng gói sẵn sàng với `docker-compose.yml` gồm 3 services:
1. `shop-mysql`: MySQL 8.0 (Port `3306`)
2. `shop-backend`: Spring Boot Java 21 API (Port `8080`)
3. `shop-frontend`: React 19 + Nginx (Port `80`)

### Các bước thực hiện:

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/LeQuangDatNL/ecommerce-springboot-react.git
   cd ecommerce-springboot-react
   ```

2. **Cấu hình biến môi trường (Tùy chọn)**:
   ```bash
   cp .env.example .env
   # Chỉnh sửa file .env nếu bạn muốn thay đổi mật khẩu Database hoặc cấu hình Mail
   ```

3. **Khởi chạy toàn bộ hệ thống với 1 lệnh**:
   ```bash
   docker compose up --build -d
   ```

4. **Truy cập ứng dụng**:
   - 🌐 **Giao diện Website**: [http://localhost](http://localhost) (hoặc [http://localhost:80](http://localhost:80))
   - 📖 **Swagger UI API Docs**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
   - 🗄️ **MySQL Database**: `localhost:3306` (Database: `ecommerce_db`)

5. **Dừng hệ thống khi không sử dụng**:
   ```bash
   docker compose down
   ```

---

## 💻 Chạy môi trường phát triển cục bộ (Local Development)

### 1. Cơ sở dữ liệu (MySQL)
- Cài đặt MySQL 8.0 và tạo database:
  ```sql
  CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- Nạp cấu trúc bảng và dữ liệu mẫu từ thư mục `Database/` hoặc để Spring Boot JPA tự động sinh bảng (`ddl-auto=update`).

### 2. Khởi chạy Backend (Spring Boot)
- Di chuyển vào thư mục Backend:
  ```bash
  cd BE/shop
  ```
- Cung cấp mật khẩu MySQL qua biến môi trường hoặc chạy lệnh:
  ```bash
  # Trên Windows (PowerShell/CMD):
  mvn spring-boot:run
  # Hoặc với Maven Wrapper:
  .\mvnw spring-boot:run
  ```
- Backend sẽ hoạt động tại: `http://localhost:8080`

### 3. Khởi chạy Frontend (React + Vite)
- Mở terminal tại thư mục Frontend:
  ```bash
  cd FE/shop
  ```
- Cài đặt các thư viện:
  ```bash
  npm install
  ```
- Chạy Development Server:
  ```bash
  npm run dev
  ```
- Frontend sẽ hoạt động tại: `http://localhost:5173`

---

## 📖 Tài liệu API & Swagger UI

Backend tích hợp sẵn giao diện Swagger UI OpenAPI 3.0:

- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

> **Mẹo**: Sau khi đăng nhập, bạn có thể bấm nút **Authorize** ở góc phải Swagger UI và nhập JWT Token (`Bearer <token>`) để kiểm thử các API bảo vệ quyền Admin hoặc User.

---

## 🔑 Tài khoản mẫu đăng nhập

| Quyền hạn | Tên đăng nhập / Email | Mật khẩu mặc định | Phạm vi quyền hạn |
|---|---|---|---|
| 👑 **Quản trị viên (Admin)** | `admin` / `admin@shop.vn` | `123456` | Toàn quyền quản trị: Dashboard, Sản phẩm, Excel Import, Đơn hàng, Yêu cầu báo giá |
| 👤 **Khách hàng (User)** | `nguyenvana` / `nguyenvana@gmail.com` | `123456` | Mua sắm thiết bị, giỏ hàng, gửi đơn báo giá, theo dõi đơn cá nhân, lưu yêu thích |

---

## 👨‍💻 Tác giả & Thiết kế

- **Người phát triển & Thiết kế**: [Lê Quang Đạt (@LeQuangDat)](https://github.com/LeQuangDatNL)
- **Email hỗ trợ**: [lienkehoach@gmail.com](mailto:lienkehoach@gmail.com)
- **Hotline & Zalo tư vấn**: **0914 066 662**
- **Facebook**: [Facebook Kim Liên](https://www.facebook.com/kim.lien.ngo.304193)

---

## 📜 Giấy phép
Dự án được xây dựng và phát triển phục vụ mục đích học tập và giải pháp thương mại điện tử thực tế. Mọi đóng góp (Pull Request) đều được hoan nghênh!