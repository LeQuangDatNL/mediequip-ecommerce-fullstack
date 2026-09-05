package com.shop.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "Họ tên người nhận không được để trống")
        @Size(min = 2, max = 100, message = "Họ tên người nhận phải từ 2 đến 100 ký tự")
        String recipientName,

        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại người nhận không hợp lệ (VD: 0901234567)")
        String phone,

        @NotBlank(message = "Tỉnh/Thành phố không được để trống")
        String province,

        @NotBlank(message = "Quận/Huyện không được để trống")
        String district,

        @NotBlank(message = "Phường/Xã không được để trống")
        String ward,

        @NotBlank(message = "Địa chỉ chi tiết không được để trống")
        @Size(min = 3, max = 255, message = "Địa chỉ chi tiết phải từ 3 đến 255 ký tự")
        String addressDetail,

        boolean defaultAddress
) {}
