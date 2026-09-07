package com.shop.shop.dto.request;

import com.shop.shop.entity.Origin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OriginRequest(
        @NotBlank(message = "Tên quốc gia/xuất xứ không được để trống")
        @Size(min = 2, max = 100, message = "Tên quốc gia/xuất xứ phải từ 2 đến 100 ký tự")
        String name,

        @Size(max = 20, message = "Mã quốc gia tối đa 20 ký tự (Ví dụ: VN, JP, DE, US...)")
        String code,

        String description,

        Origin.Status status
) {}

