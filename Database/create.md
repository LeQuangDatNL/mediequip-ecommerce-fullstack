-- =========================================================
-- E-COMMERCE DATABASE (CHUẨN HÓA BÁO GIÁ THIẾT BỊ Y TẾ)
-- MySQL 8.0+ / utf8mb4_unicode_ci
-- =========================================================

DROP DATABASE IF EXISTS ecommerce_db;

CREATE DATABASE ecommerce_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;


-- =========================================================
-- 1. USERS (TÀI KHOẢN NGƯỜI DÙNG & QUẢN TRỊ VIÊN)
-- =========================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,

    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    status ENUM('ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. ORIGINS (XUẤT XỨ / QUỐC GIA SẢN XUẤT THIẾT BỊ)
-- =========================================================

CREATE TABLE origins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NULL, -- Ví dụ: VN, JP, DE, US, KR, CH, CN, FR
    description TEXT NULL,

    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. CATEGORIES (NHÓM DANH MỤC SẢN PHẨM)
-- =========================================================

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,

    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. PRODUCTS (SẢN PHẨM / THIẾT BỊ Y TẾ)
-- Lưu ý: Đã loại bỏ cột Giá và Tồn kho để chuyển sang mô hình Báo Giá theo dự án
-- =========================================================

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    category_id BIGINT NOT NULL,
    origin_id BIGINT NULL,

    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,

    primary_image_url VARCHAR(500) NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_products_origin
        FOREIGN KEY (origin_id)
        REFERENCES origins(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================================
-- 5. IMAGES (THƯ VIỆN ẢNH / MEDIA GALLERY DÙNG CHUNG)
-- =========================================================

CREATE TABLE images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NULL,
    file_size BIGINT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 6. PRODUCT IMAGES (BỘ SƯU TẬP ẢNH CHI TIẾT THEO SẢN PHẨM)
-- =========================================================

CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 7. ADDRESSES (ĐỊA CHỈ GIAO HÀNG / TRỤ SỞ)
-- =========================================================

CREATE TABLE addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,

    address_detail VARCHAR(255) NOT NULL,

    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_addresses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 8. CARTS (GIỎ HÀNG / DANH SÁCH YÊU CẦU BÁO GIÁ)
-- =========================================================

CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- 9. CART ITEMS (MẶT HÀNG TRONG GIỎ)
-- =========================================================

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT uq_cart_product
        UNIQUE (cart_id, product_id),

    CONSTRAINT chk_cart_quantity
        CHECK (quantity > 0)
);


-- =========================================================
-- 10. ORDERS (ĐƠN HÀNG / BẢNG BÁO GIÁ DỰ ÁN)
-- =========================================================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    address_id BIGINT NOT NULL,

    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,

    payment_method ENUM(
        'COD',
        'VNPAY'
    ) NOT NULL DEFAULT 'COD',

    payment_status ENUM(
        'UNPAID',
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'UNPAID',

    order_status ENUM(
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPING',
        'DELIVERED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',

    note TEXT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_orders_address
        FOREIGN KEY (address_id)
        REFERENCES addresses(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);


-- =========================================================
-- 11. ORDER ITEMS (CHI TIẾT MẶT HÀNG BÁO GIÁ TRONG ĐƠN)
-- =========================================================

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,

    -- Snapshot tại thời điểm duyệt báo giá
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_order_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_order_item_price
        CHECK (price >= 0)
);


-- =========================================================
-- 12. PAYMENTS (GIAO DỊCH THANH TOÁN)
-- =========================================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    transaction_code VARCHAR(100) UNIQUE NULL,
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,

    payment_method ENUM(
        'COD',
        'VNPAY'
    ) NOT NULL,

    status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING',

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_payment_amount
        CHECK (amount >= 0)
);


-- =========================================================
-- 13. REVIEWS (ĐÁNH GIÁ & BÌNH LUẬN SẢN PHẨM)
-- =========================================================

CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,

    rating TINYINT NOT NULL,
    comment TEXT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reviews_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT uq_user_product_order
        UNIQUE (user_id, product_id, order_id)
);


-- =========================================================
-- 14. WISHLIST (DANH SÁCH QUAN TÂM / YÊU THÍCH)
-- =========================================================

CREATE TABLE wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_wishlist_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_wishlist_user_product
        UNIQUE (user_id, product_id)
);


-- =========================================================
-- 15. CONSULTATIONS (YÊU CẦU TƯ VẤN & GỬI FILE BÁO GIÁ)
-- =========================================================

CREATE TABLE consultations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NULL,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,

    -- File đính kèm (Excel, Word, PDF, Ảnh danh mục thiết bị cần báo giá)
    attachment_url VARCHAR(500) NULL,
    attachment_name VARCHAR(255) NULL,
    file_type VARCHAR(255) NULL,
    file_size BIGINT NULL,

    status ENUM(
        'PENDING',
        'CONTACTED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',

    admin_notes TEXT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_consultations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- =========================================================
-- 16. USER REPORTS (THEO DÕI VÀ XUẤT BÁO CÁO EXCEL CỦA NGƯỜI DÙNG)
-- =========================================================

CREATE TABLE user_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    report_type VARCHAR(50) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',

    file_name VARCHAR(255) NULL,
    file_path VARCHAR(500) NULL,
    file_size BIGINT NULL,
    download_url VARCHAR(500) NULL,
    error_message TEXT NULL,

    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_user_reports_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =========================================================
-- INDEX TỐI ƯU HIỆU NĂNG QUERY VÀ TÌM KIẾM
-- =========================================================

-- Origins
CREATE INDEX idx_origins_code ON origins(code);
CREATE INDEX idx_origins_status ON origins(status);
CREATE INDEX idx_origins_is_deleted ON origins(is_deleted);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_is_deleted ON categories(is_deleted);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_origin ON products(origin_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_deleted ON products(is_deleted);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

-- Images
CREATE INDEX idx_images_is_deleted ON images(is_deleted);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Addresses & Carts
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- Orders & Payments
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_is_deleted ON orders(is_deleted);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);

-- Reviews & Wishlist
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_is_deleted ON reviews(is_deleted);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- Consultations & User Reports
CREATE INDEX idx_consultations_user ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_is_deleted ON consultations(is_deleted);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);
CREATE INDEX idx_user_reports_user ON user_reports(user_id);
CREATE INDEX idx_user_reports_status ON user_reports(status);
CREATE INDEX idx_user_reports_is_deleted ON user_reports(is_deleted);


-- =========================================================
-- KIỂM TRA TOÀN BỘ DANH SÁCH BẢNG
-- =========================================================

SHOW TABLES;