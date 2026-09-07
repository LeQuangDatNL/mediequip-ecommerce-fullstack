package com.shop.shop.service;

import com.shop.shop.entity.Order;
import com.shop.shop.entity.OrderItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderExcelService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Xuất bảng báo giá chi tiết đơn hàng dạng Excel (.xlsx) chuẩn phong cách Y tế MediEquip Kim Liên
     */
    public byte[] generateQuotationExcel(Order order) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("BaoGia_DonHang_" + order.getId());
            sheet.setDisplayGridlines(true);

            // ==================== STYLES ====================
            // Font chung
            Font regularFont = workbook.createFont();
            regularFont.setFontName("Calibri");
            regularFont.setFontHeightInPoints((short) 10);

            Font boldFont = workbook.createFont();
            boldFont.setFontName("Calibri");
            boldFont.setFontHeightInPoints((short) 10);
            boldFont.setBold(true);

            // Title Company Style
            CellStyle companyStyle = workbook.createCellStyle();
            Font companyFont = workbook.createFont();
            companyFont.setFontName("Calibri");
            companyFont.setFontHeightInPoints((short) 14);
            companyFont.setBold(true);
            companyFont.setColor(IndexedColors.TEAL.getIndex());
            companyStyle.setFont(companyFont);
            companyStyle.setAlignment(HorizontalAlignment.LEFT);
            companyStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Subtitle Style
            CellStyle subHeaderStyle = workbook.createCellStyle();
            Font subHeaderFont = workbook.createFont();
            subHeaderFont.setFontName("Calibri");
            subHeaderFont.setFontHeightInPoints((short) 10);
            subHeaderFont.setItalic(true);
            subHeaderFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
            subHeaderStyle.setFont(subHeaderFont);

            // Banner Title "BẢNG BÁO GIÁ THIẾT BỊ Y TẾ"
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setFontName("Calibri");
            titleFont.setFontHeightInPoints((short) 13);
            titleFont.setBold(true);
            titleFont.setColor(IndexedColors.DARK_TEAL.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Table Header Style (Teal background, White Bold text)
            CellStyle tableHeaderStyle = workbook.createCellStyle();
            Font thFont = workbook.createFont();
            thFont.setFontName("Calibri");
            thFont.setFontHeightInPoints((short) 10);
            thFont.setBold(true);
            thFont.setColor(IndexedColors.WHITE.getIndex());
            tableHeaderStyle.setFont(thFont);
            tableHeaderStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex());
            tableHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            tableHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
            tableHeaderStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(tableHeaderStyle);

            // Data Cell Styles
            CellStyle textStyle = workbook.createCellStyle();
            textStyle.setFont(regularFont);
            textStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(textStyle);

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setFont(regularFont);
            centerStyle.setAlignment(HorizontalAlignment.CENTER);
            centerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(centerStyle);

            DataFormat df = workbook.createDataFormat();

            CellStyle numberStyle = workbook.createCellStyle();
            numberStyle.setFont(regularFont);
            numberStyle.setAlignment(HorizontalAlignment.RIGHT);
            numberStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            numberStyle.setDataFormat(df.getFormat("#,##0 ₫"));
            setBorders(numberStyle);

            CellStyle totalLabelStyle = workbook.createCellStyle();
            totalLabelStyle.setFont(boldFont);
            totalLabelStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalLabelStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            totalLabelStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            totalLabelStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            setBorders(totalLabelStyle);

            CellStyle totalValueStyle = workbook.createCellStyle();
            totalValueStyle.setFont(boldFont);
            totalValueStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalValueStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            totalValueStyle.setDataFormat(df.getFormat("#,##0 ₫"));
            totalValueStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            totalValueStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            setBorders(totalValueStyle);

            // ==================== WRITE CONTENT ====================
            int rowIdx = 0;

            // 1. Thông tin Công ty
            Row r0 = sheet.createRow(rowIdx++);
            Cell c0 = r0.createCell(0);
            c0.setCellValue("MEDIEQUIP VIETNAM - THIẾT BỊ Y TẾ KIM LIÊN");
            c0.setCellStyle(companyStyle);

            Row r1 = sheet.createRow(rowIdx++);
            r1.createCell(0).setCellValue("Địa chỉ: 123 Đường Y Tế, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh");
            r1.getCell(0).setCellStyle(subHeaderStyle);

            Row r2 = sheet.createRow(rowIdx++);
            r2.createCell(0).setCellValue("Hotline / Zalo: 0914 066 662  |  Email: lienkehoach@gmail.com  |  Facebook: fb.com/kim.lien.ngo.304193");
            r2.getCell(0).setCellStyle(subHeaderStyle);

            Row r3 = sheet.createRow(rowIdx++);
            r3.createCell(0).setCellValue("Phụ trách tư vấn & báo giá: Kỹ sư Ngô Kim Liên");
            r3.getCell(0).setCellStyle(subHeaderStyle);

            rowIdx++; // Dòng trống

            // 2. Tiêu đề Báo Giá
            Row rTitle = sheet.createRow(rowIdx++);
            rTitle.setHeightInPoints(24);
            Cell cTitle = rTitle.createCell(0);
            cTitle.setCellValue("BẢNG BÁO GIÁ THIẾT BỊ Y TẾ & TIẾN ĐỘ ĐƠN HÀNG");
            cTitle.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 6));

            Row rMeta = sheet.createRow(rowIdx++);
            String orderTime = order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_FORMATTER) : "N/A";
            rMeta.createCell(0).setCellValue("Mã đơn hàng: #MD-" + order.getId() + "   |   Ngày lập: " + orderTime + "   |   Trạng thái đơn: " + translateOrderStatus(order.getOrderStatus()));
            rMeta.getCell(0).setCellStyle(centerStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 6));

            rowIdx++; // Dòng trống

            // 3. Thông tin Khách hàng / Người nhận
            String recipient = order.getAddress() != null ? order.getAddress().getRecipientName() : (order.getUser() != null ? order.getUser().getFullName() : "Khách hàng");
            String phone = order.getAddress() != null ? order.getAddress().getPhone() : (order.getUser() != null ? order.getUser().getPhone() : "N/A");
            String fullAddr = "";
            if (order.getAddress() != null) {
                fullAddr = String.join(", ",
                        order.getAddress().getAddressDetail(),
                        order.getAddress().getWard(),
                        order.getAddress().getDistrict(),
                        order.getAddress().getProvince());
            }

            Row rCust1 = sheet.createRow(rowIdx++);
            rCust1.createCell(0).setCellValue("Khách hàng / Đơn vị:");
            rCust1.getCell(0).setCellStyle(boldFont(workbook));
            rCust1.createCell(1).setCellValue(recipient);
            rCust1.createCell(3).setCellValue("Số điện thoại:");
            rCust1.getCell(3).setCellStyle(boldFont(workbook));
            rCust1.createCell(4).setCellValue(phone);

            Row rCust2 = sheet.createRow(rowIdx++);
            rCust2.createCell(0).setCellValue("Địa chỉ giao nhận:");
            rCust2.getCell(0).setCellStyle(boldFont(workbook));
            rCust2.createCell(1).setCellValue(fullAddr);
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 1, 6));

            Row rCust3 = sheet.createRow(rowIdx++);
            rCust3.createCell(0).setCellValue("Hình thức thanh toán:");
            rCust3.getCell(0).setCellStyle(boldFont(workbook));
            rCust3.createCell(1).setCellValue(translatePaymentMethod(order.getPaymentMethod()) + " (" + translatePaymentStatus(order.getPaymentStatus()) + ")");
            rCust3.createCell(3).setCellValue("Ghi chú đơn hàng:");
            rCust3.getCell(3).setCellStyle(boldFont(workbook));
            rCust3.createCell(4).setCellValue(order.getNote() != null && !order.getNote().isBlank() ? order.getNote() : "Không có");
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 4, 6));

            rowIdx++; // Dòng trống

            // 4. Bảng chi tiết sản phẩm / thiết bị y tế
            String[] headers = {
                    "STT",
                    "Tên thiết bị y tế / Quy cách",
                    "ĐVT",
                    "Số lượng",
                    "Đơn giá niêm yết",
                    "Thành tiền",
                    "Ghi chú chất lượng & CO/CQ"
            };

            Row rTableH = sheet.createRow(rowIdx++);
            rTableH.setHeightInPoints(22);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = rTableH.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(tableHeaderStyle);
            }

            List<OrderItem> items = order.getItems() != null ? order.getItems() : List.of();
            int stt = 1;
            for (OrderItem item : items) {
                Row rItem = sheet.createRow(rowIdx++);
                rItem.setHeightInPoints(20);

                // STT
                Cell cStt = rItem.createCell(0);
                cStt.setCellValue(stt++);
                cStt.setCellStyle(centerStyle);

                // Tên thiết bị
                Cell cName = rItem.createCell(1);
                cName.setCellValue(item.getProductName());
                cName.setCellStyle(textStyle);

                // ĐVT
                Cell cUnit = rItem.createCell(2);
                cUnit.setCellValue("Bộ / Máy");
                cUnit.setCellStyle(centerStyle);

                // Số lượng
                Cell cQty = rItem.createCell(3);
                cQty.setCellValue(item.getQuantity());
                cQty.setCellStyle(centerStyle);

                // Đơn giá
                Cell cPrice = rItem.createCell(4);
                BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;
                cPrice.setCellValue(price.doubleValue());
                cPrice.setCellStyle(numberStyle);

                // Thành tiền
                Cell cTotal = rItem.createCell(5);
                BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
                cTotal.setCellValue(itemTotal.doubleValue());
                cTotal.setCellStyle(numberStyle);

                // Ghi chú
                Cell cNote = rItem.createCell(6);
                cNote.setCellValue("Hàng chính hãng, BH 12T, Đủ CO/CQ");
                cNote.setCellStyle(textStyle);
            }

            // 5. Tổng kết chi phí & Báo giá
            Row rSubtotal = sheet.createRow(rowIdx++);
            rSubtotal.createCell(0).setCellValue("Cộng tiền hàng (Tạm tính):");
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 4));
            for (int i = 0; i <= 4; i++) {
                if (rSubtotal.getCell(i) == null) rSubtotal.createCell(i);
                rSubtotal.getCell(i).setCellStyle(totalLabelStyle);
            }
            Cell cSubVal = rSubtotal.createCell(5);
            cSubVal.setCellValue(order.getSubtotal() != null ? order.getSubtotal().doubleValue() : 0);
            cSubVal.setCellStyle(totalValueStyle);
            rSubtotal.createCell(6).setCellStyle(textStyle);

            Row rDiscount = sheet.createRow(rowIdx++);
            rDiscount.createCell(0).setCellValue("Chiết khấu dự án / Ưu đãi y tế:");
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 4));
            for (int i = 0; i <= 4; i++) {
                if (rDiscount.getCell(i) == null) rDiscount.createCell(i);
                rDiscount.getCell(i).setCellStyle(totalLabelStyle);
            }
            Cell cDiscVal = rDiscount.createCell(5);
            cDiscVal.setCellValue(order.getDiscountAmount() != null ? -order.getDiscountAmount().doubleValue() : 0);
            cDiscVal.setCellStyle(totalValueStyle);
            rDiscount.createCell(6).setCellStyle(textStyle);

            Row rShipping = sheet.createRow(rowIdx++);
            rShipping.createCell(0).setCellValue("Phí vận chuyển & Hỗ trợ kỹ thuật:");
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 4));
            for (int i = 0; i <= 4; i++) {
                if (rShipping.getCell(i) == null) rShipping.createCell(i);
                rShipping.getCell(i).setCellStyle(totalLabelStyle);
            }
            Cell cShipVal = rShipping.createCell(5);
            cShipVal.setCellValue(order.getShippingFee() != null ? order.getShippingFee().doubleValue() : 0);
            cShipVal.setCellStyle(totalValueStyle);
            rShipping.createCell(6).setCellValue("Miễn phí giao hàng nội thành");
            rShipping.getCell(6).setCellStyle(textStyle);

            Row rTotalAmount = sheet.createRow(rowIdx++);
            rTotalAmount.setHeightInPoints(24);
            rTotalAmount.createCell(0).setCellValue("TỔNG CỘNG THANH TOÁN / BÁO GIÁ:");
            sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 4));
            for (int i = 0; i <= 4; i++) {
                if (rTotalAmount.getCell(i) == null) rTotalAmount.createCell(i);
                rTotalAmount.getCell(i).setCellStyle(totalLabelStyle);
            }
            Cell cTotVal = rTotalAmount.createCell(5);
            cTotVal.setCellValue(order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0);
            cTotVal.setCellStyle(totalValueStyle);
            rTotalAmount.createCell(6).setCellValue("Đã bao gồm VAT & Bàn giao");
            rTotalAmount.getCell(6).setCellStyle(textStyle);

            rowIdx++; // Dòng trống

            // 6. Điều khoản & Hướng dẫn thanh toán
            Row rTermsHead = sheet.createRow(rowIdx++);
            rTermsHead.createCell(0).setCellValue("ĐIỀU KHOẢN GIAO NHẬN & HƯỚNG DẪN THANH TOÁN:");
            rTermsHead.getCell(0).setCellStyle(boldFont(workbook));

            Row rTerm1 = sheet.createRow(rowIdx++);
            rTerm1.createCell(0).setCellValue("1. Thanh toán chuyển khoản / QR Code: Số điện thoại & Zalo 0914 066 662 (Chủ TK: Thiết Bị Y Tế Kim Liên).");
            rTerm1.getCell(0).setCellStyle(subHeaderStyle);

            Row rTerm2 = sheet.createRow(rowIdx++);
            rTerm2.createCell(0).setCellValue("2. Cam kết 100% thiết bị đạt chuẩn Bộ Y Tế, đầy đủ giấy tờ CO, CQ, tờ khai hải quan và hóa đơn VAT điện tử.");
            rTerm2.getCell(0).setCellStyle(subHeaderStyle);

            Row rTerm3 = sheet.createRow(rowIdx++);
            rTerm3.createCell(0).setCellValue("3. Hỗ trợ lắp đặt, hiệu chuẩn máy, đào tạo sử dụng và bảo hành tận nơi bởi Kỹ sư chuyên ngành.");
            rTerm3.getCell(0).setCellStyle(subHeaderStyle);

            rowIdx++; // Dòng trống

            // 7. Chữ ký xác nhận
            Row rSigTitle = sheet.createRow(rowIdx++);
            Cell cSig1 = rSigTitle.createCell(1);
            cSig1.setCellValue("ĐẠI DIỆN KHÁCH HÀNG / PHÒNG KHÁM");
            cSig1.setCellStyle(boldCenter(workbook));

            Cell cSig2 = rSigTitle.createCell(5);
            cSig2.setCellValue("KỸ SƯ BÁO GIÁ KIM LIÊN");
            cSig2.setCellStyle(boldCenter(workbook));

            Row rSigNote = sheet.createRow(rowIdx++);
            Cell cSigNote1 = rSigNote.createCell(1);
            cSigNote1.setCellValue("(Ký, ghi rõ họ tên)");
            cSigNote1.setCellStyle(italicCenter(workbook));

            Cell cSigNote2 = rSigNote.createCell(5);
            cSigNote2.setCellValue("(Ký và đóng dấu xác nhận)");
            cSigNote2.setCellStyle(italicCenter(workbook));

            rowIdx += 3; // Khoảng trống chữ ký

            Row rSigName = sheet.createRow(rowIdx++);
            Cell cSigName2 = rSigName.createCell(5);
            cSigName2.setCellValue("Kỹ sư Ngô Kim Liên (0914 066 662)");
            cSigName2.setCellStyle(boldCenter(workbook));

            // Tự động căn chỉnh độ rộng cột
            sheet.setColumnWidth(0, 2000);   // STT
            sheet.setColumnWidth(1, 12000);  // Tên thiết bị
            sheet.setColumnWidth(2, 3000);   // ĐVT
            sheet.setColumnWidth(3, 3000);   // Số lượng
            sheet.setColumnWidth(4, 5000);   // Đơn giá
            sheet.setColumnWidth(5, 5500);   // Thành tiền
            sheet.setColumnWidth(6, 9000);   // Ghi chú

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi xuất file Excel báo giá đơn hàng", e);
        }
    }

    private void setBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }

    private CellStyle boldFont(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font f = workbook.createFont();
        f.setFontName("Calibri");
        f.setBold(true);
        style.setFont(f);
        return style;
    }

    private CellStyle boldCenter(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font f = workbook.createFont();
        f.setFontName("Calibri");
        f.setBold(true);
        style.setFont(f);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle italicCenter(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font f = workbook.createFont();
        f.setFontName("Calibri");
        f.setItalic(true);
        f.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFont(f);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private String translateOrderStatus(Order.OrderStatus status) {
        if (status == null) return "Chờ xử lý";
        return switch (status) {
            case PENDING -> "Chờ duyệt / Đang lập báo giá";
            case CONFIRMED -> "Đã xác nhận & Chốt đơn";
            case PROCESSING -> "Đang chuẩn bị & Kiểm định thiết bị";
            case SHIPPING -> "Đang giao hàng & Lắp đặt";
            case DELIVERED -> "Đã giao hàng & Bàn giao nghiệm thu";
            case CANCELLED -> "Đã hủy đơn hàng";
        };
    }

    private String translatePaymentMethod(Order.PaymentMethod method) {
        if (method == null) return "Thanh toán khi nhận hàng (COD)";
        return switch (method) {
            case COD -> "Tiền mặt khi nhận hàng (COD)";
            case VNPAY -> "Chuyển khoản Ngân Hàng / Mã QR / ZaloPay";
        };
    }

    private String translatePaymentStatus(Order.PaymentStatus status) {
        if (status == null) return "Chưa thanh toán";
        return switch (status) {
            case UNPAID -> "Chưa thanh toán";
            case PENDING -> "Đang chờ thanh toán";
            case PAID -> "Đã thanh toán đủ";
            case FAILED -> "Giao dịch thanh toán lỗi";
            case REFUNDED -> "Đã hoàn tiền";
        };
    }
}
