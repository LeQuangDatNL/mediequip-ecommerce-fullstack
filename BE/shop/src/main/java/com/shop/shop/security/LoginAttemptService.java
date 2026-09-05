package com.shop.shop.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    public static final int MAX_ATTEMPTS_BEFORE_CAPTCHA = 3;
    public static final int MAX_ATTEMPTS_BEFORE_LOCKOUT = 5;
    public static final long LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 phút

    private static class AttemptInfo {
        int failedCount;
        long lastAttemptTime;
        long lockedUntil;

        AttemptInfo(int failedCount, long lastAttemptTime, long lockedUntil) {
            this.failedCount = failedCount;
            this.lastAttemptTime = lastAttemptTime;
            this.lockedUntil = lockedUntil;
        }
    }

    private final Map<String, AttemptInfo> attemptsCache = new ConcurrentHashMap<>();

    /**
     * Ghi nhận 1 lần đăng nhập thất bại
     */
    public void loginFailed(String key) {
        long now = System.currentTimeMillis();
        AttemptInfo info = attemptsCache.get(key);

        if (info == null) {
            attemptsCache.put(key, new AttemptInfo(1, now, 0));
            return;
        }

        // Nếu đã qua 30 phút kể từ lần thử cuối, reset lại đếm
        if (now - info.lastAttemptTime > 30 * 60 * 1000) {
            info.failedCount = 1;
            info.lastAttemptTime = now;
            info.lockedUntil = 0;
            return;
        }

        info.failedCount++;
        info.lastAttemptTime = now;

        if (info.failedCount >= MAX_ATTEMPTS_BEFORE_LOCKOUT) {
            info.lockedUntil = now + LOCKOUT_DURATION_MS;
        }
    }

    /**
     * Reset số lần thử khi đăng nhập thành công
     */
    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    /**
     * Kiểm tra tài khoản/IP có đang bị tạm khóa do spam đăng nhập sai không
     */
    public boolean isLocked(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null || info.lockedUntil == 0) {
            return false;
        }

        long now = System.currentTimeMillis();
        if (now > info.lockedUntil) {
            // Hết hạn khóa -> mở lại nhưng vẫn yêu cầu captcha
            info.lockedUntil = 0;
            info.failedCount = MAX_ATTEMPTS_BEFORE_CAPTCHA;
            return false;
        }

        return true;
    }

    /**
     * Lấy số giây còn lại bị khóa
     */
    public long getRemainingLockoutSeconds(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null || info.lockedUntil == 0) return 0;
        long diff = info.lockedUntil - System.currentTimeMillis();
        return diff > 0 ? (diff / 1000) : 0;
    }

    /**
     * Kiểm tra có cần hiển thị Captcha không (nếu sai >= 3 lần)
     */
    public boolean isCaptchaRequired(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null) return false;
        return info.failedCount >= MAX_ATTEMPTS_BEFORE_CAPTCHA;
    }

    /**
     * Lấy số lần đã thử sai
     */
    public int getFailedAttempts(String key) {
        AttemptInfo info = attemptsCache.get(key);
        return info != null ? info.failedCount : 0;
    }
}

