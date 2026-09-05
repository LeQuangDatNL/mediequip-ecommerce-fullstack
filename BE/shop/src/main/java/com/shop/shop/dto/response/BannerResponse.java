package com.shop.shop.dto.response;

import com.shop.shop.entity.Banner;
import java.time.LocalDateTime;

public record BannerResponse(
    Long id,
    String title,
    String subtitle,
    String badgeText,
    String imageUrl,
    String buttonText,
    String buttonLink,
    String secondaryButtonText,
    String secondaryButtonLink,
    Integer displayOrder,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static BannerResponse from(Banner banner) {
        return new BannerResponse(
            banner.getId(),
            banner.getTitle(),
            banner.getSubtitle(),
            banner.getBadgeText(),
            banner.getImageUrl(),
            banner.getButtonText(),
            banner.getButtonLink(),
            banner.getSecondaryButtonText(),
            banner.getSecondaryButtonLink(),
            banner.getDisplayOrder(),
            banner.getStatus() != null ? banner.getStatus().name() : "ACTIVE",
            banner.getCreatedAt(),
            banner.getUpdatedAt()
        );
    }
}

