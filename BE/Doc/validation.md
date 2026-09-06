# 📋 TÀI LIỆU QUY CHUẨN VALIDATION & BẢO VỆ CHỐNG SPAM (ANTI-SPAM SPECIFICATION)

---

## 📌 I. TỔNG QUAN HỆ THỐNG
Tài liệu này định nghĩa chi tiết tất cả các quy tắc kiểm tra dữ liệu đầu vào (**Data Validation**), các cơ chế kiểm soát tần suất (**Rate Limiting**), cơ chế phòng chống brute-force đăng nhập (**Anti-Spam & CAPTCHA**), và chuẩn hóa cấu trúc lỗi phản hồi JSON của hệ thống E-Store Medical.

---

## 🛡️ II. CƠ CHẾ CHỐNG SPAM & BẢO MẬT HỆ THỐNG

### 1. Cơ Chế Chống Brute-Force Đăng Nhập & Khóa Tài Khoản
- **Theo dõi theo Key**: Kết hợp **Tên đăng nhập (Username)** và **Địa chỉ IP người dùng**.
- **Quy tắc cấp 1 (1 - 2 lần sai)**:
  - Phản hồi HTTP 401 Unauthorized kèm số lần đã thử sai `failedAttempts`.
- **Quy tắc cấp 2 (Sai từ lần thứ 3 - 4)**:
  - Hệ thống tự động kích hoạt cờ `requireCaptcha: true`.
  - Frontend bắt buộc hiển thị hộp thoại phép tính toán học CAPTCHA.
  - Người dùng phải giải đúng phép tính CAPTCHA mới được xử lý thông tin đăng nhập.
- **Quy tắc cấp 3 (Sai từ 5 lần liên tiếp)**:
  - Hệ thống **tạm khóa tài khoản / IP trong 15 phút (900 giây)**.
  - Phản hồi HTTP 423 (Locked) kèm thời gian khóa còn lại.
  - Frontend hiển thị đồng hồ đếm ngược thời gian mở khóa.
- **Khi đăng nhập thành công**: Reset toàn bộ lịch sử thử sai của Username/IP về 0.

### 2. Dịch Vụ CAPTCHA Toán Học Thân Thiện
- **Endpoint lấy câu hỏi**: `GET /api/auth/captcha` (Công khai).
- **Định dạng thử thách**: Phép cộng/trừ ngẫu nhiên trong phạm vi số nguyên dương (VD: `15 + 8 = ?`, `19 - 7 = ?`).
- **Thời hạn hiệu lực (TTL)**: 5 phút (300 giây).
- **Bảo mật**: Mã câu hỏi lưu trên memory server với mã định danh ngẫu nhiên UUID (`captchaId`), câu trả lời bị hủy ngay sau 1 lần xác thực (One-time Challenge).

### 3. Cơ Chế Rate Limiting (Giới Hạn Tần Suất Gửi Theo IP)
| Endpoint | Hành động | Giới hạn tối đa | Cửa sổ thời gian | Thời gian chờ giữa 2 lần (Cooldown) | Mã HTTP khi vi phạm |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST /api/consultations` | Gửi yêu cầu tư vấn / Báo giá y tế | **5 lần** | 10 phút (600s) | 10 giây | `429 Too Many Requests` |
| `POST /api/auth/register` | Đăng ký tài khoản mới | **5 lần** | 15 phút (900s) | 5 giây | `429 Too Many Requests` |
| `POST /api/products/{id}/reviews` | Gửi bình luận & đánh giá sản phẩm | **10 lần** | 5 phút (300s) | 5 giây | `429 Too Many Requests` |

---

## 📁 III. QUY ĐỊNH UPLOAD FILE ĐÍNH KÈM
Áp dụng cho tính năng Tư vấn & Báo giá thiết bị y tế (`POST /api/consultations`):

- **Dung lượng tối đa**: `25 MB` (26,214,400 bytes).
- **Định dạng được phép (Whitelist)**:
  - Tài liệu văn phòng: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.csv`
  - Hình ảnh: `.png`, `.jpg`, `.jpeg`, `.webp`
- **Định dạng bị cấm tuyệt đối (Blacklist chống mã độc)**:
  - `.exe`, `.bat`, `.cmd`, `.sh`, `.php`, `.jsp`, `.asp`, `.aspx`, `.js`, `.vbs`, `.jar`, `.html`, `.htm`, `.dll`
- **Mã lỗi khi vi phạm**:
  - Quá dung lượng: `HTTP 413 Payload Too Large`
  - Sai định dạng: `HTTP 400 Bad Request`

---

## 📝 IV. BIỂU MẪU VALIDATION CHI TIẾT TỪNG REQUEST (DTO)

### 1. Biểu Mẫu Đăng Ký Tài Khoản (`RegisterRequest`)
- **Endpoint**: `POST /api/auth/register`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `username` | String | Có | 3 - 50 ký tự, regex: `^[a-zA-Z0-9._-]+$` | `Tên đăng nhập chỉ được chứa chữ cái, chữ số, dấu chấm, gạch dưới và gạch nối (3-50 ký tự)` |
| `email` | String | Có | Định dạng email hợp lệ | `Email không đúng định dạng (VD: user@example.com)` |
| `password` | String | Có | Tối thiểu 6 ký tự | `Mật khẩu phải có ít nhất 6 ký tự` |
| `fullName` | String | Có | 2 - 100 ký tự | `Họ và tên phải từ 2 đến 100 ký tự` |
| `phone` | String | Không | Regex số VN: `^$|^(0[3\|5\|7\|8\|9])+([0-9]{8})$` | `Số điện thoại di động không hợp lệ (VD: 0901234567)` |

---

### 2. Biểu Mẫu Đăng Nhập (`LoginRequest`)
- **Endpoint**: `POST /api/auth/login`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `username` | String | Có | Không rỗng | `Tên đăng nhập không được để trống` |
| `password` | String | Có | Không rỗng | `Mật khẩu không được để trống` |
| `captchaId` | String (UUID) | Điều kiện | Bắt buộc khi `requireCaptcha = true` | `Mã xác thực CAPTCHA không chính xác hoặc đã hết hạn` |
| `captchaAnswer`| String | Điều kiện | Bắt buộc khi `requireCaptcha = true` | `Câu trả lời CAPTCHA không chính xác` |

---

### 3. Biểu Mẫu Tư Vấn & Gửi File Báo Giá Y Tế (`ConsultationRequest`)
- **Endpoint**: `POST /api/consultations` (`multipart/form-data`)

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `fullName` | String | Có | 2 - 100 ký tự | `Họ và tên phải từ 2 đến 100 ký tự` |
| `phone` | String | Có | 10 số di động VN: `^(0[3\|5\|7\|8\|9])+([0-9]{8})$` | `Số điện thoại không hợp lệ (Phải là số di động VN 10 số, VD: 0901234567)` |
| `email` | String | Không | Định dạng email hợp lệ | `Email không đúng định dạng` |
| `title` | String | Có | 5 - 200 ký tự | `Tiêu đề yêu cầu phải từ 5 đến 200 ký tự` |
| `content` | String | Có | 10 - 2000 ký tự | `Nội dung yêu cầu phải từ 10 đến 2000 ký tự` |
| `userId` | Long | Không | ID tài khoản người gửi (nếu đã đăng nhập) | - |
| `file` | MultipartFile | Không | Tối đa 25MB, định dạng: doc, docx, xls, xlsx, pdf, csv, png, jpg, webp | `Định dạng file không được hỗ trợ hoặc vượt quá 25MB` |

---

### 4. Biểu Mẫu Đánh Giá & Bình Luận Sản Phẩm (`ReviewRequest`)
- **Endpoint**: `POST /api/products/{productId}/reviews`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `userId` | Long | Có | ID tài khoản đã đăng nhập | `Vui lòng đăng nhập để gửi bình luận đánh giá` |
| `rating` | Integer | Có | Số nguyên từ 1 đến 5 | `Đánh giá tối thiểu 1 sao và tối đa 5 sao` |
| `comment` | String | Có | 5 - 1000 ký tự | `Nội dung bình luận phải từ 5 đến 1000 ký tự` |
| `orderId` | Long | Không | ID đơn hàng đã mua để gắn tag "Đã mua hàng" | - |

---

### 5. Biểu Mẫu Địa Chỉ Nhận Hàng (`AddressRequest`)
- **Endpoint**: `POST /api/users/me/addresses`, `PUT /api/users/me/addresses/{id}`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `recipientName` | String | Có | 2 - 100 ký tự | `Họ tên người nhận phải từ 2 đến 100 ký tự` |
| `phone` | String | Có | 10 số di động VN: `^(0[3\|5\|7\|8\|9])+([0-9]{8})$` | `Số điện thoại người nhận không hợp lệ (VD: 0901234567)` |
| `province` | String | Có | Tên Tỉnh / Thành phố | `Tỉnh/Thành phố không được để trống` |
| `district` | String | Có | Tên Quận / Huyện | `Quận/Huyện không được để trống` |
| `ward` | String | Có | Tên Phường / Xã | `Phường/Xã không được để trống` |
| `addressDetail` | String | Có | 3 - 255 ký tự (Số nhà, tên đường...) | `Địa chỉ chi tiết phải từ 3 đến 255 ký tự` |
| `defaultAddress`| Boolean | Không | Đặt làm địa chỉ mặc định | - |

---

### 6. Biểu Mẫu Cập Nhật Hồ Sơ Cá Nhân (`AccountUpdateRequest`)
- **Endpoint**: `PUT /api/users/me`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `fullName` | String | Có | 2 - 100 ký tự | `Họ và tên phải từ 2 đến 100 ký tự` |
| `email` | String | Có | Định dạng email hợp lệ | `Email không đúng định dạng` |

---

### 7. Biểu Mẫu Đổi Mật Khẩu (`PasswordChangeRequest`)
- **Endpoint**: `PUT /api/users/me/password`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `currentPassword` | String | Có | Không rỗng | `Mật khẩu hiện tại không được để trống` |
| `newPassword` | String | Có | Tối thiểu 6 ký tự | `Mật khẩu mới phải có ít nhất 6 ký tự` |

---

### 8. Biểu Mẫu Quản Lý Sản Phẩm (`ProductRequest`)
- **Endpoint**: `POST /api/admin/products`, `PUT /api/admin/products/{id}`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `name` | String | Có | 2 - 255 ký tự | `Tên sản phẩm phải từ 2 đến 255 ký tự` |
| `categoryId` | Long | Có | ID danh mục hợp lệ | `Danh mục sản phẩm không được để trống` |
| `price` | BigDecimal | Có | Số dương `>= 0.0` | `Giá sản phẩm phải lớn hơn hoặc bằng 0` |
| `stock` | Integer | Có | Số nguyên `>= 0` | `Số lượng tồn kho phải lớn hơn hoặc bằng 0` |
| `primaryImageUrl` | String | Không | Đường dẫn ảnh chính | - |
| `description` | String | Không | Mô tả chi tiết sản phẩm | - |
| `status` | Enum | Không | `ACTIVE` hoặc `INACTIVE` | - |

---

### 9. Biểu Mẫu Quản Lý Banner Slider (`BannerRequest`)
- **Endpoint**: `POST /api/admin/banners`, `PUT /api/admin/banners/{id}`

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc kỹ thuật | Thông báo lỗi (Message) |
| :--- | :--- | :---: | :--- | :--- |
| `title` | String | Có | 2 - 150 ký tự | `Tiêu đề banner không được để trống` |
| `imageUrl` | String | Có | Không rỗng, link hình ảnh | `Link ảnh banner không được để trống` |
| `buttonText` | String | Không | Tên nút bấm chuyển hướng | - |
| `buttonLink` | String | Không | Đường dẫn URL nút bấm | - |
| `displayOrder` | Integer | Không | Thứ tự hiển thị | - |
| `status` | Enum | Không | `ACTIVE` hoặc `INACTIVE` | - |

---

## 🛑 V. CẤU TRÚC PHẢN HỒI LỖI JSON CHUẨN HÓA (ERROR RESPONSE SCHEMAS)

### 1. Lỗi Dữ Liệu Không Hợp Lệ (`HTTP 400 Bad Request` - Bean Validation)
```json
{
  "status": 400,
  "error": "Validation Error",
  "message": "Dữ liệu gửi lên không đúng định dạng. Vui lòng kiểm tra lại các trường.",
  "fieldErrors": {
    "fullName": "Họ và tên phải từ 2 đến 100 ký tự",
    "phone": "Số điện thoại không hợp lệ (Phải là số di động VN 10 chữ số, VD: 0901234567)",
    "email": "Email không đúng định dạng (VD: user@example.com)"
  },
  "timestamp": "2026-09-04T14:45:00.123456Z"
}
```

### 2. Lỗi Đăng Nhập Sai Mật Khẩu (HTTP 401 - Có Cờ Yêu Cầu CAPTCHA)
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Tên đăng nhập hoặc mật khẩu không chính xác! (Sai 3/5 lần)",
  "failedAttempts": 3,
  "requireCaptcha": true,
  "timestamp": "2026-09-04T14:45:10.123456Z"
}
```

### 3. Lỗi Tài Khoản Hoặc IP Bị Tạm Khóa (HTTP 423 Locked)
```json
{
  "status": 423,
  "error": "Locked",
  "message": "Bạn đã nhập sai 5 lần liên tiếp. Tài khoản/IP bị tạm khóa trong 900 giây.",
  "timestamp": "2026-09-04T14:46:00.123456Z"
}
```

### 4. Lỗi Quá Giới Hạn Tần Suất Gửi (HTTP 429 Too Many Requests)
```json
{
  "status": 429,
  "error": "429 TOO_MANY_REQUESTS",
  "message": "Bạn đã vượt quá giới hạn gửi yêu cầu (5 lần/10 phút). Vui lòng thử lại sau.",
  "timestamp": "2026-09-04T14:47:00.123456Z"
}
```

### 5. Lỗi Dung Lượng File Vượt Quá Giới Hạn (HTTP 413 Payload Too Large)
```json
{
  "status": 413,
  "error": "Payload Too Large",
  "message": "Dung lượng file tải lên vượt quá giới hạn tối đa cho phép (25MB)!",
  "timestamp": "2026-09-04T14:48:00.123456Z"
}
```

---

## 📊 VI. QUY CHUẨN NHẬP SẢN PHẨM HÀNG LOẠT BẰNG EXCEL (BULK PRODUCT IMPORT)

### 1. Endpoint & Giao Thức
- **Tải file mẫu**: `GET /api/admin/products/excel-template` -> Trả về file `mau_nhap_san_pham.xlsx` kèm Sheet 1 (Mẫu nhập) & Sheet 2 (Danh mục tham khảo).
- **Tải lên & Xử lý**: `POST /api/admin/products/import-excel` (Content-Type: `multipart/form-data`).
- **Xuất dữ liệu**: `GET /api/admin/products/export-excel` -> Trả về file `danh_sach_san_pham.xlsx`.

### 2. Bảng Quy Chuẩn Cột Trong File Excel
| Cột | Tên Cột | Bắt buộc | Kiểu dữ liệu | Quy tắc xác thực | Xử lý khi lỗi |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **A** | `Tên sản phẩm (*)` | **Có** | String | 2 - 255 ký tự, không được để trống | Báo lỗi dòng, ghi nhận vào `errors` |
| **B** | `Mã (ID) hoặc Tên danh mục (*)` | **Có** | Số hoặc String | Phải khớp với 1 danh mục đang hoạt động trong DB | Báo lỗi dòng: "Không tìm thấy danh mục" |
| **C** | `Đường dẫn tĩnh (Slug)` | Không | String | Ký tự không dấu `[a-z0-9-]`. Nếu để trống -> tự sinh slug từ tên sản phẩm. | Tự động thêm hậu tố `-1, -2` nếu trùng lặp |
| **D** | `Giá bán (VNĐ)` | Không | Số ($\ge 0$) | Số nguyên hoặc số thực không âm | Báo lỗi dòng: "Giá sản phẩm không hợp lệ" |
| **E** | `Số lượng tồn kho (*)` | **Có** | Số nguyên ($\ge 0$) | Không được âm, mặc định 0 nếu không điền | Báo lỗi dòng: "Số lượng tồn kho không hợp lệ" |
| **F** | `Link ảnh chính (URL)` | Không | URL String | Đường dẫn ảnh hợp lệ (http://, https://, /uploads/...) | Lưu ảnh đại diện sản phẩm |
| **G** | `Mô tả sản phẩm` | Không | String (Text) | Mô tả chi tiết tính năng, thông số | Lưu vào description |
| **H** | `Trạng thái` | Không | Enum | `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` (Mặc định: ACTIVE) | Mặc định gán ACTIVE nếu không đúng |

### 3. Cấu Trúc Phản Hồi Kết Quả Import (`ProductImportResult`)
```json
{
  "totalRows": 15,
  "successCount": 14,
  "errorCount": 1,
  "errors": [
    {
      "rowNumber": 4,
      "productName": "Máy đo đường huyết Accu-Chek",
      "reason": "Không tìm thấy danh mục: 'Danh Mục Không Tồn Tại'. Vui lòng kiểm tra Sheet 'DanhMucThamKhao'"
    }
  ],
  "importedProducts": [
    {
      "id": 101,
      "name": "Máy đo huyết áp bắp tay Omron HEM-7120",
      "slug": "may-do-huyet-ap-omron-hem-7120",
      "price": 790000.0,
      "stock": 50,
      "status": "ACTIVE"
    }
  ]
}
```

