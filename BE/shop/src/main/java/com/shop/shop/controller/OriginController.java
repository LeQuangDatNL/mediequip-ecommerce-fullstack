package com.shop.shop.controller;

import com.shop.shop.dto.request.OriginRequest;
import com.shop.shop.dto.response.OriginResponse;
import com.shop.shop.service.OriginService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OriginController {
    private final OriginService originService;

    public OriginController(OriginService originService) {
        this.originService = originService;
    }

    // Public API: Lấy danh sách xuất xứ đang hoạt động
    @GetMapping("/origins")
    public ResponseEntity<List<OriginResponse>> getAllOrigins() {
        return ResponseEntity.ok(originService.findAllActive());
    }

    @GetMapping("/origins/{id}")
    public ResponseEntity<OriginResponse> getOriginById(@PathVariable Long id) {
        return ResponseEntity.ok(originService.findById(id));
    }

    // Admin APIs: Quản lý xuất xứ
    @PostMapping("/admin/origins")
    public ResponseEntity<OriginResponse> createOrigin(@Valid @RequestBody OriginRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(originService.create(request));
    }

    @PutMapping("/admin/origins/{id}")
    public ResponseEntity<OriginResponse> updateOrigin(
            @PathVariable Long id,
            @Valid @RequestBody OriginRequest request
    ) {
        return ResponseEntity.ok(originService.update(id, request));
    }

    @DeleteMapping("/admin/origins/{id}")
    public ResponseEntity<Void> deleteOrigin(@PathVariable Long id) {
        originService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

