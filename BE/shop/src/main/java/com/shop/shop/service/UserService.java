package com.shop.shop.service;

import com.shop.shop.dto.request.AdminUserRequest;
import com.shop.shop.dto.response.UserResponse;
import com.shop.shop.entity.User;
import com.shop.shop.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(int page, String keyword) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must not be negative");
        PageRequest pageRequest = PageRequest.of(page, 10, Sort.by(Sort.Direction.ASC, "id"));
        String searchKeyword = keyword == null ? "" : keyword.trim();
        return userRepository.searchActiveUsers(searchKeyword, pageRequest).map(UserResponse::from);
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        return UserResponse.from(findUser(id));
    }

    @Transactional
    public UserResponse createUser(AdminUserRequest request) {
        validateRequest(request, true, null);
        User user = new User();
        user.setUsername(request.username().trim());
        user.setEmail(request.email().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setPhone(normalize(request.phone()));
        user.setRole(request.role() == null ? User.Role.CUSTOMER : request.role());
        user.setStatus(request.status() == null ? User.Status.ACTIVE : request.status());
        user.setIsDeleted(false);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, AdminUserRequest request) {
        User user = findUser(id);
        validateRequest(request, false, id);
        user.setUsername(request.username().trim());
        user.setEmail(request.email().trim());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }
        user.setFullName(request.fullName().trim());
        user.setPhone(normalize(request.phone()));
        if (request.role() != null) user.setRole(request.role());
        if (request.status() != null) user.setStatus(request.status());
        return UserResponse.from(userRepository.save(user));
    }

    // Xóa mềm: is_deleted = true và status = BANNED
    @Transactional
    public void deleteUser(Long id) {
        User user = findUser(id);
        user.setIsDeleted(true);
        user.setStatus(User.Status.BANNED);
        userRepository.save(user);
    }

    private User findUser(Long id) {
        return userRepository.findActiveById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
    }

    private void validateRequest(AdminUserRequest request, boolean passwordRequired, Long id) {
        if (request == null || blank(request.username()) || blank(request.email()) || blank(request.fullName())
                || (passwordRequired && blank(request.password()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thông tin người dùng bắt buộc");
        }
        if (id == null && (userRepository.existsByUsername(request.username().trim())
                || userRepository.existsByEmail(request.email().trim()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên đăng nhập hoặc Email đã tồn tại");
        }
        if (id != null && (userRepository.existsByUsernameAndIdNot(request.username().trim(), id)
                || userRepository.existsByEmailAndIdNot(request.email().trim(), id))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên đăng nhập hoặc Email đã tồn tại");
        }
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
    private String normalize(String value) { return blank(value) ? null : value.trim(); }
}
