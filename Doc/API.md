# TÀI LIỆU CHI TIẾT HỆ THỐNG RESTful API (E-COMMERCE)

* **Base URL:** `http://localhost:8080`
* **Swagger UI Documentation:** `http://localhost:8080/swagger-ui/index.html`
* **Content-Type:** `application/json`
* **Authentication:** `Authorization: Bearer <JWT_TOKEN>`

---

## Cấu trúc Phản hồi Lỗi Chuẩn (Standard Error Response)
```json
{
  "status": 400,
  "message": "Thông điệp mô tả lỗi chi tiết",
  "timestamp": "2026-08-27T02:45:00.123Z"
}
```

---

## 1. Xác thực & Tài khoản (Authentication)

### 1.1. Đăng ký tài khoản mới (Register)
* **Endpoint:** `POST /api/auth/register`
* **Quyền:** Public (Không cần đăng nhập)
* **Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "nguyenvana@gmail.com",
  "password": "password123",
  "fullName": "Nguyễn Văn An",
  "phone": "0901000003"
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
  "createdAt": "2026-08-27T02:45:00"
}
```

### 1.2. Đăng nhập (Login)
* **Endpoint:** `POST /api/auth/login`
* **Quyền:** Public
* **Request Body:**
```json
{
  "username": "nguyenvana",
  "password": "password123"
}
```
* **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer"
}
```

### 1.3. Đăng xuất (Logout)
* **Endpoint:** `POST /api/auth/logout`
* **Quyền:** Public / Authenticated
* **Headers:** `Authorization: Bearer <token>`
* **Response:** `204 No Content`

### 1.4. Lấy thông tin phiên đăng nhập (Me)
* **Endpoint:** `GET /api/auth/me`
* **Quyền:** Authenticated (`CUSTOMER` hoặc `ADMIN`)
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):** Trả về đối tượng `Authentication` của Spring Security.

---

## 2. Thông tin Cá nhân & Đổi mật khẩu (My Account)

### 2.1. Xem thông tin cá nhân
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
  "createdAt": "2026-08-27T02:45:00"
}
```

### 2.2. Cập nhật thông tin cá nhân (Email & Full Name)
* **Endpoint:** `PUT /api/users/me`
* **Quyền:** Authenticated
* **Request Body:**
```json
{
  "email": "an.nguyen.new@gmail.com",
  "fullName": "Nguyễn Văn An (Updated)"
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
  "newPassword": "newPassword456"
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
    "province": "Hà Nội",
    "district": "Cầu Giấy",
    "ward": "Dịch Vọng Hậu",
    "addressDetail": "Số 18, Ngõ 86 Phố Duy Tân",
    "defaultAddress": true,
    "createdAt": "2026-08-27T02:45:00"
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
  "province": "Hà Nội",
  "district": "Nam Từ Liêm",
  "ward": "Mỹ Đình 1",
  "addressDetail": "Tòa FPT Tower",
  "defaultAddress": false
}
```
* **Response (200 OK):** Thông tin địa chỉ vừa tạo.

### 3.3. Cập nhật địa chỉ
* **Endpoint:** `PUT /api/users/me/addresses/{id}`
* **Quyền:** Authenticated

### 3.4. Xóa địa chỉ
* **Endpoint:** `DELETE /api/users/me/addresses/{id}`
* **Quyền:** Authenticated
* **Response:** `204 No Content`

---

## 4. Danh mục & Sản phẩm Công khai (Public Catalog)

### 4.1. Danh sách danh mục
* **Endpoint:** `GET /api/categories`
* **Quyền:** Public
* **Response (200 OK):** Danh sách các danh mục đang hoạt động (`ACTIVE`).

### 4.2. Danh sách sản phẩm & Tìm kiếm
* **Endpoint:** `GET /api/products?page=0&keyword=omron`
* **Quyền:** Public
* **Query Params:**
  * `page` (default: 0)
  * `keyword` (tùy chọn)
* **Response (200 OK):** Page<ProductResponse>

### 4.3. Chi tiết sản phẩm
* **Endpoint:** `GET /api/products/{id}`
* **Quyền:** Public

### 4.4. Lấy sản phẩm theo danh mục
* **Endpoint:** `GET /api/products/category/{categoryId}?page=0`
* **Quyền:** Public

---

## 5. Giỏ hàng (Cart)

### 5.1. Xem giỏ hàng của tôi
* **Endpoint:** `GET /api/cart`
* **Quyền:** Authenticated
* **Response (200 OK):**
```json
{
  "id": 1,
  "userId": 3,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Máy đo huyết áp bắp tay Omron HEM-7120",
      "price": 890000.00,
      "primaryImageUrl": "https://images.unsplash.com/...",
      "quantity": 1,
      "totalPrice": 890000.00
    }
  ],
  "totalAmount": 890000.00
}
```

### 5.2. Thêm sản phẩm vào giỏ
* **Endpoint:** `POST /api/cart/items`
* **Request Body:** `{"productId": 1, "quantity": 1}`

### 5.3. Cập nhật số lượng sản phẩm trong giỏ
* **Endpoint:** `PUT /api/cart/items/{productId}`
* **Request Body:** `{"quantity": 2}`

### 5.4. Xóa một sản phẩm khỏi giỏ
* **Endpoint:** `DELETE /api/cart/items/{productId}`

### 5.5. Xóa toàn bộ giỏ hàng
* **Endpoint:** `DELETE /api/cart`

---

## 6. Đơn hàng & Mua sắm (Orders)

### 6.1. Đặt hàng (Checkout)
* **Endpoint:** `POST /api/orders`
* **Quyền:** Authenticated
* **Request Body:**
```json
{
  "addressId": 1,
  "paymentMethod": "COD",
  "note": "Giao giờ hành chính"
}
```
* **Response (201 Created):** Chi tiết đơn hàng vừa tạo kèm trạng thái `PENDING`.

### 6.2. Lịch sử đơn hàng của tôi
* **Endpoint:** `GET /api/orders?page=0`
* **Quyền:** Authenticated

### 6.3. Chi tiết đơn hàng
* **Endpoint:** `GET /api/orders/{id}`
* **Quyền:** Authenticated

### 6.4. Hủy đơn hàng
* **Endpoint:** `POST /api/orders/{id}/cancel`
* **Quyền:** Authenticated (Chỉ cho phép hủy khi đơn ở trạng thái `PENDING` hoặc `CONFIRMED`).

---

## 7. Thanh toán (Payments)

### 7.1. Tạo URL thanh toán VNPay
* **Endpoint:** `GET /api/payments/vnpay/create?orderId=1`
* **Response (200 OK):** `{"paymentUrl": "https://sandbox.vnpayment.vn/..."}`

### 7.2. Callback VNPay (IPN / Return URL)
* **Endpoint:** `GET /api/payments/vnpay/callback`
* **Quyền:** Public

---

## 8. Danh sách Yêu thích & Đánh giá (Wishlist & Reviews)

### 8.1. Wishlist
* `GET /api/wishlist` : Lấy danh sách yêu thích
* `POST /api/wishlist/{productId}` : Thêm vào yêu thích
* `DELETE /api/wishlist/{productId}` : Xóa khỏi yêu thích

### 8.2. Reviews
* `GET /api/products/{productId}/reviews` : Xem đánh giá của sản phẩm (Public)
* `POST /api/products/{productId}/reviews` : Gửi đánh giá sau khi mua hàng (`rating`: 1-5, `orderId`, `comment`)

---

## 9. Quản trị viên (Admin Portal) - Role: `ROLE_ADMIN`

### 9.1. Quản lý Người dùng (`/api/admin/users`)
* `GET /api/admin/users?page=0&keyword=` : Danh sách người dùng (phân trang, tìm theo tên/SĐT)
* `GET /api/admin/users/{id}` : Chi tiết người dùng
* `POST /api/admin/users` : Tạo người dùng (Admin/Customer)
* `PUT /api/admin/users/{id}` : Cập nhật thông tin / quyền / trạng thái
* `DELETE /api/admin/users/{id}` : Xóa người dùng

### 9.2. Quản lý Danh mục (`/api/admin/categories`)
* `GET /api/admin/categories` : Tất cả danh mục (kể cả `INACTIVE`)
* `GET /api/admin/categories/{id}` : Chi tiết danh mục
* `POST /api/admin/categories` : Thêm danh mục
* `PUT /api/admin/categories/{id}` : Sửa danh mục
* `DELETE /api/admin/categories/{id}` : Xóa danh mục

### 9.3. Quản lý Sản phẩm (`/api/admin/products`)
* `GET /api/admin/products?page=0&keyword=` : Danh sách sản phẩm quản trị
* `GET /api/admin/products/{id}` : Chi tiết sản phẩm
* `POST /api/admin/products` : Thêm sản phẩm mới
* `PUT /api/admin/products/{id}` : Sửa thông tin sản phẩm, giá, tồn kho
* `DELETE /api/admin/products/{id}` : Xóa sản phẩm
* `POST /api/admin/products/{id}/images` : Thêm ảnh phụ cho sản phẩm

### 9.4. Quản lý Đơn hàng (`/api/admin/orders`)
* `GET /api/admin/orders?page=0&status=` : Xem tất cả đơn hàng hệ thống
* `GET /api/admin/orders/{id}` : Chi tiết đơn hàng
* `PUT /api/admin/orders/{id}/status` : Đổi trạng thái đơn hàng (`CONFIRMED`, `SHIPPING`, `DELIVERED`, `CANCELLED`)

### 9.5. Báo cáo & Thống kê (`/api/admin/statistics`)
* `GET /api/admin/statistics/overview` : Tổng quan doanh thu, số đơn, khách hàng mới
* `GET /api/admin/statistics/revenue?startDate=&endDate=` : Biểu đồ doanh thu theo thời gian