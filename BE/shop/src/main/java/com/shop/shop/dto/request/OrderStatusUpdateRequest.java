package com.shop.shop.dto.request;

import com.shop.shop.entity.Order;

public record OrderStatusUpdateRequest(
        Order.OrderStatus orderStatus,
        Order.PaymentStatus paymentStatus,
        String note
) {}

