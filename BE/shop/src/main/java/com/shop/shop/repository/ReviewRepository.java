package com.shop.shop.repository;

import com.shop.shop.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"user", "product"})
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false ORDER BY r.createdAt DESC")
    List<Review> findByProductIdAndIsDeletedFalse(@Param("productId") Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 5.0) FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false")
    Long countReviewsByProductId(@Param("productId") Long productId);

    @EntityGraph(attributePaths = {"user", "product"})
    @Query("SELECT r FROM Review r WHERE " +
           "(:productId IS NULL OR r.product.id = :productId) AND " +
           "(:rating IS NULL OR r.rating = :rating) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(r.comment) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(r.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(r.user.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(r.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(r.product.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Review> searchReviewsForAdmin(
            @Param("keyword") String keyword,
            @Param("productId") Long productId,
            @Param("rating") Integer rating,
            Pageable pageable
    );
}
