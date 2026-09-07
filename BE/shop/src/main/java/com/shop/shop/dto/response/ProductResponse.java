package com.shop.shop.dto.response;

import com.shop.shop.entity.Product;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        Long categoryId,
        String categoryName,
        CategoryResponse category,
        Long originId,
        String originName,
        String originCode,
        OriginResponse origin,
        String name,
        String slug,
        String description,
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

        Long origId = product.getOrigin() != null ? product.getOrigin().getId() : null;
        String origName = product.getOrigin() != null ? product.getOrigin().getName() : null;
        String origCode = product.getOrigin() != null ? product.getOrigin().getCode() : null;
        OriginResponse origResp = product.getOrigin() != null ? OriginResponse.from(product.getOrigin()) : null;

        String statusStr = product.getStatus() != null ? product.getStatus().name() : "ACTIVE";

        List<String> imgList = (images != null && !images.isEmpty())
                ? images
                : (product.getPrimaryImageUrl() != null ? List.of(product.getPrimaryImageUrl()) : List.of());

        return new ProductResponse(
                product.getId(),
                catId,
                catName,
                catResp,
                origId,
                origName,
                origCode,
                origResp,
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrimaryImageUrl(),
                imgList,
                rating != null ? rating : 5.0,
                reviewCount != null ? reviewCount : 0L,
                statusStr,
                product.getCreatedAt()
        );
    }
}
