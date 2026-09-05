package com.shop.shop.service;

import com.shop.shop.dto.request.LoginRequest;
import com.shop.shop.dto.request.RegisterRequest;
import com.shop.shop.dto.response.LoginResponse;
import com.shop.shop.dto.response.UserResponse;
import com.shop.shop.entity.User;
import com.shop.shop.repository.UserRepository;
import com.shop.shop.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal());
        return new LoginResponse(token, "Bearer");
    }

    public UserResponse register(RegisterRequest request) {
        if (request == null
                || isBlank(request.username())
                || isBlank(request.email())
                || isBlank(request.password())
                || isBlank(request.fullName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng điền đầy đủ các thông tin bắt buộc (username, email, password, fullName)");
        }

        String username = request.username().trim();
        String email = request.email().trim();

        if (request.password().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu phải có ít nhất 6 ký tự");
        }

        if (userRepository.existsByUsername(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tên đăng nhập (username) đã tồn tại");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setPhone(isBlank(request.phone()) ? null : request.phone().trim());
        user.setRole(User.Role.CUSTOMER);
        user.setStatus(User.Status.ACTIVE);

        User savedUser = userRepository.save(user);
        return UserResponse.from(savedUser);
    }

    private boolean isBlank(String str) {
        return str == null || str.isBlank();
    }
}

