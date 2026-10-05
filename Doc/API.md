# 📖 TÀI LIỆU HỆ THỐNG RESTful API (E-COMMERCE THIẾT BỊ Y TẾ)

* **Base URL Backend (Local):** `http://localhost:8080`
* **Live Demo Frontend (Vercel):** [https://ecommerce-springboot-react-one.vercel.app/](https://ecommerce-springboot-react-one.vercel.app/)
* **Swagger UI Trực quan:** `http://localhost:8080/swagger-ui/index.html`
* **OpenAPI 3.0 Spec:** `http://localhost:8080/v3/api-docs`
* **Content-Type:** `application/json` (hoặc `multipart/form-data` khi tải file)
* **Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 📑 Mục lục
1. [Xác thực & Bảo mật (Authentication)](#1-xác-thực--bảo-mật-authentication)
2. [Thông tin Cá nhân & Đổi mật khẩu (My Account)](#2-thông-tin-cá-nhân--đổi-mật-khẩu-my-account)
3. [Sổ Địa chỉ Nhận hàng (My Addresses)](#3-sổ-địa-chỉ-nhận-hàng-my-addresses)
4. [Danh mục Chuyên khoa (Categories)](#4-danh-mục-chuyên-khoa-categories)
5. [Xuất xứ Quốc gia (Origins)](#5-xuất-xứ-quốc-gia-origins)
6. [Sản phẩm & Thiết bị Y tế (Products)](#6-sản-phẩm--thiết-bị-y-tế-products)
7. [Đơn hàng & Báo giá Khách hàng (Customer Orders)](#7-đơn-hàng--báo-giá-khách-hàng-customer-orders)
8. [Quản lý Đơn hàng (Admin Orders)](#8-quản-lý-đơn-hàng-admin-orders)
9. [Tư vấn & Gửi file Báo giá (Consultations)](#9-tư-vấn--gửi-file-báo-giá-consultations)
10. [Đánh giá & Bình luận (Reviews)](#10-đánh-giá--bình-luận-reviews)
11. [Báo cáo & Thống kê Excel (User Reports)](#11-báo-cáo--thống-kê-excel-user-reports)
12. [Thư viện Media & Ảnh (Admin Images)](#12-thư-viện-media--ảnh-admin-images)
13. [Quản lý Người dùng (Admin Users)](#13-quản-lý-người-dùng-admin-users)
14. [Chuẩn Hóa Mã Trạng Thái HTTP & Bảo Mật Hệ Thống](#14-chuẩn-hóa-mã-trạng-thái-http--bảo-mật-hệ-thống)

---

## Cấu trúc Phản hồi Lỗi Chuẩn (Standard Error Response)
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Thông điệp mô tả lỗi chi tiết",
  "timestamp": "2026-10-01T08:30:00.000Z"
}
```

---

## 1. Xác thực & Bảo mật (Authentication)

### 1.1. Lấy mã CAPTCHA thử thách
* **Endpoint:** `GET /api/auth/captcha`
* **Quyền:** Public
* **Mô tả:** Trả về phép tính ngẫu nhiên (ví dụ `12 + 5 = ?`) và ID phiên CAPTCHA để chống tấn công Brute-Force.
* **Response (200 OK):**
```json
{
  "captchaId": "c8b1a3d4-1234-5678-9abc-def012345678",
  "challenge": "15 + 8 = ?"
}
```

### 1.2. Gửi mã xác thực OTP qua Gmail khi đăng ký
* **Endpoint:** `POST /api/auth/send-otp?email=user@example.com`
* **Quyền:** Public (Chống spam: Tối đa 3 lần / 5 phút, cooldown 45s)
* **Response (200 OK):**
```json
{
  "status": 200,
  "message": "Mã xác thực OTP (6 chữ số) đã được gửi tới email user@example.com. Mã có hiệu lực trong 5 phút.",
  "expiresInSeconds": 300
}
```

### 1.3. Đăng ký tài khoản mới (Register)
* **Endpoint:** `POST /api/auth/register`
* **Quyền:** Public (Rate limit: tối đa 5 lần / 15 phút từ 1 IP)
* **Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "nguyenvana@gmail.com",
  "password": "password123",
  "fullName": "Nguyễn Văn An",
  "phone": "0901000003",
  "otp": "123456"
}
```
* **Response (201 Created):**
```json
{
  "id": 3,
  "username": "nguyenvana",
  "email": "nguyenvana@gmail.com",
  "fullName": "Nguyễn Văn An",
  "phone": "0901000003",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2026-10-01T08:00:00"
}
```

### 1.4. Đăng nhập (Login)
* **Endpoint:** `POST /api/auth/login`
* **Quyền:** Public
* **Bảo vệ:** Tự động yêu cầu CAPTCHA khi sai $\ge 3$ lần; Tạm khóa 15 phút khi sai $\ge 5$ lần.
* **Request Body:**
```json
{
  "username": "nguyenvana",
  "password": "password123",
  "captchaId": "c8b1a3d4-...", 
  "captchaAnswer": "23"
}
```
* **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer"
}
```

### 1.5. Đăng xuất & Hủy Token (Logout)
* **Endpoint:** `POST /api/auth/logout`
* **Quyền:** Authenticated
* **Headers:** `Authorization: Bearer <token>`
* **Mô tả:** Đưa token vào `TokenBlacklistService` để vô hiệu hóa tức thì.
* **Response:** `204 No Content`

### 1.6. Lấy phiên đăng nhập hiện tại (Me)
* **Endpoint:** `GET /api/auth/me`
* **Quyền:** Authenticated (`CUSTOMER` hoặc `ADMIN`)
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):** Thông tin Principal và Authorities của Spring Security.

---

## 2. Thông tin Cá nhân & Đổi mật khẩu (My Account)

### 2.1. Xem hồ sơ cá nhân
* **Endpoint:** `GET /api/users/me`
* **Quyền:** Authenticated
* **Response (200 OK):**
```json
{
  "id": 3,
  "username": "nguyenvana",
  "email": "nguyenvana@gmail.com",
  "fullName": "Nguyễn Văn An",
  "phone": "0901000003",
  "role": "CUSTOMER",
  "status": "ACTIVE",
  "createdAt": "2026-10-01T08:00:00"
}
```

### 2.2. Cập nhật thông tin cá nhân (Tên, Số điện thoại, Email)
* **Endpoint:** `PUT /api/users/me`
* **Quyền:** Authenticated
* **Request Body:**
```json
{
  "fullName": "Nguyễn Văn An (Đã sửa)",
  "email": "nguyenvana@gmail.com",
  "phone": "0909999888"
}
```
* **Response (200 OK):** Thông tin người dùng sau khi cập nhật.

### 2.3. Đổi mật khẩu
* **Endpoint:** `PUT /api/users/me/password`
* **Quyền:** Authenticated
* **Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newSecurePassword456"
}
```
* **Response:** `204 No Content`

---

## 3. Sổ Địa chỉ Nhận hàng (My Addresses)

### 3.1. Danh sách địa chỉ của tôi
* **Endpoint:** `GET /api/users/me/addresses`
* **Quyền:** Authenticated
* **Response (200 OK):**
```json
[
  {
    "id": 1,
    "recipientName": "Nguyễn Văn An",
    "phone": "0901000003",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận Tân Phú",
    "ward": "Phường Tân Quý",
    "addressDetail": "7/54 Dương Thiệu Tước",
    "defaultAddress": true,
    "createdAt": "2026-10-01T08:00:00"
  }
]
```

### 3.2. Thêm địa chỉ mới
* **Endpoint:** `POST /api/users/me/addresses`
* **Quyền:** Authenticated
* **Request Body:**
```json
{
  "recipientName": "Nguyễn Văn An",
  "phone": "0901000003",
  "province": "TP. Hồ Chí Minh",
  "district": "Quận Tân Phú",
  "ward": "Phường Tân Quý",
  "addressDetail": "7/54 Dương Thiệu Tước",
  "defaultAddress": true
}
```

### 3.3. Cập nhật địa chỉ
* **Endpoint:** `PUT /api/users/me/addresses/{id}`
* **Quyền:** Authenticated

### 3.4. Xóa địa chỉ
* **Endpoint:** `DELETE /api/users/me/addresses/{id}`
* **Quyền:** Authenticated
* **Response:** `204 No Content`

---

## 4. Danh mục Chuyên khoa (Categories)

### 4.1. Lấy danh sách tất cả danh mục
* **Endpoint:** `GET /api/categories`
* **Quyền:** Public
* **Response (200 OK):** Danh sách danh mục (`id`, `name`, `slug`, `description`, `status`).

### 4.2. Xem chi tiết danh mục theo ID / Slug
* **Endpoint:** `GET /api/categories/{id}` hoặc `GET /api/categories/slug/{slug}`
* **Quyền:** Public

### 4.3. [Admin] Thêm danh mục mới
* **Endpoint:** `POST /api/admin/categories`
* **Quyền:** Admin
* **Request Body:**
```json
{
  "name": "Chẩn Đoán Hình Ảnh",
  "slug": "chan-doan-hinh-anh",
  "description": "Máy siêu âm, X-quang kỹ thuật số, nội soi",
  "status": "ACTIVE"
}
```

### 4.4. [Admin] Cập nhật / Xóa danh mục
* **Endpoint:** `PUT /api/admin/categories/{id}` | `DELETE /api/admin/categories/{id}`
* **Quyền:** Admin

---

## 5. Xuất xứ Quốc gia (Origins)

### 5.1. Danh sách xuất xứ thiết bị (Public)
* **Endpoint:** `GET /api/origins`
* **Quyền:** Public
* **Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Đức (Germany)",
    "code": "DE",
    "description": "Tiêu chuẩn y tế châu Âu CE",
    "status": "ACTIVE"
  },
  {
    "id": 2,
    "name": "Nhật Bản (Japan)",
    "code": "JP",
    "description": "Công nghệ y tế độ chính xác cao",
    "status": "ACTIVE"
  }
]
```

### 5.2. [Admin] Quản lý Xuất xứ
* **Tạo mới:** `POST /api/admin/origins`
* **Cập nhật:** `PUT /api/admin/origins/{id}`
* **Xóa mềm:** `DELETE /api/admin/origins/{id}`
* **Quyền:** Admin

---

## 6. Sản phẩm & Thiết bị Y tế (Products)

### 6.1. Danh sách sản phẩm (Phân trang, Tìm kiếm, Lọc)
* **Endpoint:** `GET /api/products`
* **Quyền:** Public
* **Query Params:**
  - `page` (int, default: 0): Số trang.
  - `size` (int, default: 12): Số lượng sản phẩm trên 1 trang.
  - `keyword` (string): Tìm kiếm theo tên hoặc mã sản phẩm.
  - `categoryId` (long, optional): Lọc theo danh mục chuyên khoa.
  - `originId` (long, optional): Lọc theo quốc gia xuất xứ.
* **Response (200 OK):** Page object (`content`, `totalPages`, `totalElements`, `size`, `number`).

### 6.2. Xem chi tiết sản phẩm theo ID / Slug
* **Endpoint:** `GET /api/products/{id}` hoặc `GET /api/products/slug/{slug}`
* **Quyền:** Public
* **Response (200 OK):**
```json
{
  "id": 1,
  "name": "Máy Tạo Oxy Y Tế 5 Lít Yuwell 7F-5D",
  "slug": "may-tao-oxy-y-te-5-lit-yuwell-7f-5d",
  "description": "Cung cấp nguồn oxy tinh khiết 93% ± 3% liên tục 24/7...",
  "primaryImageUrl": "https://example.com/oxy-yuwell.jpg",
  "category": { "id": 1, "name": "Hồi Sức Cấp Cứu" },
  "origin": { "id": 1, "name": "Đức (Germany)", "code": "DE" },
  "status": "ACTIVE",
  "images": [
    { "id": 10, "imageUrl": "https://example.com/oxy-sub1.jpg", "isPrimary": false }
  ]
}
```

### 6.3. [Admin] Thêm / Sửa / Xóa sản phẩm
* **Tạo:** `POST /api/admin/products`
* **Sửa:** `PUT /api/admin/products/{id}`
* **Xóa:** `DELETE /api/admin/products/{id}`
* **Quyền:** Admin

### 6.4. [Admin] Xuất & Nhập Excel Hàng Loạt (Bulk Import/Export)
* **Tải mẫu Excel nhập liệu:** `GET /api/products/excel-template`
* **Nhập sản phẩm từ Excel:** `POST /api/products/import-excel` *(Multipart `file: .xlsx`)*
* **Xuất danh sách sản phẩm ra Excel:** `GET /api/products/export-excel`

---

## 7. Đơn hàng & Báo giá Khách hàng (Customer Orders)

### 7.1. Tạo đơn đặt hàng / Yêu cầu báo giá
* **Endpoint:** `POST /api/orders`
* **Quyền:** Public (Hỗ trợ cả khách đăng nhập & vãng lai)
* **Request Body:**
```json
{
  "fullName": "Nguyễn Văn An",
  "phone": "0901000003",
  "email": "nguyenvana@gmail.com",
  "shippingAddress": "7/54 Dương Thiệu Tước, Phường Tân Quý, Quận Tân Phú, TP.HCM",
  "paymentMethod": "COD",
  "note": "Yêu cầu giao giờ hành chính",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 12500000
    }
  ]
}
```

### 7.2. Lịch sử đơn hàng của tôi
* **Endpoint:** `GET /api/orders/my-orders`
* **Quyền:** Authenticated

### 7.3. Tra cứu tiến độ đơn hàng nhanh
* **Endpoint:** `GET /api/orders/track?orderId=12&phone=0901000003`
* **Quyền:** Public

### 7.4. Tải file Excel Báo giá cho đơn hàng
* **Endpoint:** `GET /api/orders/{id}/quotation`
* **Quyền:** Public / Authenticated
* **Response:** File Excel `.xlsx` tự động sinh kèm bảng chiết khấu và thông tin y tế Kim Liên.

---

## 8. Quản lý Đơn hàng (Admin Orders)

* **Danh sách đơn hàng (Phân trang & Lọc):** `GET /api/admin/orders?page=0&keyword=&status=PENDING`
* **Xem chi tiết:** `GET /api/admin/orders/{id}`
* **Cập nhật trạng thái (PENDING, PROCESSING, SHIPPING, COMPLETED, CANCELLED):** `PUT /api/admin/orders/{id}/status`
* **Hủy đơn hàng:** `DELETE /api/admin/orders/{id}`
* **Quyền:** Admin

---

## 9. Tư vấn & Gửi file Báo giá (Consultations)

### 9.1. Khách hàng gửi yêu cầu tư vấn kèm file dự án
* **Endpoint:** `POST /api/consultations`
* **Quyền:** Public (Rate limit: 5 lần / 10 phút, cooldown 10s)
* **Content-Type:** `multipart/form-data`
* **Form Data:**
  - `fullName`: Nguyễn Văn An
  - `phone`: 0901000003
  - `email`: nguyenvana@gmail.com
  - `title`: Yêu cầu báo giá trọn gói phòng mổ
  - `content`: Đính kèm file danh mục thiết bị dự án...
  - `file`: (File đính kèm `.xlsx`, `.docx`, `.pdf`, tối đa 10MB)

### 9.2. [Admin] Quản lý yêu cầu tư vấn
* **Danh sách yêu cầu:** `GET /api/admin/consultations?page=0&size=10&status=PENDING`
* **Xem chi tiết & Tải file đính kèm:** `GET /api/admin/consultations/{id}`
* **Cập nhật trạng thái:** `PUT /api/admin/consultations/{id}/status`

---

## 10. Đánh giá & Bình luận (Reviews)

### 10.1. Xem đánh giá của sản phẩm (Public)
* **Endpoint:** `GET /api/products/{productId}/reviews`
* **Quyền:** Public

### 10.2. Gửi bình luận & Đánh giá sao
* **Endpoint:** `POST /api/products/{productId}/reviews`
* **Quyền:** Public (Rate limit: 10 đánh giá / 5 phút, cooldown 5s)
* **Request Body:**
```json
{
  "authorName": "BS. Nguyễn Văn An",
  "authorEmail": "nguyenvana@gmail.com",
  "rating": 5,
  "comment": "Máy chạy rất êm, đo oxy chính xác, giao hàng nhanh và hỗ trợ nhiệt tình."
}
```

### 10.3. [Admin] Quản lý & Kiểm duyệt đánh giá
* **Tìm kiếm & Phân trang:** `GET /api/admin/reviews?page=0&size=10&keyword=&status=ALL`
* **Ẩn / Hiện bình luận:** `PUT /api/admin/reviews/{id}/toggle-status`
* **Xóa bình luận:** `DELETE /api/admin/reviews/{id}`

---

## 11. Báo cáo & Thống kê Excel (User Reports)

* **Yêu cầu tạo báo cáo Excel mới:** `POST /api/user-reports`
* **Lấy danh sách báo cáo của tôi:** `GET /api/user-reports/my-reports`
* **Tải file Excel hoàn thành:** `GET /api/user-reports/{id}/download`
* **Xóa báo cáo:** `DELETE /api/user-reports/{id}`
* **Quyền:** Authenticated

---

## 12. Thư viện Media & Ảnh (Admin Images)

* **Danh sách ảnh trong kho:** `GET /api/admin/images?page=0&size=12&keyword=`
* **Upload hàng loạt file ảnh:** `POST /api/admin/images/upload` *(Multipart `files`)*
* **Thêm hàng loạt từ URL:** `POST /api/admin/images/batch-urls`
* **Xóa ảnh:** `DELETE /api/admin/images/{id}`
* **Quyền:** Admin

---

## 13. Quản lý Người dùng (Admin Users)

* **Danh sách người dùng:** `GET /api/admin/users?page=0&size=10&keyword=`
* **Xem chi tiết:** `GET /api/admin/users/{id}`
* **Tạo tài khoản Admin / Customer:** `POST /api/admin/users`
* **Cập nhật quyền hạn / Trạng thái:** `PUT /api/admin/users/{id}`
* **Khóa / Mở khóa tài khoản:** `PUT /api/admin/users/{id}/status`
* **Quyền:** Admin

---

## 14. Chuẩn Hóa Mã Trạng Thái HTTP & Bảo Mật Hệ Thống

### 14.1. Bảng mã trạng thái HTTP (HTTP Status Codes)

| Mã HTTP | Tên chuẩn | Ý nghĩa trong hệ thống MediEquip |
| :--- | :--- | :--- |
| **`200 OK`** | Thành công | Yêu cầu xử lý thành công, trả về dữ liệu tương ứng. |
| **`201 CREATED`** | Tạo mới thành công | Tạo mới thực thể (Đăng ký, Đơn hàng, Đánh giá, Yêu cầu tư vấn). |
| **`204 NO CONTENT`** | Không có nội dung | Thực hiện thao tác thành công (Đăng xuất, Xóa địa chỉ, Xóa ảnh). |
| **`400 BAD REQUEST`** | Dữ liệu không hợp lệ | Vi phạm validation schema, thiếu trường bắt buộc hoặc sai định dạng. |
| **`401 UNAUTHORIZED`** | Chưa xác thực | Token JWT hết hạn, thiếu Bearer token hoặc sai tài khoản/mật khẩu. |
| **`403 FORBIDDEN`** | Không đủ quyền | Khách hàng truy cập vào tài nguyên quản trị viên (Admin Endpoint). |
| **`404 NOT FOUND`** | Không tìm thấy | ID sản phẩm, đơn hàng, danh mục hoặc tài nguyên không tồn tại. |
| **`409 CONFLICT`** | Xung đột dữ liệu | Tên đăng nhập hoặc email đã tồn tại trên hệ thống. |
| **`423 LOCKED`** | Tạm khóa bảo vệ | Tài khoản/IP bị khóa 15 phút do nhập sai mật khẩu quá 5 lần. |
| **`429 TOO MANY REQUESTS`** | Quá giới hạn tần suất | Gửi OTP quá 3 lần/5 phút hoặc gửi yêu cầu liên tục dưới 45s. |
| **`500 INTERNAL ERROR`** | Lỗi máy chủ | Lỗi ngoại lệ chưa xử lý, sự cố kết nối cơ sở dữ liệu. |

### 14.2. Cơ chế Bảo mật Đa Tầng (Multi-tier Security Architecture)

1. **JWT Stateless Authentication**:
   - Khóa ký `HMAC-SHA256` với độ dài tối thiểu 32 ký tự (`APP_JWT_SECRET`).
   - Thời hạn hiệu lực: 3600 giây (1 giờ).
   - Cơ chế thu hồi tức thì qua `TokenBlacklistService` khi người dùng gọi `POST /api/auth/logout`.

2. **Cơ chế chống Brute-Force Đăng nhập**:
   - Sai $\ge 3$ lần: Kích hoạt bài toán CAPTCHA số học thử thách (`GET /api/auth/captcha`).
   - Sai $\ge 5$ lần: Tạm khóa đăng nhập từ Username & IP trong 900 giây (15 phút).

3. **Cơ chế xác thực Email OTP**:
   - Mã hóa 6 chữ số ngẫu nhiên qua `SecureRandom`.
   - Lưu trữ cache `ConcurrentHashMap` với thời gian tồn tại (TTL) 300 giây (5 phút).
   - Tự động hủy mã ngay sau khi xác thực thành công (One-time usage).

4. **Rate Limiting chống Spam API**:
   - `POST /api/auth/send-otp`: Tối đa 3 yêu cầu / 5 phút trên mỗi Email; giãn cách tối thiểu 45 giây.
   - `POST /api/auth/register`: Tối đa 5 yêu cầu / 15 phút trên mỗi địa chỉ IP.

---
*Tài liệu API được biên soạn và chuẩn hóa phục vụ tích hợp Frontend - Backend cho hệ thống MediEquip Vietnam.*