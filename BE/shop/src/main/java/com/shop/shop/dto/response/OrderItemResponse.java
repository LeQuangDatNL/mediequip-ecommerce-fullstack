package com.shop.shop.dto.response;

import com.shop.shop.entity.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImage,
        BigDecimal price,
        Integer quantity
) {
    public static OrderItemResponse from(OrderItem item) {
        String img = item.getProduct() != null ? item.getProduct().getPrimaryImageUrl() : null;
        return new OrderItemResponse(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProductName(),
                img,
                item.getPrice(),
                item.getQuantity()
        );
    }
}

