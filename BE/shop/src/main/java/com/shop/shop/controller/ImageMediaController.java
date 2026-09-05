package com.shop.shop.controller;

import com.shop.shop.dto.request.BatchImageRequest;
import com.shop.shop.dto.response.ImageMediaResponse;
import com.shop.shop.service.ImageMediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/images")
@Tag(name = "Admin Images Media Gallery")
public class ImageMediaController {

    private final ImageMediaService imageMediaService;

    public ImageMediaController(ImageMediaService imageMediaService) {
        this.imageMediaService = imageMediaService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách ảnh trong thư viện (có phân trang và tìm kiếm)")
    public Page<ImageMediaResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "") String keyword
    ) {
        return imageMediaService.findAll(page, size, keyword);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một ảnh")
    public ImageMediaResponse findById(@PathVariable Long id) {
        return imageMediaService.findById(id);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải lên hàng loạt file ảnh từ máy tính (Multipart)")
    public List<ImageMediaResponse> uploadFiles(@RequestParam("files") MultipartFile[] files) {
        return imageMediaService.uploadMultipleFiles(files);
    }

    @PostMapping("/batch-urls")
    @Operation(summary = "Thêm hàng loạt ảnh từ danh sách URL")
    public List<ImageMediaResponse> addBatchUrls(@RequestBody BatchImageRequest request) {
        return imageMediaService.addBatchUrls(request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa mềm ảnh trong thư viện (is_deleted = true)")
    public void delete(@PathVariable Long id) {
        imageMediaService.delete(id);
    }
}

