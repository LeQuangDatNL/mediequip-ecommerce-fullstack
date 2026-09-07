package com.shop.shop.repository;

import com.shop.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = {"category", "origin"})
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false " +
           "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           "AND (:originId IS NULL OR (p.origin IS NOT NULL AND p.origin.id = :originId)) " +
           "AND (:keyword IS NULL OR :keyword = '' " +
           "     OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR (p.origin IS NOT NULL AND LOWER(p.origin.name) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    Page<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("originId") Long originId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"category", "origin"})
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Optional<Product> findActiveById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"category", "origin"})
    @Query("SELECT p FROM Product p WHERE p.slug = :slug AND p.isDeleted = false")
    Optional<Product> findBySlugAndIsDeletedFalse(@Param("slug") String slug);

    boolean existsBySlugAndIsDeletedFalse(String slug);
    boolean existsBySlugAndIdNotAndIsDeletedFalse(String slug, Long id);
}
