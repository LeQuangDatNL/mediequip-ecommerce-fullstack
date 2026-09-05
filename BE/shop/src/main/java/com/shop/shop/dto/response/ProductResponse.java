package com.shop.shop.dto.response;

import com.shop.shop.entity.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        Long categoryId,
        String categoryName,
        CategoryResponse category,
        String name,
        String slug,
        String description,
        BigDecimal price,
        Integer stock,
        String primaryImageUrl,
        List<String> images,
        Double rating,
        Long reviewCount,
        String status,
        LocalDateTime createdAt
) {
    public static ProductResponse from(Product product) {
        return from(product, null, 5.0, 0L);
    }

    public static ProductResponse from(Product product, List<String> images, Double rating, Long reviewCount) {
        Long catId = product.getCategory() != null ? product.getCategory().getId() : null;
        String catName = product.getCategory() != null ? product.getCategory().getName() : null;
        CategoryResponse catResp = product.getCategory() != null ? CategoryResponse.from(product.getCategory()) : null;
        String statusStr = product.getStatus() != null ? product.getStatus().name() : "ACTIVE";

        List<String> imgList = (images != null && !images.isEmpty())
                ? images
                : (product.getPrimaryImageUrl() != null ? List.of(product.getPrimaryImageUrl()) : List.of());

        return new ProductResponse(
                product.getId(),
                catId,
                catName,
                catResp,
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getPrimaryImageUrl(),
                imgList,
                rating != null ? rating : 5.0,
                reviewCount != null ? reviewCount : 0L,
                statusStr,
                product.getCreatedAt()
        );
    }
}
