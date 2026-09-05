package com.shop.shop.dto.response;

import com.shop.shop.entity.ImageMedia;
import java.time.LocalDateTime;

public record ImageMediaResponse(
        Long id,
        String name,
        String url,
        String fileType,
        Long fileSize,
        LocalDateTime createdAt
) {
    public static ImageMediaResponse from(ImageMedia image) {
        return new ImageMediaResponse(
                image.getId(),
                image.getName(),
                image.getUrl(),
                image.getFileType(),
                image.getFileSize(),
                image.getCreatedAt()
        );
    }
}

