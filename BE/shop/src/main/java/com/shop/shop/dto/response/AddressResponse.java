package com.shop.shop.dto.response;

import com.shop.shop.entity.Address;
import java.time.LocalDateTime;

public record AddressResponse(Long id, String recipientName, String phone, String province, String district,
                              String ward, String addressDetail, boolean defaultAddress, LocalDateTime createdAt) {
    public static AddressResponse from(Address address) {
        return new AddressResponse(address.getId(), address.getRecipientName(), address.getPhone(),
                address.getProvince(), address.getDistrict(), address.getWard(), address.getAddressDetail(),
                address.isDefaultAddress(), address.getCreatedAt());
    }
}
