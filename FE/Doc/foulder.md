my-ecommerce-store/
├── public/                     # Ảnh tĩnh, favicon, logo công ty...
├── src/
│   ├── api/                    # Quản lý gọi API (Axios instance)
│   │   ├── axiosClient.js      # Cấu hình base URL, token authorization
│   │   ├── authApi.js          # API Đăng nhập/Đăng ký
│   │   ├── productApi.js       # API Lấy danh sách, chi tiết sản phẩm
│   │   └── orderApi.js         # API Đặt hàng, thanh toán
│   │
│   ├── assets/                 # Hình ảnh, icon nội bộ dùng trong UI
│   │
│   ├── components/             # Các Component UI dùng chung ở nhiều trang
│   │   ├── common/             # Button, Input, Loading, Modal...
│   │   ├── layout/             # Header, Footer, Sidebar, Navbar...
│   │   └── product/            # ProductCard, ProductGrid, ProductFilter...
│   │
│   ├── features/               # Quản lý logic Redux Toolkit theo từng tính năng
│   │   ├── cart/               # Logic giỏ hàng (cartSlice.js)
│   │   ├── auth/               # Logic đăng nhập (authSlice.js)
│   │   └── product/            # Logic sản phẩm (productSlice.js)
│   │
│   ├── pages/                  # Các màn hình/trang chính của ứng dụng
│   │   ├── HomePage.jsx        # Trang chủ
│   │   ├── ProductPage.jsx     # Trang danh sách sản phẩm
│   │   ├── ProductDetail.jsx   # Trang chi tiết 1 sản phẩm
│   │   ├── CartPage.jsx        # Trang giỏ hàng
│   │   ├── CheckoutPage.jsx    # Trang thanh toán
│   │   ├── LoginPage.jsx       # Trang đăng nhập
│   │   └── NotFoundPage.jsx    # Trang 404
│   │
│   ├── routes/                 # Định tuyến trang (React Router)
│   │   ├── AppRoutes.jsx       # Cấu hình tất cả tuyến đường (URL)
│   │   └── PrivateRoute.jsx    # Chặn truy cập nếu chưa đăng nhập (Cho trang Checkout, Admin)
│   │
│   ├── utils/                  # Các hàm tiện ích dùng chung
│   │   ├── formatCurrency.js   # Hàm đổi số thành tiền Việt (ví dụ: 100000 -> 100.000 đ)
│   │   └── storage.js          # Hàm lưu/đọc dữ liệu từ LocalStorage
│   │
│   ├── app/                    # Cấu hình Redux Store
│   │   └── store.js            # Khai báo Redux Store chính
│   │
│   ├── App.jsx                 # Component gốc chứa Routes và Layout
│   ├── main.jsx                # File khởi chạy React (chứa Provider Redux, QueryClient, Toast)
│   └── index.css               # Import Tailwind CSS vào đây
│
├── .env                        # Chứa biến môi trường (URL API backend)
├── tailwind.config.js          # File cấu hình Tailwind CSS
└── package.json