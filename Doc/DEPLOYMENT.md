# 🚀 HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG (PRODUCTION DEPLOYMENT GUIDE)

Tài liệu hướng dẫn chi tiết quy trình triển khai toàn bộ hệ sinh thái **MediEquip Vietnam** lên môi trường Cloud hoàn toàn miễn phí và tối ưu hiệu năng cao.

---

## 🏗️ 1. Tổng quan Kiến trúc Đám Mây (Cloud Infrastructure)

```
                       ┌────────────────────────────────────────┐
                       │           NGƯỜI DÙNG / TRÌNH DUYỆT     │
                       └───────────────────┬────────────────────┘
                                           │
                    HTTPS / REST API / SPA │ (Vercel CDN Edge)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │       FRONTEND: Vercel (React 19)       │
                       │ https://ecommerce-springboot-react-one │
                       │              .vercel.app               │
                       └───────────────────┬────────────────────┘
                                           │
                       HTTPS / JSON API    │ (Reverse Proxy / JWT)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │     BACKEND: Render Web Service        │
                       │       (Spring Boot 4 / Java 21)        │
                       └──────────────┬──────────────┬──────────┘
                                      │              │
                   SQL (TLS/SSL:4000) │              │ SMTP (Port 587)
                                      ▼              ▼
           ┌─────────────────────────────┐    ┌───────────────────────────┐
           │ DATABASE: TiDB Cloud        │    │ GMAIL SMTP SERVICE        │
           │ (Serverless MySQL)          │    │ (kimlienshopy@gmail.com)  │
           └─────────────────────────────┘    └───────────────────────────┘
```

---

## 🗄️ 2. Cấu hình Database: TiDB Cloud (Serverless MySQL)

1. **Khởi tạo Cluster**:
   - Đăng ký tài khoản tại [TiDB Cloud](https://tidbcloud.com/).
   - Tạo một cụm **Serverless Cluster** (Miễn phí 25GB lưu trữ).
   - Chọn Region gần nhất: `ap-southeast-1` (Singapore / AWS).

2. **Nạp Cấu trúc & Dữ liệu ban đầu**:
   - Kết nối SQL Client (DBeaver / DataGrip / MySQL Workbench) hoặc dùng web SQL Editor của TiDB Cloud.
   - Chạy script tạo bảng: [`Database/01_schema.sql`](../Database/01_schema.sql).
   - Chạy script nạp dữ liệu mẫu: [`Database/02_data.sql`](../Database/02_data.sql).

---

## ⚙️ 3. Cấu hình Backend: Render Web Service (Spring Boot)

1. **Tạo Web Service**:
   - Truy cập [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **New Web Service**.
   - Kết nối với GitHub Repository: `https://github.com/LeQuangDatNL/ecommerce-springboot-react`.
   - **Environment**: `Docker` (Sử dụng [`BE/shop/Dockerfile`](../BE/shop/Dockerfile)).

2. **Cấu hình Biến môi trường (Environment Variables)**:

| Key | Value (Mẫu) | Mô tả |
| :--- | :--- | :--- |
| `PORT` | `8080` | Cổng dịch vụ lắng nghe của Spring Boot |
| `SPRING_PROFILES_ACTIVE` | `prod` | Kích hoạt cấu hình Production |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/ecommerce_db?sslMode=VERIFY_IDENTITY&useSSL=true` | Chuỗi kết nối TiDB Cloud bảo mật SSL |
| `SPRING_DATASOURCE_USERNAME` | `3rSspJ8MbZM3jQY.root` | Tài khoản TiDB Cloud |
| `SPRING_DATASOURCE_PASSWORD` | `<your_tidb_password>` | Mật khẩu TiDB Cloud |
| `APP_JWT_SECRET` | `your_secure_random_jwt_secret_key_minimum_32_characters` | Khóa bí mật ký JWT Token |
| `SPRING_MAIL_USERNAME` | `kimlienshopy@gmail.com` | Tài khoản Gmail gửi OTP & thông báo |
| `SPRING_MAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | Mật khẩu ứng dụng (App Password 16 ký tự) |
| `APP_ADMIN_NOTIFICATION_EMAIL` | `kimlienshopy@gmail.com` | Email Admin nhận thông báo báo giá |

---

## 🌐 4. Cấu hình Frontend: Vercel (React + Vite)

1. **Kết nối Vercel**:
   - Truy cập [Vercel Dashboard](https://vercel.com/) $\rightarrow$ **Add New Project**.
   - Import Repository: `ecommerce-springboot-react`.
   - **Root Directory**: Chọn `FE/shop`.
   - **Framework Preset**: `Vite`.

2. **Cấu hình SPA Routing (`vercel.json`)**:
   - Đảm bảo file [`FE/shop/vercel.json`](../FE/shop/vercel.json) có mặt để xử lý điều hướng Single Page Application mà không bị lỗi 404 khi nhấn F5:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📧 5. Hướng dẫn lấy Mật khẩu ứng dụng Gmail (App Password)

1. Đăng nhập tài khoản Google `kimlienshopy@gmail.com`.
2. Mở trang [Google Security Settings](https://myaccount.google.com/security).
3. Bật **Xác minh 2 bước (2-Step Verification)**.
4. Tìm đến mục **Mật khẩu ứng dụng (App Passwords)**.
5. Tạo một mật khẩu ứng dụng mới với tên `MediEquip Render Server`.
6. Sao chép chuỗi 16 ký tự và gán vào biến môi trường `SPRING_MAIL_PASSWORD` trên Render Dashboard.
