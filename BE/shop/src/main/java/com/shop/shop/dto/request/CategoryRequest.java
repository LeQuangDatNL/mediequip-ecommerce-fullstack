package com.shop.shop.dto.request;

import com.shop.shop.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(min = 2, max = 100, message = "Tên danh mục phải từ 2 đến 100 ký tự")
        String name,

        String slug,
        String description,
        Category.Status status
) {}
