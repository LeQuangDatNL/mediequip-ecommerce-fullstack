package com.shop.shop.service;

import com.shop.shop.dto.request.AccountUpdateRequest;
import com.shop.shop.dto.request.PasswordChangeRequest;
import com.shop.shop.dto.response.UserResponse;
import com.shop.shop.entity.User;
import com.shop.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccountService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getCurrentAccount(String username) {
        return UserResponse.from(findUser(username));
    }

    public UserResponse updateCurrentAccount(String username, AccountUpdateRequest request) {
        User user = findUser(username);
        if (request == null || blank(request.fullName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ và tên không được để trống");
        }

        // Cập nhật Email nếu có thay đổi
        if (!blank(request.email())) {
            String email = request.email().trim();
            if (userRepository.existsByEmailAndIdNot(email, user.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được sử dụng bởi tài khoản khác");
            }
            user.setEmail(email);
        }

        // Cập nhật Họ và tên
        user.setFullName(request.fullName().trim());

        // Cập nhật Số điện thoại
        if (request.phone() != null) {
            user.setPhone(request.phone().trim().isEmpty() ? null : request.phone().trim());
        }

        return UserResponse.from(userRepository.save(user));
    }

    public void changePassword(String username, PasswordChangeRequest request) {
        User user = findUser(username);
        if (request == null || blank(request.currentPassword()) || blank(request.newPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới");
        }
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không chính xác");
        }
        if (request.newPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        if (request.currentPassword().equals(request.newPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới không được trùng với mật khẩu hiện tại");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin tài khoản"));
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
}
