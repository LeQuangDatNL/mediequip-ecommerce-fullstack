package com.shop.shop.service;

import com.shop.shop.dto.request.ProductRequest;
import com.shop.shop.dto.response.ProductResponse;
import com.shop.shop.entity.Category;
import com.shop.shop.entity.Origin;
import com.shop.shop.entity.Product;
import com.shop.shop.entity.ProductImage;
import com.shop.shop.repository.CategoryRepository;
import com.shop.shop.repository.OriginRepository;
import com.shop.shop.repository.ProductImageRepository;
import com.shop.shop.repository.ProductRepository;
import com.shop.shop.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OriginRepository originRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            OriginRepository originRepository,
            ProductImageRepository productImageRepository,
            ReviewRepository reviewRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.originRepository = originRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
    }

    // Phân trang và tìm kiếm sản phẩm theo keyword, categoryId và originId
    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(int page, int size, String keyword, Long categoryId, Long originId) {
        if (page < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Page must not be negative");
        int pageSize = size > 0 ? size : 12;
        PageRequest request = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "id"));
        String search = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();
        return productRepository.searchProducts(categoryId, originId, search, request)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(int page, String keyword, Long categoryId, Long originId) {
        return findAll(page, 12, keyword, categoryId, originId);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(int page, String keyword, Long categoryId) {
        return findAll(page, 12, keyword, categoryId, null);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(int page, String keyword) {
        return findAll(page, 12, keyword, null, null);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        Product product = findProduct(id);
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse findBySlug(String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug không hợp lệ");
        }
        Product product = productRepository.findBySlugAndIsDeletedFalse(slug.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm có đường dẫn: " + slug));
        return mapToResponse(product);
    }

    private ProductResponse mapToResponse(Product product) {
        List<ProductImage> pImages = productImageRepository.findByProductId(product.getId());
        List<String> imageUrls = new ArrayList<>();
        if (product.getPrimaryImageUrl() != null && !product.getPrimaryImageUrl().trim().isEmpty()) {
            imageUrls.add(product.getPrimaryImageUrl().trim());
        }
        for (ProductImage pi : pImages) {
            if (pi.getImageUrl() != null && !imageUrls.contains(pi.getImageUrl().trim())) {
                imageUrls.add(pi.getImageUrl().trim());
            }
        }

        Double rating = reviewRepository.getAverageRatingByProductId(product.getId());
        Long reviewCount = reviewRepository.countReviewsByProductId(product.getId());

        return ProductResponse.from(product, imageUrls, rating, reviewCount);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        validate(request, null);
        Product product = new Product();
        apply(product, request);
        product.setIsDeleted(false);
        Product saved = productRepository.save(product);

        // Lưu danh sách ảnh phụ vào product_images
        saveProductImages(saved, request.images());

        return mapToResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        validate(request, id);
        apply(product, request);
        Product saved = productRepository.save(product);

        // Cập nhật danh sách ảnh phụ
        if (request.images() != null) {
            productImageRepository.deleteByProductId(saved.getId());
            saveProductImages(saved, request.images());
        }

        return mapToResponse(saved);
    }

    private void saveProductImages(Product product, List<String> images) {
        if (images != null && !images.isEmpty()) {
            for (String imgUrl : images) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    ProductImage pi = new ProductImage();
                    pi.setProduct(product);
                    pi.setImageUrl(imgUrl.trim());
                    pi.setIsPrimary(imgUrl.trim().equals(product.getPrimaryImageUrl()));
                    productImageRepository.save(pi);
                }
            }
        }
    }

    // Xóa mềm: đánh dấu is_deleted = true và status = INACTIVE
    @Transactional
    public void delete(Long id) {
        Product product = findProduct(id);
        product.setIsDeleted(true);
        product.setStatus(Product.Status.INACTIVE);
        productRepository.save(product);
    }

    private Product findProduct(Long id) {
        return productRepository.findActiveById(id).orElseThrow(this::notFound);
    }

    private void apply(Product product, ProductRequest request) {
        Category category = categoryRepository.findActiveById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy danh mục được chọn"));
        product.setCategory(category);

        if (request.originId() != null) {
            Origin origin = originRepository.findActiveById(request.originId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không tìm thấy xuất xứ/quốc gia được chọn"));
            product.setOrigin(origin);
        } else {
            product.setOrigin(null);
        }

        product.setName(request.name().trim());
        product.setSlug(request.slug().trim());
        product.setDescription(request.description() != null ? request.description().trim() : null);
        product.setPrimaryImageUrl(request.primaryImageUrl() != null ? request.primaryImageUrl().trim() : null);
        product.setStatus(request.status() == null ? Product.Status.ACTIVE : request.status());
    }

    private void validate(ProductRequest request, Long id) {
        if (request == null || request.categoryId() == null || blank(request.name()) || blank(request.slug())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu sản phẩm không hợp lệ (Vui lòng kiểm tra tên, slug, danh mục)");
        }
        String slug = request.slug().trim();
        if ((id == null && productRepository.existsBySlugAndIsDeletedFalse(slug))
                || (id != null && productRepository.existsBySlugAndIdNotAndIsDeletedFalse(slug, id))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đường dẫn tĩnh (Slug) đã tồn tại");
        }
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }
    private ResponseStatusException notFound() { return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"); }
}
