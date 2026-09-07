package com.shop.shop.controller;

import com.shop.shop.dto.request.UserReportRequest;
import com.shop.shop.dto.response.UserReportResponse;
import com.shop.shop.service.UserReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-reports")
@Tag(name = "User Reports", description = "Quản lý và theo dõi tiến độ xuất báo cáo Excel của người dùng")
public class UserReportController {

    private final UserReportService userReportService;

    public UserReportController(UserReportService userReportService) {
        this.userReportService = userReportService;
    }

    @PostMapping
    @Operation(summary = "Yêu cầu tạo báo cáo Excel mới cho tài khoản người dùng")
    public UserReportResponse requestReport(
            @Valid @RequestBody UserReportRequest request,
            Authentication authentication
    ) {
        return userReportService.requestReport(request, authentication.getName());
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Lấy danh sách các báo cáo Excel của tài khoản đang đăng nhập")
    public List<UserReportResponse> getMyReports(Authentication authentication) {
        return userReportService.getMyReports(authentication.getName());
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Tải file Excel báo cáo hoàn thành (.xlsx)")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable Long id,
            Authentication authentication
    ) {
        byte[] excelBytes = userReportService.downloadReport(id, authentication.getName());
        String filename = "Bao_Cao_Excel_" + id + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa báo cáo khỏi danh sách của tôi")
    public ResponseEntity<Void> deleteReport(
            @PathVariable Long id,
            Authentication authentication
    ) {
        userReportService.deleteReport(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
