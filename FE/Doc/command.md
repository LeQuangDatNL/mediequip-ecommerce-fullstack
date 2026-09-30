# 🛠️ Hướng Dẫn Lệnh Frontend (React + Vite)

Tài liệu tổng hợp tất cả các câu lệnh thao tác và khởi chạy phân hệ Frontend trong thư mục `FE/shop`.

---

## 🚀 1. Di chuyển vào thư mục Frontend
```bash
cd FE/shop
```

---

## 📦 2. Cài đặt các thư viện phụ thuộc (Dependencies)
```bash
npm install
```
*(Nếu muốn cài đặt chuẩn xác theo lockfile trên môi trường CI/CD: `npm ci`)*

---

## ⚙️ 3. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```bash
# Trên Windows (PowerShell / CMD) hoặc Linux / macOS:
cp .env.example .env
```
Nội dung file `.env`:
- `VITE_API_BASE_URL=http://localhost:8080`: Đường dẫn kết nối API Backend Spring Boot.
- `VITE_GEMINI_API_KEY=your_gemini_api_key_here`: Khóa API Google Gemini AI cho Bot Chat tư vấn y tế.

---

## 💻 4. Khởi chạy Development Server (Môi trường phát triển)
```bash
npm run dev
```
- **Địa chỉ truy cập mặc định**: `http://localhost:5173` (hoặc cổng được Vite cấp phát).
- Hỗ trợ Hot Module Replacement (HMR) cập nhật giao diện tức thì khi chỉnh sửa code.

---

## 🏗️ 5. Build dự án cho môi trường Production
```bash
npm run build
```
- Mã nguồn sẽ được tối ưu, nén code và xuất ra thư mục `FE/shop/dist/`.
- Sẵn sàng để phục vụ qua Web Server như Nginx hoặc đưa vào Docker container.

---

## 🔍 6. Chạy thử bản Build Production (Preview)
```bash
npm run preview
```
- Chạy local server để kiểm thử chính xác ứng dụng sau khi đã build production.

---

## 🧹 7. Kiểm tra lỗi cú pháp mã nguồn (Linting)
```bash
npm run lint
```
- Sử dụng Oxlint siêu tốc để quét và phát hiện các lỗi cú pháp, biến thừa hoặc import lỗi.

---

## 🐳 8. Đóng gói Docker Container Frontend riêng lẻ
```bash
# Build Docker Image Frontend (kèm Nginx reverse proxy)
docker build -t shop-frontend .

# Chạy Container Frontend trên cổng 80
docker run -d -p 80:80 --name shop-frontend-container shop-frontend
```