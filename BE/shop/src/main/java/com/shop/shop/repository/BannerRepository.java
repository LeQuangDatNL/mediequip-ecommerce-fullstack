package com.shop.shop.repository;

import com.shop.shop.entity.Banner;
import com.shop.shop.entity.BannerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findAllByIsDeletedFalseOrderByDisplayOrderAsc();

    List<Banner> findAllByStatusAndIsDeletedFalseOrderByDisplayOrderAsc(BannerStatus status);

    Optional<Banner> findByIdAndIsDeletedFalse(Long id);
}

