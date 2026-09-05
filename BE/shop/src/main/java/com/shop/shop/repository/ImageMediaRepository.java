package com.shop.shop.repository;

import com.shop.shop.entity.ImageMedia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ImageMediaRepository extends JpaRepository<ImageMedia, Long> {
    @Query("SELECT i FROM ImageMedia i WHERE i.isDeleted = false AND (:keyword = '' OR LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<ImageMedia> findActiveImages(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT i FROM ImageMedia i WHERE i.id = :id AND i.isDeleted = false")
    Optional<ImageMedia> findActiveById(@Param("id") Long id);
}

