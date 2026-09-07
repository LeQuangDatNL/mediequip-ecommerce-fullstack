package com.shop.shop.repository;

import com.shop.shop.entity.Origin;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OriginRepository extends JpaRepository<Origin, Long> {

    @Query("SELECT o FROM Origin o WHERE o.isDeleted = false ORDER BY o.id ASC")
    List<Origin> findAllActive();

    @Query("SELECT o FROM Origin o WHERE o.isDeleted = false")
    List<Origin> findAllActive(Sort sort);

    @Query("SELECT o FROM Origin o WHERE o.id = :id AND o.isDeleted = false")
    Optional<Origin> findActiveById(@Param("id") Long id);

    Optional<Origin> findFirstByNameIgnoreCaseAndIsDeletedFalse(String name);

    Optional<Origin> findFirstByCodeIgnoreCaseAndIsDeletedFalse(String code);

    boolean existsByNameAndIsDeletedFalse(String name);

    boolean existsByNameAndIdNotAndIsDeletedFalse(String name, Long id);
}

