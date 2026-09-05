package com.shop.shop.repository;

import com.shop.shop.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.isDeleted = false AND (:name = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Category> findActiveByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    @Query("SELECT c FROM Category c WHERE c.isDeleted = false")
    List<Category> findAllActive(Sort sort);

    @Query("SELECT c FROM Category c WHERE c.id = :id AND c.isDeleted = false")
    Optional<Category> findActiveById(@Param("id") Long id);

    Optional<Category> findFirstByNameIgnoreCaseAndIsDeletedFalse(String name);

    boolean existsBySlugAndIsDeletedFalse(String slug);
    boolean existsBySlugAndIdNotAndIsDeletedFalse(String slug, Long id);
}
