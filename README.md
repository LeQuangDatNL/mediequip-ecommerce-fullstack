# 🏥 MediEquip Vietnam - Website Thương Mại Điện Tử & Tư Vấn Thiết Bị Y Tế

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x_/_4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Hệ thống giải pháp thương mại điện tử chuyên cung cấp, phân phối và báo giá thiết bị y tế chính hãng cho Bệnh viện, Phòng khám & Gia đình.**

### 🌐 Live Demo Frontend (Vercel): [https://ecommerce-springboot-react-one.vercel.app/](https://ecommerce-springboot-react-one.vercel.app/)

[🌐 Khám phá tính năng](#-tính-năng-nổi-bật) • [🛠️ Công nghệ](#-công-nghệ-sử-dụng) • [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục-dự-án) • [🚀 Triển khai Docker](#-triển-khai-nhanh-với-docker-khuyên-dùng) • [💻 Hướng dẫn lập trình viên](#-chạy-môi-trường-phát-triển-cục-bộ-local-development) • [📖 Tài liệu API](#-tài-liệu-api--swagger-ui)

</div>

---

## 📑 Mục lục
- [✨ Tính năng nổi bật](#-tính-năng-nổi-bật)
  - [🤖 Trợ lý AI & Báo giá Y tế](#-trợ-lý-ai--báo-giá-y-tế)
  - [🛍️ Dành cho Khách hàng & Phòng khám](#-dành-cho-khách-hàng--phòng-khám)
  - [🛡️ Dành cho Quản trị viên (Admin)](#-dành-cho-quản-trị-viên-admin)
- [🛠️ Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [📁 Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
- [🚀 Triển khai nhanh với Docker (Khuyên dùng)](#-triển-khai-nhanh-với-docker-khuyên-dùng)
- [💻 Hướng dẫn cho Lập trình viên (Local Development)](#-chạy-môi-trường-phát-triển-cục-bộ-local-development)
  - [1. Cấu hình Database MySQL](#1-cơ-sở-dữ-liệu-mysql)
  - [2. Khởi chạy Backend Spring Boot](#2-khởi-chạy-backend-spring-boot)
  - [3. Khởi chạy Frontend React Vite](#3-khởi-chạy-frontend-react--vite)
- [📖 Tài liệu API & Swagger UI](#-tài-liệu-api--swagger-ui)
- [🔑 Tài khoản mẫu đăng nhập](#-tài-khoản-mẫu-đăng-nhập)
- [👨‍💻 Tác giả & Liên hệ](#-tác-giả--liên-hệ)

---

## ✨ Tính năng nổi bật

### 🤖 Trợ lý AI & Báo giá Y tế
- **Trợ lý Bot Chat AI (Google Gemini 2.5 Flash)**: Widget chat nổi hỗ trợ tư vấn tức thì 24/7 về cấu hình máy, thông số kỹ thuật, hướng dẫn sử dụng và giải đáp thắc mắc chuyên môn y tế.
- **Tải file biểu mẫu Excel Báo giá 1-Click**: Tích hợp sẵn template Excel yêu cầu báo giá chuẩn y tế (`.xlsx`) kèm xuất PDF/Excel danh mục dự án.
- **Form Validation Chuyên Nghiệp**: Áp dụng bộ đôi `react-hook-form` + `zod` bắt lỗi realtime, giao diện cảnh báo trực quan cho biểu mẫu Đăng ký, Đăng nhập và Yêu cầu tư vấn.

### 🛍️ Dành cho Khách hàng & Phòng khám
- **Trang chủ y tế chuẩn hóa**: Hero banner giới thiệu thiết bị, tìm kiếm thông minh theo chuyên khoa, cam kết CO/CQ, quy trình 5 bước minh bạch.
- **Phân loại & Bộ lọc đa tiêu chí**: Tra cứu thiết bị theo chuyên khoa (Chẩn đoán hình ảnh, Phòng mổ, Hồi sức cấp cứu, Xét nghiệm, Phục hồi chức năng, Xuất xứ quốc gia...).
- **Chi tiết sản phẩm & Bộ sưu tập ảnh**: Xem đa ảnh chi tiết, tài liệu kỹ thuật, tự động fallback ảnh chuẩn (`no-image.svg`).
- **Giỏ hàng & Đặt hàng báo giá**: Chiết khấu dự án linh hoạt, hỗ trợ thanh toán tiền mặt (COD) và mã QR Ngân hàng / ZaloPay.
- **Bản đồ định vị cửa hàng (Leaflet Map)**: Tích hợp định vị GPS và chọn địa chỉ giao nhận trực quan trên OpenStreetMap.
- **Quản lý tài khoản & Yêu thích**: Đăng ký, đăng nhập bảo mật JWT, lưu Wishlist, theo dõi tiến độ đơn hàng và lịch sử yêu cầu báo cáo.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard)**: Thống kê doanh thu, đơn hàng, khách hàng và thiết bị theo thời gian thực.
- **Quản lý sản phẩm & Bulk Import Excel**:
  - CRUD sản phẩm, phân loại danh mục, quốc gia xuất xứ (Origin).
  - Nhập hàng loạt sản phẩm bằng file Excel `.xlsx` chuẩn 2 sheet (dữ liệu + danh mục tham khảo).
- **Quản lý đơn hàng & Báo giá**: Theo dõi trạng thái đơn hàng (Chờ duyệt, Đang xử lý, Đang giao, Hoàn thành, Hủy), duyệt yêu cầu tư vấn và xem file đính kèm.
- **Quản lý đánh giá (Reviews) & Xuất xứ (Origins)**: Kiểm duyệt phản hồi khách hàng, quản lý danh sách xuất xứ thiết bị y tế (Đức, Nhật Bản, Mỹ, Hàn Quốc, Việt Nam...).

---

## 🛠️ Công nghệ sử dụng

| Phân hệ | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| **Backend** | **Java 21**, **Spring Boot 3.x / 4.x** | RESTful API Server độc lập, hiệu năng cao |
| | **Spring Security 6** + **JWT (jjwt)** | Xác thực Stateless Token & Phân quyền RBAC (ADMIN / CUSTOMER) |
| | **Spring Data JPA** / **Hibernate** | ORM tương tác cơ sở dữ liệu quan hệ |
| | **MySQL 8.0** | Cơ sở dữ liệu lưu trữ chính |
| | **Apache POI 5.3.0** | Đọc, ghi & xử lý file Excel `.xlsx` báo giá và bulk import |
| | **Spring Mail (Gmail SMTP)** | Gửi email thông báo tự động khi có yêu cầu mới |
| | **SpringDoc OpenAPI / Swagger 3** | Tự động sinh tài liệu RESTful API trực quan |
| **Frontend** | **React 19**, **Vite** | Nền tảng Single Page Application (SPA) tốc độ cao |
| | **Tailwind CSS v4** | Hệ thống style y tế hiện đại, responsive hoàn toàn |
| | **React Hook Form** + **Zod** | Validation form hiệu năng cao, schema-based type-safe |
| | **Google Gemini AI SDK** | Tích hợp Bot chat AI tư vấn thiết bị y tế |
| | **Redux Toolkit** / React Context | Quản lý state toàn cục (Cart, Auth, Wishlist) |
| | **React Router DOM v7** | Quản lý định tuyến SPA |
| | **Axios** | HTTP Client kết nối API Backend |
| | **Lucide React** | Bộ icon giao diện hiện đại |
| | **Leaflet** & **React-Leaflet** | Bản đồ tương tác & chọn vị trí giao hàng |
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
│       │   ├── application.properties
│       │   └── application-dev.properties.example # Mẫu cấu hình local
│       ├── pom.xml                    # Quản lý thư viện Maven
│       ├── Dockerfile                 # Multi-stage Dockerfile cho Backend
│       └── .dockerignore
│
├── FE/                                # Mã nguồn Frontend (React + Vite)
│   └── shop/
│       ├── public/                    # Tài nguyên tĩnh (no-image.svg, Excel template)
│       ├── src/
│       │   ├── assets/                # Hình ảnh y tế, banner, icons
│       │   ├── components/            # UI Components (Header, Footer, FloatingChatWidget,...)
│       │   ├── contexts/              # React Contexts (CartContext, WishlistContext)
│       │   ├── hooks/                 # Custom React Hooks (useAuth)
│       │   ├── pages/                 # Giao diện Khách hàng & Giao diện Admin
│       │   ├── services/              # Axios API clients (aiChatService, productService,...)
│       │   └── utils/                 # Tiện ích (validationSchemas, quoteExport)
│       ├── .env.example               # Mẫu biến môi trường Frontend
│       ├── nginx.conf                 # Cấu hình Nginx reverse proxy cho Frontend
│       ├── Dockerfile                 # Multi-stage Dockerfile cho Frontend
│       ├── package.json               # Danh sách thư viện Node.js
│       └── .dockerignore
│
├── Database/                          # Kịch bản cơ sở dữ liệu MySQL
│   ├── schema.sql                     # Cấu trúc bảng (DDL SQL)
│   ├── data.sql                       # Dữ liệu mẫu khởi tạo (DML SQL)
│   ├── create.md                      # Tài liệu mô tả lược đồ CSDL
│   └── data.md                        # Tài liệu mô tả dữ liệu mẫu
│
├── .env.example                       # Mẫu biến môi trường an toàn trọn gói
├── docker-compose.yml                 # Khởi chạy toàn bộ hệ thống (MySQL + BE + FE)
├── .gitignore                         # Bộ lọc tệp tin Git chuẩn (bảo mật tuyệt đối)
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
   # Chỉnh sửa file .env nếu bạn muốn thay đổi mật khẩu Database, Gemini API Key hoặc cấu hình Mail
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

## 💻 Hướng dẫn cho Lập trình viên (Local Development)

Dành cho các thành viên trong nhóm hoặc nhà phát triển muốn clone về để tiếp tục code và mở rộng tính năng:

### 1. Cơ sở dữ liệu (MySQL 8.0+)
1. Mở MySQL Client / Workbench / DBeaver và tạo Database:
   ```sql
   CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Chạy file cấu trúc bảng và nạp dữ liệu mẫu:
   - File cấu trúc bảng: `Database/schema.sql`
   - File dữ liệu mẫu: `Database/data.sql`

*(Hoặc dùng lệnh terminal:* `mysql -u root -p ecommerce_db < Database/schema.sql` *rồi* `mysql -u root -p ecommerce_db < Database/data.sql`*)*

### 2. Khởi chạy Backend (Spring Boot)
1. Di chuyển vào thư mục Backend:
   ```bash
   cd BE/shop
   ```
2. Tạo file cấu hình dev cá nhân:
   ```bash
   cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties
   ```
   *Mở file `application-dev.properties` và điền mật khẩu MySQL cục bộ của bạn (`spring.datasource.password=...`). File này đã nằm trong `.gitignore` nên an toàn tuyệt đối.*

3. Khởi chạy ứng dụng:
   ```bash
   # Dùng Maven Wrapper (Khuyên dùng, không cần cài trước Maven)
   # Trên Windows:
   .\mvnw.cmd spring-boot:run
   # Trên Linux/macOS:
   ./mvnw spring-boot:run
   ```
   Backend sẽ hoạt động tại: **`http://localhost:8080`**

### 3. Khởi chạy Frontend (React + Vite)
1. Mở terminal tại thư mục Frontend:
   ```bash
   cd FE/shop
   ```
2. Tạo file biến môi trường:
   ```bash
   cp .env.example .env
   ```
   *(Điền `VITE_GEMINI_API_KEY` nếu bạn muốn test tính năng Bot Chat AI với API Key riêng của mình).*

3. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```

4. Khởi chạy Development Server:
   ```bash
   npm run dev
   ```
   Frontend sẽ hoạt động tại: **`http://localhost:5173`**

---

## 📖 Tài liệu API & Swagger UI

Backend tích hợp sẵn giao diện Swagger UI OpenAPI 3.0:

- **Swagger UI Trực quan**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

> **Mẹo kiểm thử API bảo mật**: Sau khi đăng nhập qua API `/api/auth/login`, sao chép JWT token, bấm nút **Authorize** ở góc phải Swagger UI và nhập `Bearer <token>` để kiểm thử các API quyền Admin hoặc User.

---

## 🔑 Tài khoản mẫu đăng nhập

| Quyền hạn | Tên đăng nhập / Email | Mật khẩu mặc định | Phạm vi quyền hạn |
|---|---|---|---|
| 👑 **Quản trị viên (Admin)** | `admin` / `admin@shop.vn` | `123456` | Toàn quyền: Dashboard, Quản lý sản phẩm, Xuất xứ, Nhập Excel, Đơn hàng, Đánh giá, Yêu cầu báo giá |
| 👤 **Khách hàng (User)** | `nguyenvana` / `nguyenvana@gmail.com` | `123456` | Mua sắm, giỏ hàng, gửi đơn báo giá, chat AI, theo dõi báo cáo cá nhân, Wishlist |
