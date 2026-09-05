package com.shop.shop.repository;

import com.shop.shop.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false ORDER BY r.createdAt DESC")
    List<Review> findByProductIdAndIsDeletedFalse(@Param("productId") Long productId);

    @Query("SELECT COALESCE(AVG(r.rating), 5.0) FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isDeleted = false")
    Long countReviewsByProductId(@Param("productId") Long productId);
}

