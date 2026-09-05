package com.shop.shop.dto.response;

import com.shop.shop.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String customerName,
        String customerEmail,
        String customerPhone,
        Long addressId,
        String recipientName,
        String recipientPhone,
        String fullAddress,
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        String paymentMethod,
        String paymentStatus,
        String orderStatus,
        String note,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {
    public static OrderResponse from(Order order) {
        String fullAddr = "";
        if (order.getAddress() != null) {
            fullAddr = String.join(", ",
                    order.getAddress().getAddressDetail(),
                    order.getAddress().getWard(),
                    order.getAddress().getDistrict(),
                    order.getAddress().getProvince());
        }

        List<OrderItemResponse> itemList = order.getItems() != null
                ? order.getItems().stream().map(OrderItemResponse::from).toList()
                : List.of();

        return new OrderResponse(
                order.getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getFullName() : "N/A",
                order.getUser() != null ? order.getUser().getEmail() : "N/A",
                order.getUser() != null ? order.getUser().getPhone() : "N/A",
                order.getAddress() != null ? order.getAddress().getId() : null,
                order.getAddress() != null ? order.getAddress().getRecipientName() : "N/A",
                order.getAddress() != null ? order.getAddress().getPhone() : "N/A",
                fullAddr,
                order.getSubtotal(),
                order.getShippingFee(),
                order.getDiscountAmount(),
                order.getTotalAmount(),
                order.getPaymentMethod() != null ? order.getPaymentMethod().name() : "COD",
                order.getPaymentStatus() != null ? order.getPaymentStatus().name() : "UNPAID",
                order.getOrderStatus() != null ? order.getOrderStatus().name() : "PENDING",
                order.getNote(),
                itemList,
                order.getCreatedAt()
        );
    }
}

