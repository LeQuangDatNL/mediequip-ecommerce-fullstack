package com.shop.shop.service;

import com.shop.shop.dto.request.ReviewRequest;
import com.shop.shop.dto.response.ReviewResponse;
import com.shop.shop.entity.Order;
import com.shop.shop.entity.Product;
import com.shop.shop.entity.Review;
import com.shop.shop.entity.User;
import com.shop.shop.repository.OrderRepository;
import com.shop.shop.repository.ProductRepository;
import com.shop.shop.repository.ReviewRepository;
import com.shop.shop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdAndIsDeletedFalse(productId)
                .stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        return reviewRepository.getAverageRatingByProductId(productId);
    }

    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {
        return reviewRepository.countReviewsByProductId(productId);
    }

    @Transactional
    public ReviewResponse createReview(Long productId, ReviewRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("Vui lòng đăng nhập để gửi bình luận đánh giá");
        }
        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung bình luận không được để trống");
        }
        int rating = request.getRating() != null ? Math.max(1, Math.min(5, request.getRating())) : 5;

        Product product = productRepository.findActiveById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + request.getUserId()));

        Order order = null;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId()).orElse(null);
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setOrder(order);
        review.setRating(rating);
        review.setComment(request.getComment().trim());
        review.setIsDeleted(false);

        Review saved = reviewRepository.save(review);
        return ReviewResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bình luận với ID: " + reviewId));
        review.setIsDeleted(true);
        reviewRepository.save(review);
    }
}

