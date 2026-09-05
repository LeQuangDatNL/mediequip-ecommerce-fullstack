package com.shop.shop.dto.request;

import com.shop.shop.entity.Product;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotNull(message = "Danh mục sản phẩm không được để trống")
        Long categoryId,

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Size(min = 2, max = 255, message = "Tên sản phẩm phải từ 2 đến 255 ký tự")
        String name,

        String slug,
        String description,

        @DecimalMin(value = "0.0", inclusive = true, message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
        @DecimalMax(value = "10000000000.0", message = "Giá sản phẩm không được vượt quá 10 tỷ VNĐ")
        BigDecimal price,

        @NotNull(message = "Số lượng tồn kho không được để trống")
        @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
        @Max(value = 100000, message = "Số lượng tồn kho tối đa là 100,000 sản phẩm (chống spam số lớn)")
        Integer stock,

        String primaryImageUrl,
        List<String> images,
        Product.Status status
) {}
