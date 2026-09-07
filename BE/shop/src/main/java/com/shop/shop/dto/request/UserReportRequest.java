package com.shop.shop.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserReportRequest(
        @NotBlank(message = "Loại báo cáo không được để trống")
        String reportType,
        String reportTitle,
        String dateRange
) {}
