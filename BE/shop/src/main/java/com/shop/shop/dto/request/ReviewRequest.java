package com.shop.shop.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReviewRequest {
    @NotNull(message = "Vui lòng đăng nhập để gửi bình luận đánh giá")
    private Long userId;

    @NotNull(message = "Vui lòng chọn số sao đánh giá")
    @Min(value = 1, message = "Đánh giá tối thiểu là 1 sao")
    @Max(value = 5, message = "Đánh giá tối đa là 5 sao")
    private Integer rating;

    @NotBlank(message = "Nội dung bình luận không được để trống")
    @Size(min = 5, max = 1000, message = "Nội dung bình luận phải từ 5 đến 1000 ký tự")
    private String comment;

    private Long orderId;

    public ReviewRequest() {}

    public Long getUserId() { return userId; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public Long getOrderId() { return orderId; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setRating(Integer rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}

