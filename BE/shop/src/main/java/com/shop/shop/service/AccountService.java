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
        if (request == null || blank(request.email()) || blank(request.fullName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and full name are required");
        }
        String email = request.email().trim();
        if (userRepository.existsByEmailAndIdNot(email, user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        return UserResponse.from(userRepository.save(user));
    }

    public void changePassword(String username, PasswordChangeRequest request) {
        User user = findUser(username);
        if (request == null || blank(request.currentPassword()) || blank(request.newPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Both passwords are required");
        }
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (request.newPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must have at least 6 characters");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
}
