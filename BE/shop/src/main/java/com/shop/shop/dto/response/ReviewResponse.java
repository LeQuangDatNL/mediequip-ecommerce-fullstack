package com.shop.shop.dto.response;

import com.shop.shop.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    public static ReviewResponse fromEntity(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        if (review.getProduct() != null) {
            res.setProductId(review.getProduct().getId());
        }
        if (review.getUser() != null) {
            res.setUserId(review.getUser().getId());
            res.setUserName(review.getUser().getFullName() != null ? review.getUser().getFullName() : review.getUser().getUsername());
        }
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

