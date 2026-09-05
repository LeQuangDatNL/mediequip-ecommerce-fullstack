package com.shop.shop.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    public record CaptchaChallenge(String captchaId, String question, int answer, long expiresAt) {}

    // Lưu trữ tạm thời các mã Captcha đang hoạt động (TTL: 5 phút)
    private final Map<String, CaptchaChallenge> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    /**
     * Tạo câu hỏi Captcha toán học ngẫu nhiên thân thiện (Ví dụ: "15 + 8 = ?")
     */
    public Map<String, Object> generateChallenge() {
        cleanupExpired();

        int a = random.nextInt(20) + 1; // 1 đến 20
        int b = random.nextInt(15) + 1; // 1 đến 15
        boolean isAddition = random.nextBoolean();

        int result;
        String question;

        if (isAddition) {
            result = a + b;
            question = a + " + " + b + " = ?";
        } else {
            // Đảm bảo kết quả dương
            int max = Math.max(a, b);
            int min = Math.min(a, b);
            result = max - min;
            question = max + " - " + min + " = ?";
        }

        String captchaId = UUID.randomUUID().toString();
        long expiresAt = System.currentTimeMillis() + (5 * 60 * 1000); // 5 phút

        captchaStore.put(captchaId, new CaptchaChallenge(captchaId, question, result, expiresAt));

        return Map.of(
            "captchaId", captchaId,
            "question", question,
            "expiresInSeconds", 300
        );
    }

    /**
     * Xác thực câu trả lời Captcha
     */
    public boolean validateCaptcha(String captchaId, String answer) {
        if (captchaId == null || answer == null || captchaId.isBlank() || answer.isBlank()) {
            return false;
        }

        CaptchaChallenge challenge = captchaStore.remove(captchaId);
        if (challenge == null) {
            return false;
        }

        if (System.currentTimeMillis() > challenge.expiresAt()) {
            return false;
        }

        try {
            int parsedAnswer = Integer.parseInt(answer.trim());
            return parsedAnswer == challenge.answer();
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private void cleanupExpired() {
        long now = System.currentTimeMillis();
        captchaStore.entrySet().removeIf(entry -> now > entry.getValue().expiresAt());
    }
}

