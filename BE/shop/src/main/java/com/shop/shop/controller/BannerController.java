package com.shop.shop.controller;

import com.shop.shop.dto.request.BannerRequest;
import com.shop.shop.dto.response.BannerResponse;
import com.shop.shop.service.BannerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    // 1. Public API: Lấy danh sách Banner đang hoạt động để hiển thị ở trang chủ
    @GetMapping("/banners")
    public ResponseEntity<List<BannerResponse>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }

    // 2. Admin API: Lấy toàn bộ Banner
    @GetMapping("/admin/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BannerResponse>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // 3. Admin API: Lấy chi tiết Banner theo ID
    @GetMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> getBannerById(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.getBannerById(id));
    }

    // 4. Admin API: Tạo Banner mới
    @PostMapping("/admin/banners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> createBanner(@Valid @RequestBody BannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.createBanner(request));
    }

    // 5. Admin API: Cập nhật Banner
    @PutMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> updateBanner(
            @PathVariable Long id,
            @Valid @RequestBody BannerRequest request) {
        return ResponseEntity.ok(bannerService.updateBanner(id, request));
    }

    // 6. Admin API: Bật / Tắt trạng thái hiển thị Banner
    @PatchMapping("/admin/banners/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BannerResponse> toggleBannerStatus(@PathVariable Long id) {
        return ResponseEntity.ok(bannerService.toggleBannerStatus(id));
    }

    // 7. Admin API: Xóa Banner (xóa mềm)
    @DeleteMapping("/admin/banners/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}

