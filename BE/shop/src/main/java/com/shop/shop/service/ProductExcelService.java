package com.shop.shop.service;

import com.shop.shop.dto.response.ProductImportResult;
import com.shop.shop.dto.response.ProductResponse;
import com.shop.shop.entity.Category;
import com.shop.shop.entity.Product;
import com.shop.shop.repository.CategoryRepository;
import com.shop.shop.repository.ProductImageRepository;
import com.shop.shop.repository.ProductRepository;
import com.shop.shop.repository.ReviewRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ProductExcelService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;

    public ProductExcelService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductImageRepository productImageRepository,
            ReviewRepository reviewRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
    }

    /**
     * Tạo file mẫu Excel (.xlsx) gồm Sheet nhập dữ liệu và Sheet danh mục tham khảo
     */
    public byte[] generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // 1. Tạo Sheet 1: Mẫu nhập sản phẩm
            Sheet sheet1 = workbook.createSheet("MauNhapSanPham");

            // Style cho Header Sheet 1 (Màu xanh Indigo, chữ trắng đậm)
            CellStyle headerStyle1 = workbook.createCellStyle();
            Font headerFont1 = workbook.createFont();
            headerFont1.setBold(true);
            headerFont1.setColor(IndexedColors.WHITE.getIndex());
            headerFont1.setFontHeightInPoints((short) 11);
            headerStyle1.setFont(headerFont1);
            headerStyle1.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle1.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle1.setAlignment(HorizontalAlignment.CENTER);
            headerStyle1.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle1.setBorderBottom(BorderStyle.THIN);
            headerStyle1.setBorderTop(BorderStyle.THIN);
            headerStyle1.setBorderRight(BorderStyle.THIN);
            headerStyle1.setBorderLeft(BorderStyle.THIN);

            // Style dữ liệu
            CellStyle textStyle = workbook.createCellStyle();
            textStyle.setBorderBottom(BorderStyle.THIN);
            textStyle.setBorderTop(BorderStyle.THIN);
            textStyle.setBorderRight(BorderStyle.THIN);
            textStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle numberStyle = workbook.createCellStyle();
            numberStyle.cloneStyleFrom(textStyle);
            numberStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));

            String[] headers1 = {
                    "Tên sản phẩm (*)",
                    "Mã (ID) hoặc Tên danh mục (*)",
                    "Đường dẫn tĩnh (Slug)",
                    "Giá bán (VNĐ)",
                    "Số lượng tồn kho (*)",
                    "Link ảnh chính (URL)",
                    "Link ảnh phụ (ngăn cách bởi dấu phẩy ,)",
                    "Mô tả sản phẩm",
                    "Trạng thái (ACTIVE / INACTIVE / OUT_OF_STOCK)"
            };

            Row headerRow1 = sheet1.createRow(0);
            headerRow1.setHeightInPoints(26);
            for (int i = 0; i < headers1.length; i++) {
                Cell cell = headerRow1.createCell(i);
                cell.setCellValue(headers1[i]);
                cell.setCellStyle(headerStyle1);
            }

            // Thêm các dòng dữ liệu mẫu
            List<Category> activeCategories = categoryRepository.findAllActive(Sort.by(Sort.Direction.ASC, "id"));
            String sampleCat1 = activeCategories.isEmpty() ? "1" : String.valueOf(activeCategories.getFirst().getId());
            String sampleCat2 = activeCategories.size() > 1 ? activeCategories.get(1).getName() : sampleCat1;

            Object[][] sampleData = {
                    {
                            "Máy đo huyết áp bắp tay Omron HEM-7120",
                            sampleCat1,
                            "may-do-huyet-ap-omron-hem-7120",
                            790000,
                            50,
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
                            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae, https://images.unsplash.com/photo-1583912267670-6575ad472688",
                            "Máy đo huyết áp tự động độ chính xác cao công nghệ Intellisense",
                            "ACTIVE"
                    },
                    {
                            "Nhiệt kế hồng ngoại Microlife FR1MF1",
                            sampleCat2,
                            "", // để trống để tự sinh slug
                            650000,
                            100,
                            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
                            "",
                            "Đo nhiệt độ không tiếp xúc trong 1 giây nhanh chóng",
                            "ACTIVE"
                    },
                    {
                            "Máy tạo oxy Yuwell 7F-5D 5 lít",
                            sampleCat1,
                            "may-tao-oxy-yuwell-7f-5d-5-lit",
                            9200000,
                            15,
                            "https://images.unsplash.com/photo-1583912267670-6575ad472688",
                            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
                            "Cung cấp oxy tinh khiết lưu lượng 1 - 5 lít/phút liên tục",
                            "ACTIVE"
                    }
            };

            for (int r = 0; r < sampleData.length; r++) {
                Row row = sheet1.createRow(r + 1);
                row.setHeightInPoints(20);
                for (int c = 0; c < sampleData[r].length; c++) {
                    Cell cell = row.createCell(c);
                    Object val = sampleData[r][c];
                    if (val instanceof Number) {
                        cell.setCellValue(((Number) val).doubleValue());
                        cell.setCellStyle(numberStyle);
                    } else {
                        cell.setCellValue(val != null ? val.toString() : "");
                        cell.setCellStyle(textStyle);
                    }
                }
            }

            // Tự động căn chỉnh độ rộng cột Sheet 1
            for (int i = 0; i < headers1.length; i++) {
                sheet1.autoSizeColumn(i);
                sheet1.setColumnWidth(i, Math.max(sheet1.getColumnWidth(i) + 1200, 4200));
            }

            // 2. Tạo Sheet 2: Danh mục tham khảo
            Sheet sheet2 = workbook.createSheet("DanhMucThamKhao");

            CellStyle headerStyle2 = workbook.createCellStyle();
            Font headerFont2 = workbook.createFont();
            headerFont2.setBold(true);
            headerFont2.setColor(IndexedColors.WHITE.getIndex());
            headerStyle2.setFont(headerFont2);
            headerStyle2.setFillForegroundColor(IndexedColors.SEA_GREEN.getIndex());
            headerStyle2.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle2.setAlignment(HorizontalAlignment.CENTER);
            headerStyle2.setBorderBottom(BorderStyle.THIN);
            headerStyle2.setBorderTop(BorderStyle.THIN);
            headerStyle2.setBorderRight(BorderStyle.THIN);
            headerStyle2.setBorderLeft(BorderStyle.THIN);

            String[] headers2 = { "ID Danh Mục", "Tên Danh Mục", "Đường dẫn (Slug)", "Mô Tả" };
            Row headerRow2 = sheet2.createRow(0);
            headerRow2.setHeightInPoints(24);
            for (int i = 0; i < headers2.length; i++) {
                Cell cell = headerRow2.createCell(i);
                cell.setCellValue(headers2[i]);
                cell.setCellStyle(headerStyle2);
            }

            int catRowNum = 1;
            for (Category cat : activeCategories) {
                Row row = sheet2.createRow(catRowNum++);
                row.setHeightInPoints(19);

                Cell c0 = row.createCell(0);
                c0.setCellValue(cat.getId());
                c0.setCellStyle(numberStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(cat.getName() != null ? cat.getName() : "");
                c1.setCellStyle(textStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(cat.getSlug() != null ? cat.getSlug() : "");
                c2.setCellStyle(textStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(cat.getDescription() != null ? cat.getDescription() : "");
                c3.setCellStyle(textStyle);
            }

            for (int i = 0; i < headers2.length; i++) {
                sheet2.autoSizeColumn(i);
                sheet2.setColumnWidth(i, Math.max(sheet2.getColumnWidth(i) + 1200, 3800));
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tạo file Excel mẫu: " + e.getMessage());
        }
    }

    /**
     * Nhập hàng loạt sản phẩm từ file Excel tải lên
     */
    @Transactional
    public ProductImportResult importProducts(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn file Excel để tải lên");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".xlsx") && !originalFilename.toLowerCase().endsWith(".xls"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Định dạng file không hợp lệ! Vui lòng tải lên file Excel (.xlsx hoặc .xls)");
        }

        List<ProductImportResult.RowError> errors = new ArrayList<>();
        List<ProductResponse> importedList = new ArrayList<>();
        Set<String> processedSlugs = new HashSet<>();
        int totalRows = 0;

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File Excel không chứa Sheet dữ liệu nào");
            }

            int lastRowNum = sheet.getLastRowNum();
            for (int r = 1; r <= lastRowNum; r++) {
                Row row = sheet.getRow(r);
                if (row == null || isRowEmpty(row)) {
                    continue;
                }

                totalRows++;
                int displayRow = r + 1; // 1-indexed số dòng trong Excel

                String name = getCellValue(row.getCell(0));
                String categoryRaw = getCellValue(row.getCell(1));
                String slug = getCellValue(row.getCell(2));
                String priceRaw = getCellValue(row.getCell(3));
                String stockRaw = getCellValue(row.getCell(4));
                String primaryImageUrl = getCellValue(row.getCell(5));
                String subImagesRaw = getCellValue(row.getCell(6));
                String description = getCellValue(row.getCell(7));
                String statusRaw = getCellValue(row.getCell(8));

                // 1. Kiểm tra Tên sản phẩm
                if (name == null || name.trim().isEmpty()) {
                    errors.add(new ProductImportResult.RowError(displayRow, "Không rõ tên", "Tên sản phẩm không được để trống"));
                    continue;
                }
                name = name.trim();

                // 2. Kiểm tra Danh mục
                if (categoryRaw == null || categoryRaw.trim().isEmpty()) {
                    errors.add(new ProductImportResult.RowError(displayRow, name, "Danh mục không được để trống (Nhập ID số hoặc Tên danh mục)"));
                    continue;
                }
                Category category = resolveCategory(categoryRaw.trim());
                if (category == null) {
                    errors.add(new ProductImportResult.RowError(displayRow, name, "Không tìm thấy danh mục: '" + categoryRaw.trim() + "'. Vui lòng kiểm tra Sheet 'DanhMucThamKhao'"));
                    continue;
                }

                // 3. Xử lý Slug
                if (slug == null || slug.trim().isEmpty()) {
                    slug = generateSlug(name);
                } else {
                    slug = generateSlug(slug);
                }

                // Đảm bảo slug không bị trùng lặp
                String finalSlug = resolveUniqueSlug(slug, processedSlugs);
                processedSlugs.add(finalSlug);

                // 4. Xử lý Giá bán (Giới hạn tối đa 10 tỷ để chống spam)
                BigDecimal price = null;
                if (priceRaw != null && !priceRaw.trim().isEmpty()) {
                    try {
                        String cleanPrice = priceRaw.replaceAll("[,.\\s]", "");
                        price = new BigDecimal(cleanPrice);
                        if (price.compareTo(BigDecimal.ZERO) < 0) {
                            errors.add(new ProductImportResult.RowError(displayRow, name, "Giá sản phẩm không được là số âm"));
                            continue;
                        }
                        if (price.compareTo(new BigDecimal("10000000000")) > 0) {
                            errors.add(new ProductImportResult.RowError(displayRow, name, "Giá sản phẩm không được vượt quá 10 tỷ VNĐ"));
                            continue;
                        }
                    } catch (Exception e) {
                        errors.add(new ProductImportResult.RowError(displayRow, name, "Giá sản phẩm '" + priceRaw + "' không đúng định dạng số"));
                        continue;
                    }
                }

                // 5. Xử lý Tồn kho (Giới hạn tối đa 100,000 để chống spam)
                Integer stock = 0;
                if (stockRaw != null && !stockRaw.trim().isEmpty()) {
                    try {
                        String cleanStock = stockRaw.replaceAll("[,.\\s]", "");
                        stock = Integer.parseInt(cleanStock);
                        if (stock < 0) {
                            errors.add(new ProductImportResult.RowError(displayRow, name, "Số lượng tồn kho không được âm"));
                            continue;
                        }
                        if (stock > 100000) {
                            errors.add(new ProductImportResult.RowError(displayRow, name, "Số lượng tồn kho không được vượt quá 100,000 (giới hạn chống spam)"));
                            continue;
                        }
                    } catch (Exception e) {
                        errors.add(new ProductImportResult.RowError(displayRow, name, "Số lượng tồn kho '" + stockRaw + "' không hợp lệ"));
                        continue;
                    }
                }

                // 6. Xử lý Trạng thái
                Product.Status status = Product.Status.ACTIVE;
                if (statusRaw != null && !statusRaw.trim().isEmpty()) {
                    try {
                        status = Product.Status.valueOf(statusRaw.trim().toUpperCase());
                    } catch (IllegalArgumentException ex) {
                        status = Product.Status.ACTIVE;
                    }
                }

                // Tạo Entity và lưu
                Product product = new Product();
                product.setName(name);
                product.setCategory(category);
                product.setSlug(finalSlug);
                product.setPrice(price);
                product.setStock(stock);
                product.setPrimaryImageUrl(primaryImageUrl != null && !primaryImageUrl.trim().isEmpty() ? primaryImageUrl.trim() : null);
                product.setDescription(description != null && !description.trim().isEmpty() ? description.trim() : null);
                product.setStatus(status);
                product.setIsDeleted(false);

                Product saved = productRepository.save(product);

                // Lưu danh sách ảnh phụ nếu có
                if (subImagesRaw != null && !subImagesRaw.trim().isEmpty()) {
                    String[] subImgArray = subImagesRaw.split("[,;\\n]");
                    for (String imgUrl : subImgArray) {
                        if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                            com.shop.shop.entity.ProductImage pi = new com.shop.shop.entity.ProductImage();
                            pi.setProduct(saved);
                            pi.setImageUrl(imgUrl.trim());
                            pi.setIsPrimary(imgUrl.trim().equals(saved.getPrimaryImageUrl()));
                            productImageRepository.save(pi);
                        }
                    }
                }

                importedList.add(mapToResponse(saved));
            }

            return new ProductImportResult(
                    totalRows,
                    importedList.size(),
                    errors.size(),
                    errors,
                    importedList
            );
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lỗi khi đọc file Excel: " + e.getMessage());
        }
    }

    /**
     * Xuất toàn bộ danh sách sản phẩm ra file Excel
     */
    public byte[] exportProducts() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("DanhSachSanPham");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle textStyle = workbook.createCellStyle();
            textStyle.setBorderBottom(BorderStyle.THIN);
            textStyle.setBorderTop(BorderStyle.THIN);
            textStyle.setBorderRight(BorderStyle.THIN);
            textStyle.setBorderLeft(BorderStyle.THIN);

            CellStyle numberStyle = workbook.createCellStyle();
            numberStyle.cloneStyleFrom(textStyle);
            numberStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0"));

            String[] headers = {
                    "Mã SP (ID)",
                    "Tên sản phẩm",
                    "Danh mục",
                    "Đường dẫn (Slug)",
                    "Giá bán (VNĐ)",
                    "Tồn kho",
                    "Trạng thái",
                    "Ảnh chính",
                    "Ngày tạo"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(24);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            int rowIdx = 1;
            for (Product p : products) {
                if (Boolean.TRUE.equals(p.getIsDeleted())) continue;

                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(20);

                Cell c0 = row.createCell(0);
                c0.setCellValue(p.getId());
                c0.setCellStyle(numberStyle);

                Cell c1 = row.createCell(1);
                c1.setCellValue(p.getName());
                c1.setCellStyle(textStyle);

                Cell c2 = row.createCell(2);
                c2.setCellValue(p.getCategory() != null ? p.getCategory().getName() : "");
                c2.setCellStyle(textStyle);

                Cell c3 = row.createCell(3);
                c3.setCellValue(p.getSlug());
                c3.setCellStyle(textStyle);

                Cell c4 = row.createCell(4);
                if (p.getPrice() != null) {
                    c4.setCellValue(p.getPrice().doubleValue());
                    c4.setCellStyle(numberStyle);
                } else {
                    c4.setCellValue("");
                    c4.setCellStyle(textStyle);
                }

                Cell c5 = row.createCell(5);
                c5.setCellValue(p.getStock() != null ? p.getStock() : 0);
                c5.setCellStyle(numberStyle);

                Cell c6 = row.createCell(6);
                c6.setCellValue(p.getStatus() != null ? p.getStatus().name() : "ACTIVE");
                c6.setCellStyle(textStyle);

                Cell c7 = row.createCell(7);
                c7.setCellValue(p.getPrimaryImageUrl() != null ? p.getPrimaryImageUrl() : "");
                c7.setCellStyle(textStyle);

                Cell c8 = row.createCell(8);
                c8.setCellValue(p.getCreatedAt() != null ? p.getCreatedAt().format(dtf) : "");
                c8.setCellStyle(textStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, Math.max(sheet.getColumnWidth(i) + 1200, 3600));
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xuất danh sách sản phẩm ra Excel: " + e.getMessage());
        }
    }

    private Category resolveCategory(String raw) {
        if (raw == null || raw.trim().isEmpty()) return null;
        String trimmed = raw.trim();

        // 1. Thử parse dạng ID số
        try {
            long id = Long.parseLong(trimmed.replaceAll("\\.0$", ""));
            Optional<Category> byId = categoryRepository.findActiveById(id);
            if (byId.isPresent()) return byId.get();
        } catch (NumberFormatException ignored) {}

        // 2. Thử tìm theo Tên danh mục (không phân biệt hoa thường)
        return categoryRepository.findFirstByNameIgnoreCaseAndIsDeletedFalse(trimmed).orElse(null);
    }

    private String resolveUniqueSlug(String baseSlug, Set<String> currentBatchSlugs) {
        String slug = baseSlug;
        int counter = 1;
        while (currentBatchSlugs.contains(slug) || productRepository.existsBySlugAndIsDeletedFalse(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        return slug;
    }

    private String generateSlug(String text) {
        if (text == null) return "";
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noDiacritics = pattern.matcher(normalized).replaceAll("")
                .replace("đ", "d").replace("Đ", "D");
        String slug = noDiacritics.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-+|-+$", "");
        return slug.isEmpty() ? "san-pham-" + System.currentTimeMillis() : slug;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                double num = cell.getNumericCellValue();
                if (num == Math.floor(num)) {
                    return String.format("%.0f", num);
                }
                return String.valueOf(num);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BLANK:
            default:
                return null;
        }
    }

    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK && !getCellValue(cell).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private ProductResponse mapToResponse(Product product) {
        List<String> imageUrls = new ArrayList<>();
        if (product.getPrimaryImageUrl() != null && !product.getPrimaryImageUrl().trim().isEmpty()) {
            imageUrls.add(product.getPrimaryImageUrl().trim());
        }
        Double rating = reviewRepository.getAverageRatingByProductId(product.getId());
        Long reviewCount = reviewRepository.countReviewsByProductId(product.getId());
        return ProductResponse.from(product, imageUrls, rating, reviewCount);
    }
}

