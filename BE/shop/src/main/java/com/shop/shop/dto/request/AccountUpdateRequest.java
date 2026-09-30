package com.shop.shop.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AccountUpdateRequest(
        @NotBlank(message = "Họ và tên không được để trống")
        @Size(min = 2, max = 100, message = "Họ và tên phải từ 2 đến 100 ký tự")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng (VD: name@domain.com)")
        String email,

        @Pattern(regexp = "^$|^(0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại di động không hợp lệ (VD: 0901234567)")
        String phone
) {}
