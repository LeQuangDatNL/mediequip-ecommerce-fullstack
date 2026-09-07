package com.shop.shop.repository;

import com.shop.shop.entity.UserReport;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM UserReport r WHERE r.user.id = :userId AND r.isDeleted = false ORDER BY r.id DESC")
    List<UserReport> findByUserIdAndIsDeletedFalseOrderByIdDesc(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM UserReport r WHERE r.id = :id AND r.user.id = :userId AND r.isDeleted = false")
    Optional<UserReport> findByIdAndUserIdAndIsDeletedFalse(@Param("id") Long id, @Param("userId") Long userId);
}
