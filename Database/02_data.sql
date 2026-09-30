USE ecommerce_db;

-- =========================================================
-- TẮT SAFE UPDATE VÀ KHÓA NGOẠI TRƯỚC KHI NẠP DỮ LIỆU
-- =========================================================
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM user_reports WHERE id > 0;
DELETE FROM consultations WHERE id > 0;
DELETE FROM reviews WHERE id > 0;
DELETE FROM wishlist WHERE id > 0;
DELETE FROM payments WHERE id > 0;
DELETE FROM order_items WHERE id > 0;
DELETE FROM orders WHERE id > 0;
DELETE FROM cart_items WHERE id > 0;
DELETE FROM carts WHERE id > 0;
DELETE FROM addresses WHERE id > 0;
DELETE FROM product_images WHERE id > 0;
DELETE FROM images WHERE id > 0;
DELETE FROM products WHERE id > 0;
DELETE FROM categories WHERE id > 0;
DELETE FROM origins WHERE id > 0;
DELETE FROM users WHERE id > 0;

ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE origins AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE images AUTO_INCREMENT = 1;
ALTER TABLE product_images AUTO_INCREMENT = 1;
ALTER TABLE addresses AUTO_INCREMENT = 1;
ALTER TABLE carts AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;
ALTER TABLE wishlist AUTO_INCREMENT = 1;
ALTER TABLE consultations AUTO_INCREMENT = 1;
ALTER TABLE user_reports AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- =========================================================
-- 1. USERS (Mật khẩu mặc định: 123456)
-- =========================================================
INSERT INTO users (id, username, email, password_hash, full_name, phone, role, status, is_deleted) VALUES
(1, 'admin', 'admin@shop.vn', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Quản trị viên Hệ thống', '0901000001', 'ADMIN', 'ACTIVE', FALSE),
(2, 'manager', 'manager@shop.vn', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Nguyễn Quản Lý', '0901000002', 'ADMIN', 'ACTIVE', FALSE),
(3, 'nguyenvana', 'nguyenvana@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Nguyễn Văn An', '0901000003', 'CUSTOMER', 'ACTIVE', FALSE),
(4, 'tranthib', 'tranthib@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Trần Thị Bình', '0901000004', 'CUSTOMER', 'ACTIVE', FALSE),
(5, 'lequangc', 'lequangc@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Lê Quang Cường', '0901000005', 'CUSTOMER', 'ACTIVE', FALSE),
(6, 'phamthid', 'phamthid@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Phạm Thị Dung', '0901000006', 'CUSTOMER', 'ACTIVE', FALSE),
(7, 'hoangvane', 'hoangvane@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Hoàng Văn Em', '0901000007', 'CUSTOMER', 'ACTIVE', FALSE),
(8, 'vuthif', 'vuthif@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Vũ Thị Phương', '0901000008', 'CUSTOMER', 'ACTIVE', FALSE),
(9, 'dangvangiang', 'danggiang@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Đặng Văn Giang', '0901000009', 'CUSTOMER', 'ACTIVE', FALSE),
(10, 'buithihanh', 'buihanh@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Bùi Thị Hạnh', '0901000010', 'CUSTOMER', 'ACTIVE', FALSE),
(11, 'dothikim', 'dokim@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Đỗ Thị Kim', '0901000011', 'CUSTOMER', 'ACTIVE', FALSE),
(12, 'nguyenkhoa', 'khoanguyen@gmail.com', '$2a$12$vM9iCt0s61K.CDU6aLZ75uUCBd5wUO9PDEmYMj.N7gmcv3odgNV0q', 'Nguyễn Anh Khoa', '0901000012', 'CUSTOMER', 'BANNED', TRUE);

-- =========================================================
-- 2. ORIGINS (8 Quốc gia xuất xứ thiết bị y tế hàng đầu)
-- =========================================================
INSERT INTO origins (id, name, code, description, status, is_deleted) VALUES
(1, 'Việt Nam', 'VN', 'Sản phẩm sản xuất nội địa đạt chuẩn Bộ Y Tế và tiêu chuẩn xuất khẩu', 'ACTIVE', FALSE),
(2, 'Nhật Bản', 'JP', 'Công nghệ chính xác cao, tiêu chuẩn JIS và độ bền bỉ vượt trội', 'ACTIVE', FALSE),
(3, 'CHLB Đức', 'DE', 'Tiêu chuẩn CE Châu Âu, kiểm định y khoa nghiêm ngặt hàng đầu thế giới', 'ACTIVE', FALSE),
(4, 'Hoa Kỳ', 'US', 'Chứng nhận FDA Hoa Kỳ, công nghệ tiên tiến phục hồi và chăm sóc sức khỏe', 'ACTIVE', FALSE),
(5, 'Hàn Quốc', 'KR', 'Thiết bị y tế chỉnh hình và công nghệ chăm sóc sức khỏe gia đình hiện đại', 'ACTIVE', FALSE),
(6, 'Thụy Sĩ', 'CH', 'Tiêu chuẩn y tế chuẩn xác cao, dẫn đầu trong thiết bị đo lường sinh học', 'ACTIVE', FALSE),
(7, 'Trung Quốc', 'CN', 'Sản phẩm liên doanh và xuất khẩu chính ngạch đạt chuẩn ISO quốc tế', 'ACTIVE', FALSE),
(8, 'Pháp', 'FR', 'Dược mỹ phẩm và thiết bị da liễu đạt chuẩn kiểm nghiệm lâm sàng Châu Âu', 'ACTIVE', FALSE);

-- =========================================================
-- 3. CATEGORIES (12 Danh mục y tế)
-- =========================================================
INSERT INTO categories (id, name, slug, description, status, is_deleted) VALUES
(1, 'Thiết bị y tế gia đình', 'thiet-bi-y-te-gia-dinh', 'Máy đo huyết áp, nhiệt kế, máy đo đường huyết và dụng cụ y tế gia đình', 'ACTIVE', FALSE),
(2, 'Thực phẩm chức năng & Vitamin', 'thuc-pham-chuc-nang-vitamin', 'Bổ sung vitamin, khoáng chất, hỗ trợ xương khớp, tim mạch và miễn dịch', 'ACTIVE', FALSE),
(3, 'Chăm sóc cá nhân & Làm đẹp', 'cham-soc-ca-nhan-lam-dep', 'Dược mỹ phẩm, sữa rửa mặt, kem dưỡng ẩm và sản phẩm chăm sóc cơ thể', 'ACTIVE', FALSE),
(4, 'Mẹ và Bé', 'me-va-be', 'Sữa dinh dưỡng, máy hút sữa, vitamin cho mẹ bầu và chăm sóc bé sơ sinh', 'ACTIVE', FALSE),
(5, 'Dụng cụ sơ cứu & Phục hồi', 'dung-cu-so-cuu-thiet-bi-phuc-hoi', 'Băng gạc, dung dịch sát khuẩn, xe lăn, nạng tập đi', 'ACTIVE', FALSE),
(6, 'Thiết bị massage & Trị liệu', 'thiet-bi-massage-tri-lieu', 'Gối massage cổ vai gáy, bồn ngâm chân massage, đệm massage toàn thân', 'ACTIVE', FALSE),
(7, 'Khẩu trang & Đồ bảo hộ y tế', 'khau-trang-do-bao-ho-y-te', 'Khẩu trang N95, khẩu trang y tế 4 lớp kháng khuẩn, găng tay y tế', 'ACTIVE', FALSE),
(8, 'Vệ sinh tai mũi họng & Răng miệng', 've-sinh-tai-mui-hong-rang-mieng', 'Bình rửa mũi, máy tăm nước, bàn chải điện, nước súc miệng diệt khuẩn', 'ACTIVE', FALSE),
(9, 'Dinh dưỡng y học & Bệnh lý', 'dinh-duong-y-hoc-benh-ly', 'Sữa cho người tiểu đường, dinh dưỡng cho bệnh nhân thận và người cao tuổi', 'ACTIVE', FALSE),
(10, 'Dụng cụ chỉnh hình & Đai nẹp', 'dung-cu-chinh-hinh-dai-nep', 'Đai lưng cột sống, đai cố định khớp gối, nẹp cổ và đai chống gù lưng', 'ACTIVE', FALSE),
(11, 'Tinh dầu & Liệu pháp thảo dược', 'tinh-dau-lieu-phap-thao-duoc', 'Tinh dầu tràm nguyên chất, dầu khuynh diệp, thảo dược ngâm chân', 'ACTIVE', FALSE),
(12, 'Danh mục lưu trữ & Tạm ngưng', 'danh-muc-luu-tru-tam-ngung', 'Nhóm sản phẩm tạm ngưng kinh doanh', 'INACTIVE', TRUE);

-- =========================================================
-- 4. PRODUCTS (24 Sản phẩm y tế gắn Xuất xứ, loại bỏ Giá & Tồn kho)
-- =========================================================
INSERT INTO products (id, category_id, origin_id, name, slug, description, primary_image_url, status, is_deleted) VALUES
(1, 1, 2, 'Máy đo huyết áp bắp tay Omron HEM-7120', 'may-do-huyet-ap-bap-tay-omron-hem-7120', 'Công nghệ Intellisense tự động bơm khí, báo cử động người và cảnh báo huyết áp cao', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600', 'ACTIVE', FALSE),
(2, 1, 6, 'Nhiệt kế hồng ngoại đo trán Microlife NC200', 'nhiet-ke-hong-ngoai-do-tran-microlife-nc200', 'Đo không chạm khoảng cách 5cm, kết quả chuẩn xác sau 1 giây, có đèn báo sốt', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', 'ACTIVE', FALSE),
(3, 1, 3, 'Máy đo đường huyết Accu-Chek Guide Me', 'may-do-duong-huyet-accu-chek-guide-me', 'Chuẩn ISO 15197:2013, lấy máu không đau, kết nối Bluetooth với ứng dụng điện thoại', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600', 'ACTIVE', FALSE),
(4, 1, 7, 'Máy đo nồng độ oxy SpO2 kẹp ngón Yuwell YX301', 'may-do-nong-do-oxy-spo2-kep-ngon-yuwell-yx301', 'Màn hình OLED sắc nét, hiển thị SpO2 và nhịp tim tức thì, tự động tắt nguồn', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600', 'ACTIVE', FALSE),
(5, 1, 2, 'Máy xông khí dung mũi họng Omron NE-C28', 'may-xong-khi-dung-mui-hong-omron-ne-c28', 'Công nghệ van ảo V.V.T giảm lãng phí thuốc, hạt sương mịn thấm sâu vào phế nang', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600', 'ACTIVE', FALSE),
(6, 1, 7, 'Cân điện tử Xiaomi Body Composition Scale 2', 'can-dien-tu-xiaomi-body-composition-scale-2', 'Đo 13 chỉ số cơ thể: tỷ lệ mỡ, khối lượng cơ, nước, mỡ nội tạng, BMI', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', 'ACTIVE', FALSE),
(7, 2, 4, 'Viên uống Dầu cá Omega 3 Blackmores Fish Oil 1000mg 400 viên', 'vien-uong-dau-ca-omega-3-blackmores-fish-oil-1000mg-400-vien', 'Chiết xuất từ cá biển sâu tự nhiên, hỗ trợ tim mạch, não bộ và thị lực', 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600', 'ACTIVE', FALSE),
(8, 2, 3, 'Viên sủi bổ sung Vitamin C Berocca Performance vị Cam 20 viên', 'vien-sui-bo-sung-vitamin-c-berocca-performance-vi-cam-20-vien', 'Kết hợp Vitamin C, nhóm B và Kẽm, tăng cường thể lực và sự tỉnh táo', 'https://images.unsplash.com/photo-1550572017-ed240bf98285?w=600', 'ACTIVE', FALSE),
(9, 2, 2, 'Viên uống bổ khớp Glucosamine Orihiro 1500mg 900 viên Nhật Bản', 'vien-uong-bo-khop-glucosamine-orihiro-1500mg-900-vien-nhat-ban', 'Hỗ trợ tái tạo sụn khớp, giảm đau nhức thoái hóa khớp gối và cột sống', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600', 'ACTIVE', FALSE),
(10, 3, 8, 'Kem dưỡng ẩm La Roche-Posay Cicaplast Baume B5+ 40ml', 'kem-duong-am-la-roche-posay-cicaplast-baume-b5-plus-40ml', 'Làm dịu da kích ứng, phục hồi hàng rào bảo vệ da, dưỡng ẩm sâu', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', 'ACTIVE', FALSE),
(11, 3, 4, 'Sữa rửa mặt Cetaphil Gentle Skin Cleanser 500ml', 'sua-rua-mat-cetaphil-gentle-skin-cleanser-500ml', 'Công thức dịu nhẹ không xà phòng, cân bằng pH, an toàn cho mọi loại da nhạy cảm', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 'ACTIVE', FALSE),
(12, 4, 6, 'Máy hút sữa điện đôi Medela Freestyle Flex', 'may-hut-sua-dien-doi-medela-freestyle-flex', 'Thiết kế nhỏ gọn, kết nối App Bluetooth, hút 2 pha mô phỏng nhịp bú của trẻ', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600', 'ACTIVE', FALSE),
(13, 4, 1, 'Sữa non ColosBaby Gold 0+ 800g (0-12 tháng)', 'sua-non-colosbaby-gold-0-plus-800g', 'Bổ sung kháng thể IgG tự nhiên từ sữa non, giúp bé miễn dịch khỏe và tăng cân đều', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600', 'ACTIVE', FALSE),
(14, 5, 1, 'Bộ hộp cứu thương sơ cứu y tế cá nhân loại A', 'bo-hop-cuu-thuong-so-cuu-y-te-ca-nhan-loai-a', 'Trang bị đầy đủ gạc tiệt trùng, bông, cồn sát khuẩn, băng dán cá nhân và kéo y tế', 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600', 'ACTIVE', FALSE),
(15, 5, 4, 'Xe lăn tay tiêu chuẩn Lucass X-9', 'xe-lan-tay-tieu-chuan-lucass-x9', 'Khung hợp kim thép mạ chrome, có phanh hãm an toàn, bánh xe cao su chống trượt', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600', 'ACTIVE', FALSE),
(16, 6, 3, 'Gối massage hồng ngoại 8 bi Beurer MG147', 'goi-massage-hong-ngoai-8-bi-beurer-mg147', 'Xoa bóp shiatsu đảo chiều, đèn hồng ngoại sưởi ấm giảm đau mỏi vai gáy', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', 'ACTIVE', FALSE),
(17, 6, 3, 'Bồn ngâm chân massage tự động Medisana FS885', 'bon-ngam-chan-massage-tu-dong-medisana-fs885', 'Massage sủi bọt, con lăn bấm huyệt lòng bàn chân, hẹn giờ và giữ ấm nước', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', 'ACTIVE', FALSE),
(18, 7, 1, 'Hộp 50 chiếc Khẩu trang y tế 4 lớp kháng khuẩn Famapro', 'hop-50-chiec-khau-trang-y-te-4-lop-famapro', 'Lớp vi lọc thấu khí chống bụi mịn PM2.5, thanh nẹp mũi định hình chắc chắn', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600', 'ACTIVE', FALSE),
(19, 7, 4, 'Hộp 20 chiếc Khẩu trang 3D N95 3M 9501V+ có van thở', 'hop-20-chiec-khau-trang-3d-n95-3m-9501v-plus', 'Đạt chuẩn N95 lọc 95% bụi siêu mịn, vi khuẩn và giọt bắn đường hô hấp', 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600', 'ACTIVE', FALSE),
(20, 8, 4, 'Máy tăm nước cầm tay du lịch Waterpik Cordless Plus WP-450', 'may-tam-nuoc-cam-tay-waterpik-wp-450', 'Áp lực nước 45-75 psi làm sạch kẽ răng và mắc cài niềng răng hiệu quả', 'https://images.unsplash.com/photo-1559591937-e109df5a0aa0?w=600', 'ACTIVE', FALSE),
(21, 8, 4, 'Bình rửa mũi người lớn và trẻ em NeilMed Sinus Rinse kèm 50 gói muối', 'binh-rua-mui-neilmed-sinus-rinse-50-goi-muoi', 'Độ pH cân bằng sinh lý, rửa sạch dịch nhầy mũi xoang không gây cay rát', 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=600', 'ACTIVE', FALSE),
(22, 9, 4, 'Sữa bột Ensure Gold Abbott 850g hương Vani', 'sua-bot-ensure-gold-abbott-850g-huong-vani', 'Bổ sung HMB và đạm chất lượng cao giúp tăng cường sức khỏe khối cơ', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600', 'ACTIVE', FALSE),
(23, 10, 5, 'Đai lưng cột sống cao cấp Disk Dr WG-30G kéo giãn hơi', 'dai-lung-cot-song-disk-dr-wg-30g', 'Bơm hơi tạo lực kéo giãn giảm áp lực đĩa đệm lưng thoát vị, sản xuất Hàn Quốc', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600', 'ACTIVE', FALSE),
(24, 11, 1, 'Tinh dầu Tràm gió Cung Đình Huế nguyên chất 100ml', 'tinh-dau-tram-cung-dinh-hue-100ml', 'Chiết xuất từ lá tràm tự nhiên, giữ ấm cơ thể, phòng cảm lạnh và muỗi đốt cho trẻ', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600', 'ACTIVE', FALSE);

-- =========================================================
-- 5. IMAGES (Thư viện ảnh Media Gallery dùng chung)
-- =========================================================
INSERT INTO images (id, name, url, file_type, file_size, is_deleted) VALUES
(1, 'Máy đo huyết áp Omron HEM-7120', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600', 'image/jpeg', 1048576, FALSE),
(2, 'Nhiệt kế hồng ngoại Microlife NC200', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', 'image/jpeg', 945120, FALSE),
(3, 'Máy đo đường huyết Accu-Chek Guide Me', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600', 'image/jpeg', 1150400, FALSE),
(4, 'Máy đo SpO2 Yuwell kẹp ngón', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600', 'image/jpeg', 820100, FALSE),
(5, 'Máy xông khí dung Omron NE-C28', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600', 'image/jpeg', 1350000, FALSE),
(6, 'Cân sức khỏe điện tử Xiaomi Scale 2', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', 'image/jpeg', 980200, FALSE),
(7, 'Viên uống Dầu cá Omega 3 Blackmores', 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600', 'image/jpeg', 760000, FALSE),
(8, 'Viên sủi Berocca Performance', 'https://images.unsplash.com/photo-1550572017-ed240bf98285?w=600', 'image/jpeg', 540300, FALSE),
(9, 'Viên bổ khớp Glucosamine Orihiro', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600', 'image/jpeg', 680100, FALSE),
(10, 'Kem dưỡng ẩm phục hồi B5 La Roche-Posay', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', 'image/jpeg', 610000, FALSE),
(11, 'Sữa rửa mặt Cetaphil Gentle Cleanser', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 'image/jpeg', 720000, FALSE),
(12, 'Máy hút sữa đôi Medela Freestyle Flex', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600', 'image/jpeg', 1820000, FALSE),
(13, 'Sữa non ColosBaby Gold 0+', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600', 'image/jpeg', 950000, FALSE),
(14, 'Hộp cứu thương sơ cứu y tế loại A', 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600', 'image/jpeg', 840000, FALSE),
(15, 'Xe lăn tay Lucass X-9', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600', 'image/jpeg', 1450000, FALSE),
(16, 'Khẩu trang y tế 4 lớp Famapro', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600', 'image/jpeg', 520000, FALSE),
(17, 'Máy tăm nước Waterpik WP-450', 'https://images.unsplash.com/photo-1559591937-e109df5a0aa0?w=600', 'image/jpeg', 890000, FALSE),
(18, 'Đai lưng cột sống Disk Dr', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600', 'image/jpeg', 1120000, FALSE),
(19, 'Tinh dầu tràm nguyên chất Cung Đình Huế', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600', 'image/jpeg', 430000, FALSE),
(20, 'Gối massage hồng ngoại Beurer', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', 'image/jpeg', 1250000, FALSE);

-- =========================================================
-- 6. PRODUCT IMAGES (Chi tiết ảnh sản phẩm)
-- =========================================================
INSERT INTO product_images (id, product_id, image_url, is_primary) VALUES
(1, 1, 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600', TRUE),
(2, 1, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600', FALSE),
(3, 2, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', TRUE),
(4, 3, 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600', TRUE),
(5, 5, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600', TRUE),
(6, 6, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', TRUE),
(7, 7, 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600', TRUE),
(8, 8, 'https://images.unsplash.com/photo-1550572017-ed240bf98285?w=600', TRUE),
(9, 9, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600', TRUE),
(10, 10, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', TRUE),
(11, 11, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', TRUE),
(12, 12, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600', TRUE),
(13, 13, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600', TRUE),
(14, 14, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600', TRUE),
(15, 15, 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600', TRUE),
(16, 16, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', TRUE),
(17, 17, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', TRUE),
(18, 18, 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600', TRUE),
(19, 20, 'https://images.unsplash.com/photo-1559591937-e109df5a0aa0?w=600', TRUE),
(20, 23, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600', TRUE);

-- =========================================================
-- 7. ADDRESSES
-- =========================================================
INSERT INTO addresses (id, user_id, recipient_name, phone, province, district, ward, address_detail, is_default, is_deleted) VALUES
(1, 3, 'Nguyễn Văn An', '0901000003', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng Hậu', 'Số 18, Ngõ 86 Phố Duy Tân', TRUE, FALSE),
(2, 3, 'Nguyễn Văn An (VP)', '0901000003', 'Hà Nội', 'Nam Từ Liêm', 'Mỹ Đình 1', 'Tòa nhà FPT Tower, Phố Phạm Văn Bạch', FALSE, FALSE),
(3, 4, 'Trần Thị Bình', '0901000004', 'TP Hồ Chí Minh', 'Quận 1', 'Bến Nghé', '123 Đường Nguyễn Huệ', TRUE, FALSE),
(4, 4, 'Trần Thị Bình (Nhà Mẹ)', '0901000004', 'TP Hồ Chí Minh', 'Quận 7', 'Tân Phong', 'Số 45 Đường Nguyễn Thị Thập', FALSE, FALSE),
(5, 5, 'Lê Quang Cường', '0901000005', 'Thừa Thiên Huế', 'TP Huế', 'Thuận Thành', 'Số 10 Phố Đinh Tiên Hoàng', TRUE, FALSE),
(6, 6, 'Phạm Thị Dung', '0901000006', 'Đà Nẵng', 'Hải Châu', 'Thạch Thang', 'Số 88 Đường Bạch Đằng', TRUE, FALSE),
(7, 7, 'Hoàng Văn Em', '0901000007', 'Hải Phòng', 'Ngô Quyền', 'Lạch Tray', 'Số 220 Đường Lạch Tray', TRUE, FALSE),
(8, 8, 'Vũ Thị Phương', '0901000008', 'Cần Thơ', 'Ninh Kiều', 'An Hòa', 'Số 54 Đường 30 Tháng 4', TRUE, FALSE),
(9, 9, 'Đặng Văn Giang', '0901000009', 'Bình Dương', 'Thủ Dầu Một', 'Phú Hòa', 'Số 99 Đại Lộ Bình Dương', TRUE, FALSE),
(10, 10, 'Bùi Thị Hạnh', '0901000010', 'Đồng Nai', 'Biên Hòa', 'Tân Mai', 'Số 12 Đường Đồng Khởi', TRUE, FALSE),
(11, 11, 'Đỗ Thị Kim', '0901000011', 'Quảng Ninh', 'Hạ Long', 'Bãi Cháy', 'Số 105 Đường Hạ Long', TRUE, FALSE),
(12, 12, 'Nguyễn Anh Khoa', '0901000012', 'Bắc Ninh', 'TP Bắc Ninh', 'Tiền An', 'Số 67 Đường Lý Thái Tổ', TRUE, FALSE);

-- =========================================================
-- 8. CARTS
-- =========================================================
INSERT INTO carts (id, user_id) VALUES
(1, 3), (2, 4), (3, 5), (4, 6), (5, 7), (6, 8), (7, 9), (8, 10), (9, 11), (10, 12);

-- =========================================================
-- 9. CART ITEMS
-- =========================================================
INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 8, 2),
(3, 2, 10, 1),
(4, 2, 11, 1),
(5, 3, 7, 1),
(6, 3, 2, 1),
(7, 4, 3, 1),
(8, 5, 14, 2),
(9, 5, 18, 5),
(10, 6, 20, 1),
(11, 7, 16, 1),
(12, 8, 22, 2),
(13, 9, 24, 3),
(14, 10, 6, 1),
(15, 1, 18, 3);

-- =========================================================
-- 10. ORDERS
-- =========================================================
INSERT INTO orders (id, user_id, address_id, subtotal, shipping_fee, discount_amount, total_amount, payment_method, payment_status, order_status, note, is_deleted) VALUES
(1, 3, 1, 890000.00, 30000.00, 0.00, 920000.00, 'VNPAY', 'PAID', 'DELIVERED', 'Giao giờ hành chính giúp tôi', FALSE),
(2, 4, 3, 1335000.00, 35000.00, 50000.00, 1320000.00, 'COD', 'PAID', 'DELIVERED', 'Gọi trước khi giao 15 phút', FALSE),
(3, 5, 5, 560000.00, 30000.00, 0.00, 590000.00, 'COD', 'UNPAID', 'SHIPPING', 'Đóng gói cẩn thận chống sốc', FALSE),
(4, 3, 2, 450000.00, 30000.00, 0.00, 480000.00, 'COD', 'UNPAID', 'CANCELLED', 'Khách đổi ý muốn mua model khác', TRUE),
(5, 6, 6, 1150000.00, 30000.00, 0.00, 1180000.00, 'VNPAY', 'PAID', 'PROCESSING', 'Giao hàng nhanh nhất có thể', FALSE),
(6, 7, 7, 1890000.00, 40000.00, 100000.00, 1830000.00, 'VNPAY', 'PAID', 'CONFIRMED', 'Xuất hóa đơn VAT cho công ty', FALSE),
(7, 8, 8, 360000.00, 30000.00, 0.00, 390000.00, 'COD', 'UNPAID', 'PENDING', 'Giao buổi chiều sau 17h', FALSE),
(8, 9, 9, 2450000.00, 50000.00, 0.00, 2500000.00, 'COD', 'UNPAID', 'SHIPPING', 'Bồn ngâm chân quà tặng sinh nhật', FALSE),
(9, 10, 10, 1680000.00, 30000.00, 50000.00, 1660000.00, 'VNPAY', 'PAID', 'DELIVERED', 'Đã nhận đủ 2 hộp sữa Ensure', FALSE),
(10, 11, 11, 495000.00, 25000.00, 0.00, 520000.00, 'COD', 'UNPAID', 'CONFIRMED', 'Kiểm tra hàng trước khi thanh toán', FALSE),
(11, 4, 4, 3850000.00, 0.00, 150000.00, 3700000.00, 'VNPAY', 'PAID', 'PROCESSING', 'Đai kéo giãn cột sống cho người già', FALSE),
(12, 5, 5, 950000.00, 30000.00, 0.00, 980000.00, 'COD', 'UNPAID', 'PENDING', 'Nhiệt kế Microlife bảo hành chính hãng', FALSE);

-- =========================================================
-- 11. ORDER ITEMS
-- =========================================================
INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity) VALUES
(1, 1, 1, 'Máy đo huyết áp bắp tay Omron HEM-7120', 890000.00, 1),
(2, 1, 8, 'Viên sủi bổ sung Vitamin C Berocca Performance vị Cam 20 viên', 230000.00, 1),
(3, 2, 2, 'Nhiệt kế hồng ngoại đo trán Microlife NC200', 950000.00, 1),
(4, 2, 11, 'Sữa rửa mặt Cetaphil Gentle Skin Cleanser 500ml', 385000.00, 1),
(5, 3, 7, 'Viên uống Dầu cá Omega 3 Blackmores Fish Oil 1000mg 400 viên', 560000.00, 1),
(6, 4, 6, 'Cân điện tử Xiaomi Body Composition Scale 2', 450000.00, 1),
(7, 5, 3, 'Máy đo đường huyết Accu-Chek Guide Me', 1150000.00, 1),
(8, 5, 21, 'Bình rửa mũi người lớn và trẻ em NeilMed Sinus Rinse', 350000.00, 1),
(9, 6, 20, 'Máy tăm nước cầm tay du lịch Waterpik Cordless Plus WP-450', 1890000.00, 1),
(10, 6, 18, 'Hộp 50 chiếc Khẩu trang y tế 4 lớp kháng khuẩn Famapro', 65000.00, 2),
(11, 7, 14, 'Bộ hộp cứu thương sơ cứu y tế cá nhân loại A', 180000.00, 2),
(12, 8, 17, 'Bồn ngâm chân massage tự động Medisana FS885', 2450000.00, 1),
(13, 9, 22, 'Sữa bột Ensure Gold Abbott 850g hương Vani', 840000.00, 2),
(14, 9, 7, 'Viên uống Dầu cá Omega 3 Blackmores Fish Oil 1000mg 400 viên', 560000.00, 1),
(15, 10, 24, 'Tinh dầu Tràm gió Cung Đình Huế nguyên chất 100ml', 165000.00, 3),
(16, 11, 23, 'Đai lưng cột sống cao cấp Disk Dr WG-30G kéo giãn hơi', 3850000.00, 1),
(17, 11, 10, 'Kem dưỡng ẩm La Roche-Posay Cicaplast Baume B5+ 40ml', 340000.00, 1),
(18, 12, 2, 'Nhiệt kế hồng ngoại đo trán Microlife NC200', 950000.00, 1);

-- =========================================================
-- 12. PAYMENTS
-- =========================================================
INSERT INTO payments (id, order_id, transaction_code, amount, payment_method, status, paid_at) VALUES
(1, 1, 'VNPAY_TXN_20260827_001', 920000.00, 'VNPAY', 'SUCCESS', NOW()),
(2, 2, NULL, 1320000.00, 'COD', 'SUCCESS', NOW()),
(3, 3, NULL, 590000.00, 'COD', 'PENDING', NULL),
(4, 4, NULL, 480000.00, 'COD', 'FAILED', NULL),
(5, 5, 'VNPAY_TXN_20260828_005', 1180000.00, 'VNPAY', 'SUCCESS', NOW()),
(6, 6, 'VNPAY_TXN_20260829_006', 1830000.00, 'VNPAY', 'SUCCESS', NOW()),
(7, 7, NULL, 390000.00, 'COD', 'PENDING', NULL),
(8, 8, NULL, 2500000.00, 'COD', 'PENDING', NULL),
(9, 9, 'VNPAY_TXN_20260830_009', 1660000.00, 'VNPAY', 'SUCCESS', NOW()),
(10, 10, NULL, 520000.00, 'COD', 'PENDING', NULL),
(11, 11, 'VNPAY_TXN_20260831_011', 3700000.00, 'VNPAY', 'SUCCESS', NOW()),
(12, 12, NULL, 980000.00, 'COD', 'PENDING', NULL);

-- =========================================================
-- 13. REVIEWS
-- =========================================================
INSERT INTO reviews (id, user_id, product_id, order_id, rating, comment, is_deleted) VALUES
(1, 3, 1, 1, 5, 'Máy đo huyết áp dùng rất nhạy và êm, bố mẹ mình dùng cực kỳ tiện lợi, cho shop 5 sao!', FALSE),
(2, 3, 8, 1, 5, 'Viên sủi Berocca uống thơm ngon vị cam, uống buổi sáng thấy khỏe khoắn hẳn.', FALSE),
(3, 4, 2, 2, 5, 'Nhiệt kế đo nhanh chính xác, tiện lợi khi nhà có con nhỏ hay sốt đêm.', FALSE),
(4, 4, 11, 2, 4, 'Sữa rửa mặt Cetaphil dịu nhẹ lành tính, da nhạy cảm dùng rất êm.', FALSE),
(5, 6, 3, 5, 5, 'Máy đo đường huyết Accu-Chek chính xác, lượng máu lấy rất ít không đau.', FALSE),
(6, 7, 20, 6, 5, 'Tăm nước Waterpik xịt sạch kẽ răng, lực nước êm ái không làm chảy máu chân răng.', FALSE),
(7, 7, 18, 6, 5, 'Khẩu trang 4 lớp dày dặn, dây đeo êm tai không bị đau khi đeo lâu.', FALSE),
(8, 10, 22, 9, 5, 'Sữa Ensure Gold date mới, bố mình uống hồi phục sức khỏe sau ốm rất tốt.', FALSE),
(9, 10, 7, 9, 4, 'Viên dầu cá viên mềm dễ uống, hộp to dùng được lâu.', FALSE),
(10, 4, 23, 11, 5, 'Đai lưng Disk Dr chất lượng đỉnh cao, đeo vào lưng đỡ mỏi hẳn khi ngồi làm việc.', FALSE),
(11, 4, 10, 11, 5, 'Kem B5 phục hồi da rất nhanh sau khi nặn mụn hoặc peel da.', FALSE),
(12, 6, 21, 5, 4, 'Bình rửa mũi NeilMed rửa sạch xoang mũi, không bị sặc.', FALSE);

-- =========================================================
-- 14. WISHLIST
-- =========================================================
INSERT INTO wishlist (id, user_id, product_id) VALUES
(1, 3, 3), (2, 3, 12), (3, 3, 16), (4, 4, 7), (5, 4, 17), (6, 5, 1), (7, 5, 20), (8, 6, 6), (9, 6, 9), (10, 7, 15), (11, 8, 23), (12, 9, 5), (13, 10, 2), (14, 11, 10), (15, 12, 1);

-- =========================================================
-- 15. CONSULTATIONS (Yêu cầu tư vấn & Gửi file báo giá)
-- =========================================================
INSERT INTO consultations (id, user_id, full_name, email, phone, title, content, attachment_url, attachment_name, status, is_deleted) VALUES
(1, 3, 'Nguyễn Văn An', 'nguyenvana@gmail.com', '0901000003', 'Tư vấn lắp đặt thiết bị phòng khám gia đình', 'Tôi cần tư vấn trọn gói thiết bị đo huyết áp, máy tạo oxy và máy xông mũi họng cho người cao tuổi.', NULL, NULL, 'COMPLETED', FALSE),
(2, 4, 'Trần Thị Bình', 'tranthib@gmail.com', '0901000004', 'Yêu cầu bảng báo giá sỉ khẩu trang và đồ bảo hộ y tế', 'Đề nghị gửi file báo giá số lượng lớn cho trường mầm non tại Quận 1 TP.HCM.', NULL, NULL, 'CONTACTED', FALSE),
(3, 5, 'Lê Quang Cường', 'lequangc@gmail.com', '0901000005', 'Báo giá thiết bị vật lý trị liệu phục hồi chức năng', 'Phòng khám cần đầu tư 5 giường massage và 3 đai kéo giãn Disk Dr Hàn Quốc.', NULL, NULL, 'PENDING', FALSE);
