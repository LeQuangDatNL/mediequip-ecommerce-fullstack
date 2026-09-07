package com.shop.shop.dto.response;

import com.shop.shop.entity.Origin;
import java.time.LocalDateTime;

public record OriginResponse(
        Long id,
        String name,
        String code,
        String description,
        String status,
        LocalDateTime createdAt
) {
    public static OriginResponse from(Origin origin) {
        if (origin == null) return null;
        return new OriginResponse(
                origin.getId(),
                origin.getName(),
                origin.getCode(),
                origin.getDescription(),
                origin.getStatus() != null ? origin.getStatus().name() : "ACTIVE",
                origin.getCreatedAt()
        );
    }
}

