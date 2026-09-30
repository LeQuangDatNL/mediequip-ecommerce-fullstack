package com.shop.shop.security;

import com.shop.shop.service.EmailService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailOtpService {
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    // Cache lưu OTP: email -> OtpEntry
    private final Map<String, OtpEntry> otpCache = new ConcurrentHashMap<>();

    // Thời gian sống của mã OTP: 5 phút (300 giây)
    private static final long OTP_VALIDITY_SECONDS = 300;

    public EmailOtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    private record OtpEntry(String code, Instant createdAt) {
        boolean isExpired() {
            return Instant.now().isAfter(createdAt.plusSeconds(OTP_VALIDITY_SECONDS));
        }
    }

    /**
     * Tạo mã OTP 6 chữ số ngẫu nhiên và gửi tới Email
     */
    public String generateAndSendOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        String cleanEmail = email.trim().toLowerCase();

        // Tạo 6 chữ số ngẫu nhiên
        int codeNum = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(codeNum);

        otpCache.put(cleanEmail, new OtpEntry(otpCode, Instant.now()));

        // Gửi qua Gmail
        emailService.sendRegistrationOtp(cleanEmail, otpCode);

        return otpCode;
    }

    /**
     * Kiểm tra tính hợp lệ của mã OTP
     */
    public boolean verifyOtp(String email, String inputCode) {
        if (email == null || inputCode == null || inputCode.isBlank()) {
            return false;
        }
        String cleanEmail = email.trim().toLowerCase();
        OtpEntry entry = otpCache.get(cleanEmail);

        if (entry == null || entry.isExpired()) {
            otpCache.remove(cleanEmail);
            return false;
        }

        if (entry.code().equals(inputCode.trim())) {
            otpCache.remove(cleanEmail); // Dùng xong xóa ngay
            return true;
        }

        return false;
    }

    /**
     * Kiểm tra xem email có mã OTP đang chờ xác thực không
     */
    public boolean hasActiveOtp(String email) {
        if (email == null) return false;
        String cleanEmail = email.trim().toLowerCase();
        OtpEntry entry = otpCache.get(cleanEmail);
        return entry != null && !entry.isExpired();
    }
}
