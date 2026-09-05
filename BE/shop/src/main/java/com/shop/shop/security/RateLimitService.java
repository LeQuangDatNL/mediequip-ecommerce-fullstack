package com.shop.shop.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static class RequestLog {
        long lastRequestTime;
        int requestCount;
        long windowStartTime;

        RequestLog(long time) {
            this.lastRequestTime = time;
            this.requestCount = 1;
            this.windowStartTime = time;
        }
    }

    private final Map<String, RequestLog> rateLimits = new ConcurrentHashMap<>();

    /**
     * Kiểm tra và áp dụng Rate Limit theo IP / Action
     * @param key Định danh duy nhất (VD: "consultation_127.0.0.1")
     * @param maxRequests Số request tối đa trong cửa sổ thời gian
     * @param windowSeconds Thời lượng cửa sổ (giây)
     * @param cooldownSeconds Thời gian chờ tối thiểu giữa 2 request liên tiếp (giây)
     * @return true nếu request được phép, false nếu bị chặn do spam
     */
    public boolean allowRequest(String key, int maxRequests, long windowSeconds, long cooldownSeconds) {
        long now = System.currentTimeMillis();
        long windowMs = windowSeconds * 1000;
        long cooldownMs = cooldownSeconds * 1000;

        RequestLog log = rateLimits.get(key);

        if (log == null) {
            rateLimits.put(key, new RequestLog(now));
            return true;
        }

        // Kiểm tra cooldown giữa 2 request liên tiếp
        if (cooldownSeconds > 0 && (now - log.lastRequestTime) < cooldownMs) {
            return false;
        }

        // Kiểm tra cửa sổ thời gian (Sliding / Fixed Window)
        if (now - log.windowStartTime > windowMs) {
            log.windowStartTime = now;
            log.requestCount = 1;
            log.lastRequestTime = now;
            return true;
        }

        if (log.requestCount >= maxRequests) {
            return false;
        }

        log.requestCount++;
        log.lastRequestTime = now;
        return true;
    }

    /**
     * Lấy số giây còn phải chờ theo cooldown
     */
    public long getRemainingCooldownSeconds(String key, long cooldownSeconds) {
        RequestLog log = rateLimits.get(key);
        if (log == null) return 0;
        long elapsed = System.currentTimeMillis() - log.lastRequestTime;
        long diff = (cooldownSeconds * 1000) - elapsed;
        return diff > 0 ? (diff / 1000) : 0;
    }
}

