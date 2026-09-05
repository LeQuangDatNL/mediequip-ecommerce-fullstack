package com.shop.shop.dto.request;

import java.util.List;

public record BatchImageRequest(
        List<ImageItemRequest> images
) {
    public record ImageItemRequest(
            String name,
            String url,
            String fileType,
            Long fileSize
    ) {}
}

