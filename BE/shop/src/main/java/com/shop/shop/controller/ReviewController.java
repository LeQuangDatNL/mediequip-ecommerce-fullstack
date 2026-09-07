package com.shop.shop.controller;

import com.shop.shop.dto.request.ReviewRequest;
import com.shop.shop.dto.response.ReviewResponse;
import com.shop.shop.security.RateLimitService;
import com.shop.shop.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "Reviews", description = "API Đánh giá & Bình luận sản phẩm")
@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final RateLimitService rateLimitService;

    public ReviewController(ReviewService reviewService, RateLimitService rateLimitService) {
        this.reviewService = reviewService;
        this.rateLimitService = rateLimitService;
    }

    @Operation(summary = "Xem danh sách đánh giá & bình luận của một sản phẩm (Public)")
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Gửi bình luận & đánh giá sao cho sản phẩm")
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        // Chống spam: Tối đa 10 đánh giá / 5 phút, giãn cách 5s
        if (!rateLimitService.allowRequest("review_" + clientIp, 10, 300, 5)) {
            long remaining = rateLimitService.getRemainingCooldownSeconds("review_" + clientIp, 5);
            String waitMsg = remaining > 0
                    ? "Vui lòng đợi " + remaining + " giây trước khi gửi tiếp đánh giá."
                    : "Bạn đang gửi đánh giá quá thường xuyên. Vui lòng thử lại sau.";
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, waitMsg);
        }

        ReviewResponse response = reviewService.createReview(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== DÀNH CHO ADMIN ====================
    @Operation(summary = "Admin xem & tìm kiếm tất cả bình luận trên hệ thống có phân trang và bộ lọc")
    @GetMapping("/admin/reviews")
    public ResponseEntity<Page<ReviewResponse>> getAdminReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "ALL") String status
    ) {
        Page<ReviewResponse> reviewPage = reviewService.searchAdminReviews(page, size, keyword, productId, rating, status);
        return ResponseEntity.ok(reviewPage);
    }

    @Operation(summary = "Admin ẩn hoặc hiện lại bình luận")
    @PutMapping("/admin/reviews/{id}/toggle-status")
    public ResponseEntity<ReviewResponse> toggleReviewStatus(@PathVariable Long id) {
        ReviewResponse updated = reviewService.toggleReviewStatus(id);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Admin xóa bình luận (Soft delete)")
    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
