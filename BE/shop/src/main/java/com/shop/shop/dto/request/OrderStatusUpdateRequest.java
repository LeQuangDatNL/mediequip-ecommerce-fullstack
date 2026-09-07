package com.shop.shop.dto.request;

import com.shop.shop.entity.Order;
import java.math.BigDecimal;

public record OrderStatusUpdateRequest(
        Order.OrderStatus orderStatus,
        Order.PaymentStatus paymentStatus,
        String note,
        BigDecimal shippingFee,
        BigDecimal discountAmount,
        BigDecimal totalAmount
) {}
