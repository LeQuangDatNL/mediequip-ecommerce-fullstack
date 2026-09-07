package com.shop.shop.dto.request;

import com.shop.shop.entity.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ProductRequest(
        @NotNull(message = "Danh mục sản phẩm không được để trống")
        Long categoryId,

        Long originId,

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Size(min = 2, max = 255, message = "Tên sản phẩm phải từ 2 đến 255 ký tự")
        String name,

        String slug,
        String description,
        String primaryImageUrl,
        List<String> images,
        Product.Status status
) {}
