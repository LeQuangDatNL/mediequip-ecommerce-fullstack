package com.shop.shop.dto.request;

import com.shop.shop.entity.BannerStatus;
import jakarta.validation.constraints.NotBlank;

public record BannerRequest(
    @NotBlank(message = "Tiêu đề banner không được để trống")
    String title,
    String subtitle,
    String badgeText,
    @NotBlank(message = "Link ảnh banner không được để trống")
    String imageUrl,
    String buttonText,
    String buttonLink,
    String secondaryButtonText,
    String secondaryButtonLink,
    Integer displayOrder,
    BannerStatus status
) {}

