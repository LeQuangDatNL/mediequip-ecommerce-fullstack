package com.shop.shop.controller;

import com.shop.shop.dto.request.LoginRequest;
import com.shop.shop.dto.request.RegisterRequest;
import com.shop.shop.dto.response.LoginResponse;
import com.shop.shop.dto.response.UserResponse;
import com.shop.shop.repository.UserRepository;
import com.shop.shop.security.*;
import com.shop.shop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
public class AuthController {
    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final CaptchaService captchaService;
    private final LoginAttemptService loginAttemptService;
    private final RateLimitService rateLimitService;
    private final EmailOtpService emailOtpService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService,
                          TokenBlacklistService tokenBlacklistService,
                          CaptchaService captchaService,
                          LoginAttemptService loginAttemptService,
                          RateLimitService rateLimitService,
                          EmailOtpService emailOtpService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.captchaService = captchaService;
        this.loginAttemptService = loginAttemptService;
        this.rateLimitService = rateLimitService;
        this.emailOtpService = emailOtpService;
        this.userRepository = userRepository;
    }

    @GetMapping("/captcha")
    @Operation(summary = "Get a new math CAPTCHA challenge")
    public ResponseEntity<Map<String, Object>> getCaptcha() {
        return ResponseEntity.ok(captchaService.generateChallenge());
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Gửi mã xác thực OTP 6 số qua Gmail khi đăng ký tài khoản")
    public ResponseEntity<Map<String, Object>> sendRegisterOtp(
            @RequestParam String email,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Địa chỉ email không hợp lệ");
        }

        String cleanEmail = email.trim().toLowerCase();

        // Kiểm tra xem email đã được đăng ký chưa
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được sử dụng cho một tài khoản khác");
        }

        // Chống spam: Tối đa 3 lần gửi OTP / 5 phút, giãn cách 45s mỗi lần
        if (!rateLimitService.allowRequest("otp_" + cleanEmail, 3, 300, 45) ||
            !rateLimitService.allowRequest("otp_ip_" + clientIp, 5, 300, 30)) {
            long remaining = rateLimitService.getRemainingCooldownSeconds("otp_" + cleanEmail, 45);
            String msg = remaining > 0
                    ? "Vui lòng đợi " + remaining + " giây trước khi yêu cầu gửi lại mã OTP."
                    : "Bạn đã gửi quá nhiều yêu cầu mã OTP. Vui lòng thử lại sau 5 phút.";
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, msg);
        }

        emailOtpService.generateAndSendOtp(cleanEmail);

        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Mã xác thực OTP (6 chữ số) đã được gửi tới email " + cleanEmail + ". Mã có hiệu lực trong 5 phút.");
        response.put("expiresInSeconds", 300);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new customer account")
    public UserResponse register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("register_" + clientIp, 5, 900, 5)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Bạn đã đăng ký quá nhiều lần từ IP này. Vui lòng thử lại sau 15 phút.");
        }
        return authService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Login with a database user")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        String usernameKey = request.username() != null ? request.username().toLowerCase().trim() : clientIp;

        // 1. Kiểm tra tài khoản hoặc IP có đang bị tạm khóa không
        if (loginAttemptService.isLocked(usernameKey) || loginAttemptService.isLocked(clientIp)) {
            long remaining = Math.max(
                    loginAttemptService.getRemainingLockoutSeconds(usernameKey),
                    loginAttemptService.getRemainingLockoutSeconds(clientIp)
            );
            throw new LockedException("Tài khoản hoặc thiết bị của bạn đang bị tạm khóa trong " + (remaining > 0 ? remaining : 900) + " giây do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.");
        }

        // 2. Kiểm tra xem có bắt buộc CAPTCHA không (khi sai >= 3 lần)
        boolean requireCaptcha = loginAttemptService.isCaptchaRequired(usernameKey) || loginAttemptService.isCaptchaRequired(clientIp);
        if (requireCaptcha) {
            if (request.captchaId() == null || request.captchaAnswer() == null ||
                    !captchaService.validateCaptcha(request.captchaId(), request.captchaAnswer())) {
                loginAttemptService.loginFailed(usernameKey);
                loginAttemptService.loginFailed(clientIp);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác thực CAPTCHA không chính xác hoặc đã hết hạn. Vui lòng thử lại.");
            }
        }

        // 3. Tiến hành xác thực đăng nhập
        try {
            LoginResponse response = authService.login(request);
            loginAttemptService.loginSucceeded(usernameKey);
            loginAttemptService.loginSucceeded(clientIp);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            loginAttemptService.loginFailed(usernameKey);
            loginAttemptService.loginFailed(clientIp);

            int failedAttempts = Math.max(
                    loginAttemptService.getFailedAttempts(usernameKey),
                    loginAttemptService.getFailedAttempts(clientIp)
            );

            boolean isNowLocked = loginAttemptService.isLocked(usernameKey) || loginAttemptService.isLocked(clientIp);
            if (isNowLocked) {
                long remaining = Math.max(
                        loginAttemptService.getRemainingLockoutSeconds(usernameKey),
                        loginAttemptService.getRemainingLockoutSeconds(clientIp)
                );
                throw new LockedException("Bạn đã nhập sai " + failedAttempts + " lần liên tiếp. Tài khoản/IP bị tạm khóa trong " + (remaining > 0 ? remaining : 900) + " giây.");
            }

            boolean isNowCaptcha = loginAttemptService.isCaptchaRequired(usernameKey) || loginAttemptService.isCaptchaRequired(clientIp);

            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", HttpStatus.UNAUTHORIZED.value());
            errorBody.put("error", "Unauthorized");
            errorBody.put("message", "Tên đăng nhập hoặc mật khẩu không chính xác! (Sai " + failedAttempts + "/5 lần)");
            errorBody.put("failedAttempts", failedAttempts);
            errorBody.put("requireCaptcha", isNowCaptcha);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke the current JWT")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            tokenBlacklistService.revoke(authorization.substring(7));
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get the authenticated user")
    @SecurityRequirement(name = "bearerAuth")
    public Authentication me(Authentication authentication) {
        return authentication;
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        String xReal = request.getHeader("X-Real-IP");
        if (xReal != null && !xReal.isBlank()) {
            return xReal.trim();
        }
        return request.getRemoteAddr();
    }
}
