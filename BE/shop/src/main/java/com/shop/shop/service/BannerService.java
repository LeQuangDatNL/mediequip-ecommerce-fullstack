package com.shop.shop.service;

import com.shop.shop.dto.request.BannerRequest;
import com.shop.shop.dto.response.BannerResponse;
import com.shop.shop.entity.Banner;
import com.shop.shop.entity.BannerStatus;
import com.shop.shop.repository.BannerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findAllByStatusAndIsDeletedFalseOrderByDisplayOrderAsc(BannerStatus.ACTIVE)
                .stream()
                .map(BannerResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAllByIsDeletedFalseOrderByDisplayOrderAsc()
                .stream()
                .map(BannerResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BannerResponse getBannerById(Long id) {
        Banner banner = bannerRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy Banner với ID: " + id));
        return BannerResponse.from(banner);
    }

    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = new Banner();
        banner.setTitle(request.title());
        banner.setSubtitle(request.subtitle());
        banner.setBadgeText(request.badgeText());
        banner.setImageUrl(request.imageUrl());
        banner.setButtonText(request.buttonText() != null && !request.buttonText().isBlank() ? request.buttonText() : "Mua Ngay");
        banner.setButtonLink(request.buttonLink() != null && !request.buttonLink().isBlank() ? request.buttonLink() : "/products");
        banner.setSecondaryButtonText(request.secondaryButtonText());
        banner.setSecondaryButtonLink(request.secondaryButtonLink());
        banner.setDisplayOrder(request.displayOrder() != null ? request.displayOrder() : 0);
        banner.setStatus(request.status() != null ? request.status() : BannerStatus.ACTIVE);
        banner.setIsDeleted(false);

        Banner saved = bannerRepository.save(banner);
        return BannerResponse.from(saved);
    }

    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy Banner với ID: " + id));

        banner.setTitle(request.title());
        banner.setSubtitle(request.subtitle());
        banner.setBadgeText(request.badgeText());
        banner.setImageUrl(request.imageUrl());
        if (request.buttonText() != null) {
            banner.setButtonText(request.buttonText());
        }
        if (request.buttonLink() != null) {
            banner.setButtonLink(request.buttonLink());
        }
        banner.setSecondaryButtonText(request.secondaryButtonText());
        banner.setSecondaryButtonLink(request.secondaryButtonLink());
        if (request.displayOrder() != null) {
            banner.setDisplayOrder(request.displayOrder());
        }
        if (request.status() != null) {
            banner.setStatus(request.status());
        }

        Banner updated = bannerRepository.save(banner);
        return BannerResponse.from(updated);
    }

    public BannerResponse toggleBannerStatus(Long id) {
        Banner banner = bannerRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy Banner với ID: " + id));

        banner.setStatus(banner.getStatus() == BannerStatus.ACTIVE ? BannerStatus.INACTIVE : BannerStatus.ACTIVE);
        Banner updated = bannerRepository.save(banner);
        return BannerResponse.from(updated);
    }

    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy Banner với ID: " + id));

        banner.setIsDeleted(true);
        banner.setStatus(BannerStatus.INACTIVE);
        bannerRepository.save(banner);
    }
}
