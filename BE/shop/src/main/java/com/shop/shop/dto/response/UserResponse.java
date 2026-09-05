package com.shop.shop.dto.response;

import com.shop.shop.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String phone,
        String role,
        String status,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getFullName(),
                user.getPhone(), user.getRole().name(), user.getStatus().name(), user.getCreatedAt());
    }
}
