package com.shop.shop.controller;

import com.shop.shop.dto.request.ProductRequest;
import com.shop.shop.dto.response.ProductImportResult;
import com.shop.shop.dto.response.ProductResponse;
import com.shop.shop.service.ProductExcelService;
import com.shop.shop.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api/admin/products", "/api/products"})
@Tag(name = "Products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    private final ProductExcelService productExcelService;

    public ProductController(ProductService productService, ProductExcelService productExcelService) {
        this.productService = productService;
        this.productExcelService = productExcelService;
    }

    @GetMapping
    public Page<ProductResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long originId
    ) {
        return productService.findAll(page, size, keyword, categoryId, originId);
    }

    @GetMapping("/{id}")
    public ProductResponse findById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Tra cứu chi tiết sản phẩm theo Slug (Đường dẫn thân thiện)")
    public ProductResponse findBySlug(@PathVariable String slug) {
        return productService.findBySlug(slug);
    }

    @PostMapping
    @Operation(summary = "Create a product")
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    @GetMapping("/excel-template")
    @Operation(summary = "Tải file Excel mẫu để nhập sản phẩm hàng loạt")
    public ResponseEntity<byte[]> downloadExcelTemplate() {
        byte[] excelBytes = productExcelService.generateTemplate();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"mau_nhap_san_pham.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @PostMapping(value = "/import-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Nhập hàng loạt sản phẩm từ file Excel")
    public ProductImportResult importFromExcel(@RequestParam("file") MultipartFile file) {
        return productExcelService.importProducts(file);
    }

    @GetMapping("/export-excel")
    @Operation(summary = "Xuất toàn bộ danh sách sản phẩm ra file Excel")
    public ResponseEntity<byte[]> exportToExcel() {
        byte[] excelBytes = productExcelService.exportProducts();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"danh_sach_san_pham.xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
