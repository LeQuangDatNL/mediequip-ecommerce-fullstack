package com.shop.shop.dto.response;

import com.shop.shop.entity.UserReport;
import java.time.LocalDateTime;

public record UserReportResponse(
        Long id,
        Long userId,
        String userName,
        String reportTitle,
        String reportType,
        String status,
        String fileName,
        Long fileSize,
        String dateRange,
        String errorMessage,
        LocalDateTime requestedAt,
        LocalDateTime completedAt
) {
    public static UserReportResponse from(UserReport report) {
        return new UserReportResponse(
                report.getId(),
                report.getUser() != null ? report.getUser().getId() : null,
                report.getUser() != null ? (report.getUser().getFullName() != null ? report.getUser().getFullName() : report.getUser().getUsername()) : "N/A",
                report.getReportTitle(),
                report.getReportType(),
                report.getStatus() != null ? report.getStatus().name() : "PENDING",
                report.getFileName(),
                report.getFileSize(),
                report.getDateRange(),
                report.getErrorMessage(),
                report.getRequestedAt(),
                report.getCompletedAt()
        );
    }
}
