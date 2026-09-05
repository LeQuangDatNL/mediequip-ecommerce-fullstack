package com.shop.shop.service;

import com.shop.shop.dto.request.CategoryRequest;
import com.shop.shop.dto.response.CategoryResponse;
import com.shop.shop.entity.Category;
import com.shop.shop.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Phân trang và tìm kiếm danh mục (chỉ lấy is_deleted = false)
    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAll(int page, String keyword) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must not be negative");
        PageRequest request = PageRequest.of(page, 10, Sort.by("id"));
        String search = keyword == null ? "" : keyword.trim();
        return categoryRepository.findActiveByNameContainingIgnoreCase(search, request).map(CategoryResponse::from);
    }

    // Lấy toàn bộ danh mục chưa xóa (cho dropdown chọn danh mục ở Sản phẩm)
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllList() {
        return categoryRepository.findAllActive(Sort.by("id")).stream().map(CategoryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) { return CategoryResponse.from(findCategory(id)); }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        validate(request, null);
        Category category = new Category();
        apply(category, request);
        category.setIsDeleted(false);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findCategory(id);
        validate(request, id);
        apply(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    // Xóa mềm: đánh dấu is_deleted = true và status = INACTIVE
    @Transactional
    public void delete(Long id) {
        Category category = findCategory(id);
        category.setIsDeleted(true);
        category.setStatus(Category.Status.INACTIVE);
        categoryRepository.save(category);
    }

    private Category findCategory(Long id) {
        return categoryRepository.findActiveById(id).orElseThrow(this::notFound);
    }

    private void apply(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setSlug(request.slug().trim());
        category.setDescription(request.description() != null ? request.description().trim() : null);
        category.setStatus(request.status() == null ? Category.Status.ACTIVE : request.status());
    }

    private void validate(CategoryRequest request, Long id) {
        if (request == null || blank(request.name()) || blank(request.slug()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên danh mục và Slug không được để trống");
        String slug = request.slug().trim();
        if ((id == null && categoryRepository.existsBySlugAndIsDeletedFalse(slug))
                || (id != null && categoryRepository.existsBySlugAndIdNotAndIsDeletedFalse(slug, id)))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đường dẫn tĩnh (Slug) danh mục đã tồn tại");
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
    private ResponseStatusException notFound() { return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"); }
}
