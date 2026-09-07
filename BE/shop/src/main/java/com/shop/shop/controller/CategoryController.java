package com.shop.shop.controller;

import com.shop.shop.dto.request.CategoryRequest;
import com.shop.shop.dto.response.CategoryResponse;
import com.shop.shop.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/admin/categories", "/api/categories"})
@Tag(name = "Admin Categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) { this.categoryService = categoryService; }

    @GetMapping
    @Operation(summary = "Get paginated categories with keyword search")
    public Page<CategoryResponse> findAll(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "") String keyword) {
        return categoryService.findAll(page, keyword);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all categories without pagination for dropdowns")
    public List<CategoryResponse> findAllList() {
        return categoryService.findAllList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public CategoryResponse findById(@PathVariable Long id) { return categoryService.findById(id); }

    @PostMapping
    @Operation(summary = "Create a category")
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) { return categoryService.create(request); }

    @PutMapping("/{id}")
    @Operation(summary = "Update a category")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category")
    public void delete(@PathVariable Long id) { categoryService.delete(id); }
}
