package com.shop.shop.dto.response;

import com.shop.shop.entity.Category;

public record CategoryResponse(Long id, String name, String slug, String description, String status) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug(),
                category.getDescription(), category.getStatus().name());
    }
}
