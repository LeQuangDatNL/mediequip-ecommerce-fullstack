package com.shop.shop.dto.response;

import com.shop.shop.entity.Review;
import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Long userId;
    private String userName;
    private String userEmail;
    private Integer rating;
    private String comment;
    private Boolean isDeleted;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    public static ReviewResponse fromEntity(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        if (review.getProduct() != null) {
            res.setProductId(review.getProduct().getId());
            res.setProductName(review.getProduct().getName());
            res.setProductImage(review.getProduct().getPrimaryImageUrl());
        }
        if (review.getUser() != null) {
            res.setUserId(review.getUser().getId());
            res.setUserName(review.getUser().getFullName() != null ? review.getUser().getFullName() : review.getUser().getUsername());
            res.setUserEmail(review.getUser().getEmail());
        }
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setIsDeleted(review.getIsDeleted() != null ? review.getIsDeleted() : false);
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
