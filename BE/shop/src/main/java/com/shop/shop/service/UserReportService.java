package com.shop.shop.service;

import com.shop.shop.dto.request.UserReportRequest;
import com.shop.shop.dto.response.UserReportResponse;
import com.shop.shop.entity.Order;
import com.shop.shop.entity.OrderItem;
import com.shop.shop.entity.User;
import com.shop.shop.entity.UserReport;
import com.shop.shop.repository.OrderRepository;
import com.shop.shop.repository.UserReportRepository;
import com.shop.shop.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class UserReportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private final UserReportRepository userReportRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public UserReportService(
            UserReportRepository userReportRepository,
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.userReportRepository = userReportRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // 1. Người dùng yêu cầu xuất báo cáo Excel
    @Transactional
    public UserReportResponse requestReport(UserReportRequest request, String username) {
        User user = findUser(username);

        String reportType = request.reportType() != null ? request.reportType().toUpperCase() : "ORDER_SUMMARY";
        String defaultTitle = switch (reportType) {
            case "PURCHASE_HISTORY" -> "Báo Cáo Chi Tiết Lịch Sử Mua Hàng & Danh Mục Thiết Bị";
            case "EQUIPMENT_EXPENSE" -> "Báo Cáo Thống Kê Dự Toán Chi Phí Thiết Bị Y Tế";
            default -> "Báo Cáo Tổng Hợp Đơn Hàng & Báo Giá";
        };

        String title = request.reportTitle() != null && !request.reportTitle().isBlank()
                ? request.reportTitle().trim()
                : defaultTitle;

        String dateRange = request.dateRange() != null && !request.dateRange().isBlank()
                ? request.dateRange().trim()
                : "Toàn bộ thời gian";

        String timestamp = LocalDateTime.now().format(FILE_DATE_FORMAT);
        String fileName = "Bao_Cao_" + reportType + "_MD_" + user.getId() + "_" + timestamp + ".xlsx";

        UserReport report = new UserReport();
        report.setUser(user);
        report.setReportTitle(title);
        report.setReportType(reportType);
        report.setStatus(UserReport.ReportStatus.PROCESSING);
        report.setDateRange(dateRange);
        report.setFileName(fileName);
        report.setIsDeleted(false);

        UserReport saved = userReportRepository.save(report);

        try {
            // Tạo nội dung file Excel để tính dung lượng fileSize và đảm bảo hoàn thành
            byte[] excelBytes = buildExcelData(saved, user);
            saved.setFileSize((long) excelBytes.length);
            saved.setStatus(UserReport.ReportStatus.COMPLETED);
            saved.setCompletedAt(LocalDateTime.now());
        } catch (Exception e) {
            saved.setStatus(UserReport.ReportStatus.FAILED);
            saved.setErrorMessage(e.getMessage() != null ? e.getMessage() : "Lỗi không xác định khi tạo báo cáo Excel");
        }

        UserReport completed = userReportRepository.save(saved);
        return UserReportResponse.from(completed);
    }

    // 2. Lấy danh sách các báo cáo Excel của tài khoản đang đăng nhập
    @Transactional(readOnly = true)
    public List<UserReportResponse> getMyReports(String username) {
        User user = findUser(username);
        return userReportRepository.findByUserIdAndIsDeletedFalseOrderByIdDesc(user.getId())
                .stream()
                .map(UserReportResponse::from)
                .toList();
    }

    // 3. Tải file Excel báo cáo hoàn thành
    @Transactional(readOnly = true)
    public byte[] downloadReport(Long reportId, String username) {
        User user = findUser(username);
        UserReport report = userReportRepository.findByIdAndUserIdAndIsDeletedFalse(reportId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy báo cáo #" + reportId));

        if (report.getStatus() != UserReport.ReportStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Báo cáo chưa hoàn thành hoặc đã thất bại, không thể tải");
        }

        return buildExcelData(report, user);
    }

    // 4. Xóa báo cáo khỏi lịch sử
    @Transactional
    public void deleteReport(Long reportId, String username) {
        User user = findUser(username);
        UserReport report = userReportRepository.findByIdAndUserIdAndIsDeletedFalse(reportId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy báo cáo #" + reportId));

        report.setIsDeleted(true);
        userReportRepository.save(report);
    }

    /**
     * Sinh dữ liệu Excel (.xlsx) chuẩn phong cách MediEquip Kim Liên
     * LƯU Ý BẢO MẬT & QUY ĐỊNH: Tuyệt đối chỉ lấy dữ liệu Order của chính User đó, KHÔNG chạm vào Contact/Consultations.
     */
    private byte[] buildExcelData(UserReport report, User user) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Lấy toàn bộ đơn hàng của User (chỉ đơn hàng isDeleted = false)
            List<Order> orders = orderRepository.findByUserIdAndIsDeletedFalseOrderByIdDesc(user.getId());

            // Font & Styles
            Font fontHeader = workbook.createFont();
            fontHeader.setFontName("Calibri");
            fontHeader.setFontHeightInPoints((short) 10);
            fontHeader.setBold(true);
            fontHeader.setColor(IndexedColors.WHITE.getIndex());

            CellStyle thStyle = workbook.createCellStyle();
            thStyle.setFont(fontHeader);
            thStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex());
            thStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            thStyle.setAlignment(HorizontalAlignment.CENTER);
            thStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(thStyle);

            CellStyle textStyle = workbook.createCellStyle();
            textStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(textStyle);

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);
            centerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            setBorders(centerStyle);

            DataFormat df = workbook.createDataFormat();
            CellStyle moneyStyle = workbook.createCellStyle();
            moneyStyle.setAlignment(HorizontalAlignment.RIGHT);
            moneyStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            moneyStyle.setDataFormat(df.getFormat("#,##0 ₫"));
            setBorders(moneyStyle);

            CellStyle companyStyle = workbook.createCellStyle();
            Font compFont = workbook.createFont();
            compFont.setFontName("Calibri");
            compFont.setFontHeightInPoints((short) 13);
            compFont.setBold(true);
            compFont.setColor(IndexedColors.TEAL.getIndex());
            companyStyle.setFont(compFont);

            // ==================== SHEET 1: TỔNG QUAN BÁO CÁO ====================
            Sheet sheet1 = workbook.createSheet("TongQuan_BaoCao");
            sheet1.setDisplayGridlines(true);

            int r = 0;
            Row row0 = sheet1.createRow(r++);
            Cell c0 = row0.createCell(0);
            c0.setCellValue("MEDIEQUIP VIETNAM - THIẾT BỊ Y TẾ KIM LIÊN");
            c0.setCellStyle(companyStyle);

            Row row1 = sheet1.createRow(r++);
            row1.createCell(0).setCellValue("Hotline / Zalo: 0914 066 662  |  Email: lienkehoach@gmail.com  |  Phụ trách: Kỹ sư Ngô Kim Liên");

            r++; // Dòng trống

            Row rowTitle = sheet1.createRow(r++);
            rowTitle.setHeightInPoints(22);
            Cell cTitle = rowTitle.createCell(0);
            cTitle.setCellValue(report.getReportTitle().toUpperCase());
            CellStyle titleStyle = workbook.createCellStyle();
            Font tFont = workbook.createFont();
            tFont.setBold(true);
            tFont.setFontHeightInPoints((short) 12);
            tFont.setColor(IndexedColors.DARK_TEAL.getIndex());
            titleStyle.setFont(tFont);
            cTitle.setCellStyle(titleStyle);
            sheet1.addMergedRegion(new CellRangeAddress(r - 1, r - 1, 0, 5));

            Row rowMeta1 = sheet1.createRow(r++);
            rowMeta1.createCell(0).setCellValue("Tài khoản yêu cầu:");
            rowMeta1.createCell(1).setCellValue(user.getFullName() != null ? user.getFullName() : user.getUsername());
            rowMeta1.createCell(3).setCellValue("Email:");
            rowMeta1.createCell(4).setCellValue(user.getEmail());

            Row rowMeta2 = sheet1.createRow(r++);
            rowMeta2.createCell(0).setCellValue("Phạm vi thời gian:");
            rowMeta2.createCell(1).setCellValue(report.getDateRange() != null ? report.getDateRange() : "Toàn bộ");
            rowMeta2.createCell(3).setCellValue("Thời gian lập báo cáo:");
            rowMeta2.createCell(4).setCellValue(LocalDateTime.now().format(DATE_FORMATTER));

            r++; // Dòng trống

            // Thống kê tổng hợp
            BigDecimal totalAmountSpent = BigDecimal.ZERO;
            int totalItemsCount = 0;
            for (Order ord : orders) {
                if (ord.getTotalAmount() != null) {
                    totalAmountSpent = totalAmountSpent.add(ord.getTotalAmount());
                }
                if (ord.getItems() != null) {
                    totalItemsCount += ord.getItems().size();
                }
            }

            Row rStatH = sheet1.createRow(r++);
            rStatH.setHeightInPoints(20);
            String[] statHeaders = {"Chỉ số thống kê", "Giá trị tổng hợp", "Ghi chú phân loại"};
            for (int i = 0; i < statHeaders.length; i++) {
                Cell cell = rStatH.createCell(i);
                cell.setCellValue(statHeaders[i]);
                cell.setCellStyle(thStyle);
            }

            Object[][] statRows = {
                    {"Tổng số lượng đơn hàng / Yêu cầu báo giá", orders.size() + " đơn hàng", "Toàn bộ lịch sử tài khoản"},
                    {"Tổng số chủng loại thiết bị đã đặt", totalItemsCount + " loại thiết bị", "Bao gồm cả thiết bị chính & vật tư phụ"},
                    {"Tổng kinh phí dự toán / Đã thanh toán", totalAmountSpent.doubleValue(), "VNĐ (Đã trừ chiết khấu dự án)"},
                    {"Cam kết chất lượng thiết bị y tế", "100% Đầy đủ CO/CQ Bộ Y Tế", "Bảo hành 12-24 tháng & Lắp đặt tận nơi"}
            };

            for (Object[] sRow : statRows) {
                Row rowStat = sheet1.createRow(r++);
                Cell c1 = rowStat.createCell(0);
                c1.setCellValue((String) sRow[0]);
                c1.setCellStyle(textStyle);

                Cell c2 = rowStat.createCell(1);
                if (sRow[1] instanceof Double d) {
                    c2.setCellValue(d);
                    c2.setCellStyle(moneyStyle);
                } else {
                    c2.setCellValue((String) sRow[1]);
                    c2.setCellStyle(centerStyle);
                }

                Cell c3 = rowStat.createCell(2);
                c3.setCellValue((String) sRow[2]);
                c3.setCellStyle(textStyle);
            }

            sheet1.setColumnWidth(0, 12000);
            sheet1.setColumnWidth(1, 8000);
            sheet1.setColumnWidth(2, 10000);

            // ==================== SHEET 2: DANH SÁCH ĐƠN HÀNG ====================
            Sheet sheet2 = workbook.createSheet("DanhSach_DonHang");
            sheet2.setDisplayGridlines(true);

            int r2 = 0;
            Row r2Header = sheet2.createRow(r2++);
            r2Header.setHeightInPoints(22);
            String[] orderHeaders = {
                    "STT", "Mã Đơn", "Ngày Đặt", "Người Nhận", "Số Điện Thoại",
                    "Địa Chỉ Giao Nhận", "Hình Thức TT", "Trạng Thái TT", "Tiến Độ Đơn", "Tổng Tiền (VNĐ)"
            };
            for (int i = 0; i < orderHeaders.length; i++) {
                Cell cell = r2Header.createCell(i);
                cell.setCellValue(orderHeaders[i]);
                cell.setCellStyle(thStyle);
            }

            int stt = 1;
            for (Order ord : orders) {
                Row rowOrder = sheet2.createRow(r2++);
                rowOrder.setHeightInPoints(20);

                rowOrder.createCell(0).setCellValue(stt++);
                rowOrder.getCell(0).setCellStyle(centerStyle);

                rowOrder.createCell(1).setCellValue("#MD-" + ord.getId());
                rowOrder.getCell(1).setCellStyle(centerStyle);

                rowOrder.createCell(2).setCellValue(ord.getCreatedAt() != null ? ord.getCreatedAt().format(DATE_FORMATTER) : "N/A");
                rowOrder.getCell(2).setCellStyle(centerStyle);

                rowOrder.createCell(3).setCellValue(ord.getAddress() != null ? ord.getAddress().getRecipientName() : "N/A");
                rowOrder.getCell(3).setCellStyle(textStyle);

                rowOrder.createCell(4).setCellValue(ord.getAddress() != null ? ord.getAddress().getPhone() : "N/A");
                rowOrder.getCell(4).setCellStyle(centerStyle);

                String fullAddr = ord.getAddress() != null ? ord.getAddress().getAddressDetail() + ", " + ord.getAddress().getProvince() : "N/A";
                rowOrder.createCell(5).setCellValue(fullAddr);
                rowOrder.getCell(5).setCellStyle(textStyle);

                rowOrder.createCell(6).setCellValue(ord.getPaymentMethod() != null ? ord.getPaymentMethod().name() : "COD");
                rowOrder.getCell(6).setCellStyle(centerStyle);

                rowOrder.createCell(7).setCellValue(translatePaymentStatus(ord.getPaymentStatus()));
                rowOrder.getCell(7).setCellStyle(centerStyle);

                rowOrder.createCell(8).setCellValue(translateOrderStatus(ord.getOrderStatus()));
                rowOrder.getCell(8).setCellStyle(centerStyle);

                Cell cTot = rowOrder.createCell(9);
                cTot.setCellValue(ord.getTotalAmount() != null ? ord.getTotalAmount().doubleValue() : 0);
                cTot.setCellStyle(moneyStyle);
            }

            sheet2.setColumnWidth(0, 2000);
            sheet2.setColumnWidth(1, 3500);
            sheet2.setColumnWidth(2, 4500);
            sheet2.setColumnWidth(3, 6000);
            sheet2.setColumnWidth(4, 4000);
            sheet2.setColumnWidth(5, 10000);
            sheet2.setColumnWidth(6, 3500);
            sheet2.setColumnWidth(7, 4500);
            sheet2.setColumnWidth(8, 6500);
            sheet2.setColumnWidth(9, 5000);

            // ==================== SHEET 3: CHI TIẾT THIẾT BỊ Y TẾ ====================
            Sheet sheet3 = workbook.createSheet("ChiTiet_ThietBiYTe");
            sheet3.setDisplayGridlines(true);

            int r3 = 0;
            Row r3Header = sheet3.createRow(r3++);
            r3Header.setHeightInPoints(22);
            String[] itemHeaders = {
                    "STT", "Mã Đơn", "Tên Thiết Bị Y Tế", "Số Lượng", "Đơn Giá (VNĐ)", "Thành Tiền (VNĐ)", "Ngày Đặt"
            };
            for (int i = 0; i < itemHeaders.length; i++) {
                Cell cell = r3Header.createCell(i);
                cell.setCellValue(itemHeaders[i]);
                cell.setCellStyle(thStyle);
            }

            int sttItem = 1;
            for (Order ord : orders) {
                if (ord.getItems() != null) {
                    for (OrderItem item : ord.getItems()) {
                        Row rowItem = sheet3.createRow(r3++);
                        rowItem.setHeightInPoints(20);

                        rowItem.createCell(0).setCellValue(sttItem++);
                        rowItem.getCell(0).setCellStyle(centerStyle);

                        rowItem.createCell(1).setCellValue("#MD-" + ord.getId());
                        rowItem.getCell(1).setCellStyle(centerStyle);

                        rowItem.createCell(2).setCellValue(item.getProductName());
                        rowItem.getCell(2).setCellStyle(textStyle);

                        rowItem.createCell(3).setCellValue(item.getQuantity());
                        rowItem.getCell(3).setCellStyle(centerStyle);

                        Cell cPrice = rowItem.createCell(4);
                        cPrice.setCellValue(item.getPrice() != null ? item.getPrice().doubleValue() : 0);
                        cPrice.setCellStyle(moneyStyle);

                        Cell cItemTot = rowItem.createCell(5);
                        BigDecimal total = (item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO)
                                .multiply(BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 1));
                        cItemTot.setCellValue(total.doubleValue());
                        cItemTot.setCellStyle(moneyStyle);

                        rowItem.createCell(6).setCellValue(ord.getCreatedAt() != null ? ord.getCreatedAt().format(DATE_FORMATTER) : "N/A");
                        rowItem.getCell(6).setCellStyle(centerStyle);
                    }
                }
            }

            sheet3.setColumnWidth(0, 2000);
            sheet3.setColumnWidth(1, 3500);
            sheet3.setColumnWidth(2, 12000);
            sheet3.setColumnWidth(3, 3000);
            sheet3.setColumnWidth(4, 5000);
            sheet3.setColumnWidth(5, 5500);
            sheet3.setColumnWidth(6, 4500);

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi sinh dữ liệu báo cáo Excel: " + e.getMessage(), e);
        }
    }

    private void setBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }

    private User findUser(String username) {
        return userRepository.findActiveByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Người dùng không tồn tại"));
    }

    private String translateOrderStatus(Order.OrderStatus status) {
        if (status == null) return "Chờ xử lý";
        return switch (status) {
            case PENDING -> "Chờ duyệt";
            case CONFIRMED -> "Đã xác nhận";
            case PROCESSING -> "Đang xử lý";
            case SHIPPING -> "Đang giao";
            case DELIVERED -> "Hoàn thành";
            case CANCELLED -> "Đã hủy";
        };
    }

    private String translatePaymentStatus(Order.PaymentStatus status) {
        if (status == null) return "Chưa thanh toán";
        return switch (status) {
            case UNPAID -> "Chưa thanh toán";
            case PENDING -> "Đang xử lý";
            case PAID -> "Đã thanh toán";
            case FAILED -> "Thất bại";
            case REFUNDED -> "Hoàn tiền";
        };
    }
}
