package com.shop.shop.repository;

import com.shop.shop.entity.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT c FROM Consultation c " +
           "WHERE c.isDeleted = false " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:keyword IS NULL OR :keyword = '' " +
           "     OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR c.phone LIKE CONCAT('%', :keyword, '%') " +
           "     OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Consultation> searchConsultations(
            @Param("status") Consultation.ConsultationStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT c FROM Consultation c WHERE c.id = :id AND c.isDeleted = false")
    Optional<Consultation> findActiveById(@Param("id") Long id);
}

