package com.shop.shop.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.util.List;

public record OrderCreateRequest(
        Long addressId,
        @NotBlank(message = "Tên người nhận không được để trống")
        String recipientName,
        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "Số điện thoại không đúng định dạng Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)")
        String phone,
        String province,
        String district,
        String ward,
        String addressDetail,
        String address,
        String paymentMethod,
        String note,
        @NotEmpty(message = "Danh sách sản phẩm trong đơn hàng không được để trống")
        @Valid
        List<OrderItemRequest> items
) {}
